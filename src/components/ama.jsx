import { React, Component } from 'react'
import { Alert, Button, Row, Card } from 'react-bootstrap'
import QuestionModal from './question-modal.jsx'
import AnswerModal from './answer-modal.jsx'
import ReactTooltip from 'react-tooltip'
import { readContract, interactWrite } from 'smartweave'
import { AMA_CONTRACT, arweave } from '../utils/arweave'

export default class Ama extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }
  

loadAma = async () => {
    let arr = []
    let tx = await readContract(arweave, AMA_CONTRACT)
    for (const [key, value] of Object.entries(tx.ama)) {
      arr.push(value)
    }
    return arr
  }


  async componentDidMount() {
    this.setState({ama: await this.lookUpAma()})
  }
  
  amaGuest = (ama) => {
    return (ama.guest || ama.guests)
  }

  getQuestions = (ama) => {
    console.log(ama)
    let questions = []
    let qs = ama.questions
    let as = ama.answers
    for (let i in qs) {
      let q = qs[i]
      questions.push(
        <div>
          <Card border="dark" className="p-2 m-4 mb-4">
            <span className="mt-4 m-2" ><span><strong>{q.question} </strong></span><code className="ama-id">({q['QID']})</code></span>
            <hr/>
            {this.getAnswers(q, as)}
            {q.answers && <span className="answer-text unalign">{q.answers[0]}</span>}
            {q.answers && q.answers.length > 0 ? null : <span><Button className="mb-4" onClick={() => this.showAnswerModal(q['QID'])} variant="link">Answer</Button></span> }
          </Card>
        </div>
      )
    }
    return questions
  }

  getAnswers = (q, as) => { // finds all answers associated with a question, returns array of HTML blocks to be added to getQuestions
    let answers = []
    let answerHtml = []
      for (let j in as) {
        let a = as[j]
        if (a.answerTo === q['QID']) {
          answerHtml.push(
            <>
              <p>{a.answer}</p>
            </>
          )
        }
      }
      return answerHtml
    }

  lookUpAma = async () => {
    let ama
    let amaId = this.props.match.params.amaId
    let amas = await this.loadAma()
    console.log(amas)

    for (let i in amas) {
      console.log(amas[i])
      if (amas[i].id === amaId) {
        ama = amas[i]
      }
    }
      return(
        <div>
        <div className="">
            <span className="ama-guest-name">{this.amaGuest(ama)}</span>
            <span className="small p-4" data-html="true" data-tip="ARN (Arweave News Token) is rewarded to users<br/>whose questions are answered by AMA guests,<br/>and to guests for answering questions.">[{ama.reward} $ARN]</span>
            <ReactTooltip globalEventOff="hover"/>
        </div>
          <p className="ama-desc">{ama.description}</p>
          <footer className="ama-id"><code className="mt-2">AMA id: {ama.id}</code></footer>
          { !ama.imported ? <Button className="m-3" onClick={() => this.showQuestionModal(ama)} variant="primary">Ask a question</Button> : null }
          {this.getQuestions(ama)}
    </div>
      )
  }

  showAnswerModal = (qId) => {
    console.log(qId)
    this.setState({qId: qId})
    this.setState({answerModalOpen: true})
    console.log(this.state)
  }

  hideAnswerModal = () => {
    this.setState({answerModalOpen: false})
  }

  showQuestionModal = (ama) => {
    this.setState({amaId: ama.id})
    this.setState({questionModalOpen: true})
  }

  hideQuestionModal = () => {
    this.setState({questionModalOpen: false})
  }

  onQuestionFormSubmit = (e) => {
    this.setState({submitAlert: false})
    e.preventDefault()
    let question = e.target.questionText.value
    let amaId = e.target.amaId.value
    console.log(question)
    console.log(amaId)
    this.createQuestion(amaId, question)
    this.setState({questionModalOpen: false})
  }

  onAnswerFormSubmit = (e) => {
    e.preventDefault()
    let answerText = e.target.answerText.value
    let qId = e.target.qId.value
    let amaId = this.props.match.params.amaId
    console.log(this.state)
    this.createAnswer(qId, amaId, answerText)
    this.setState({answerModalOpen: false})
  }

    createQuestion = async (amaId, questionText) => {
      const input = {'function': 'ask', 'id': amaId, 'question': questionText}
      const tags = { "Contract-Src": AMA_CONTRACT, "App-Name": "SmartWeaveAction", "App-Version": "0.3.0", "Content-Type": "text/plain" }
      const txId = await interactWrite(arweave, "use_wallet", AMA_CONTRACT, input, tags)
      if (txId) {
        this.setState({lastQuestionTx: txId})
        this.setState({submitAlert: true})
        this.setState({questionFailed: false})
      } else {
        this.setState({submitAlert: false})
        this.setState({questionFailed: true})
      }
  }

  createAnswer = async (qId, amaId, answerText) => {
    console.log(amaId)
    const input = {'function': 'answer', 'id': amaId, 'qid': qId, 'answer': answerText}
    const tags = { "Contract-Src": AMA_CONTRACT, "App-Name": "SmartWeaveAction", "App-Version": "0.3.0", "Content-Type": "text/plain" }
    const txId = await interactWrite(arweave, "use_wallet", AMA_CONTRACT, input, tags)
    if (txId) {
      console.log(txId)
    } else {
      console.log('some error!')
    }
  }

  render() {
     return(
      <>
      { this.state.questionFailed ?
      <Alert transition="fade" className="mt-4 show alert alert-danger">
         Question failed to submit - check you are connected with an account that holds AR
       </Alert>
       
      : null}
      { this.state.submitAlert ?
         <Alert transition="fade" className="mt-4 show alert alert-success">
         Question submitted! {" "}<a href={`https://viewblock.io/arweave/tx/${this.state.lastQuestionTx}`}>Check on viewblock.io in a few minutes</a>
       </Alert>
      : null }
      { this.state.questionModalOpen ? 
        <QuestionModal
          showQuestionModal={this.state.questionModalOpen}
          hideQuestionModal={this.hideQuestionModal}
          amaId={this.state.amaId}
          onSubmit={this.onQuestionFormSubmit}
        /> 
      : null }
      { this.state.answerModalOpen ?
        <AnswerModal
        showAnswerModal={this.state.answerModalOpen}
        hideAnswerModal={this.hideAnswerModal}
        amaId={this.state.ama.id}
        questionId={this.state.qId}
        onSubmit={this.onAnswerFormSubmit}
       />
       : null
       }
      {this.state.ama}
      </>
    )
  }
}