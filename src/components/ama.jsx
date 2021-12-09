import { React, Component } from 'react'
import { Alert, Button, Card, Badge } from 'react-bootstrap'
import QuestionModal from './question-modal.jsx'
import AnswerModal from './answer-modal.jsx'
import ReactTooltip from 'react-tooltip'
import { readContract, interactWrite } from 'smartweave'
import { AMA_CONTRACT, arweave } from '../utils/arweave'
import Swal from 'sweetalert2'

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

  getBlockHeight = async () => {
    const url = 'https://arweave.net'
    let res = await fetch(url)
    let body = await res.json()
    this.setState({height: body.height})
  }

  async componentDidMount() {
    this.getBlockHeight()
    this.setState({loading: true})
    this.setState({ama: await this.lookUpAma()})
    this.setState({loading: false})
  }
  
  amaGuest = (ama) => {
    return (ama.guest || ama.guests)
  }

  getQuestions = (ama) => {
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
            {q.answers && q.answers.length > 0 || ama.imported ? null : <span><Button className="mb-4" onClick={() => this.showAnswerModal(q['QID'], ama)} variant="link">Answer</Button></span> }
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
        return answerHtml // only find the first answer
        }
      }
    }

  lookUpAma = async () => {
    let ama
    let amaId = this.props.match.params.amaId
    let amas = await this.loadAma()

    for (let i in amas) {
      if (amas[i].id === amaId) {
        ama = amas[i]
      }
    }



      return(
        <div>
        <div className="">
            <span className="ama-guest-name">{this.amaGuest(ama)}</span>
            { ama.endOn > this.state.height ? <><span className="small p-4" data-html="true" data-tip="ARN (Arweave News Token) is rewarded to users<br/>whose questions are answered by AMA guests,<br/>and to guests for answering questions."><Badge bg="info">{ama.reward} $ARN</Badge></span></> : null }
            <ReactTooltip globalEventOff="hover"/>
        </div>
          <p className="ama-desc">{ama.description}</p>
          <footer className="ama-id"><code className="mt-2">AMA id: {ama.id}</code></footer>
          { ama.endOn > this.state.height ? <><Button className="m-3" onClick={() => this.showQuestionModal(ama)} variant="primary">Ask a question</Button></> : null }
          {this.getQuestions(ama)}
    </div>
      )
  }

  loggedIn = async () => {
    if (window.arweaveWallet) {
      let permissions = await window.arweaveWallet.getPermissions()
      return permissions.length > 2 && await window.arweaveWallet.getActiveAddress() ? true : false
    }
    else {
      return false
    }
  }

  getAddr = async () => {
    let addr = await window.arweaveWallet.getActiveAddress()
    return addr
  }

  authErrorAlert = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Log in to ask and answer questions',
      text: 'Permablog uses ArConnect to make it easy to authenticate',
      footer: '<a href="https://arconnect.io" rel="noopener noreferrer" target="_blank">Learn more about ArConnect</a>'
    })
  }

  notGuestAlert = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you the guest of this AMA?',
      text: "Only the AMA guest can answer questions. If that's you, change to the right wallet in ArConnect",
      footer: '<a href="https://arconnect.io rel="noopener noreferrer" target="_blank">Learn more about ArConnect</a>'
    })
  }

  showAnswerModal = async (qId, ama) => {
    if (!await this.loggedIn()) {
      this.authErrorAlert()
    } else {
      let addr = await this.getAddr()
      if (ama.guestAddresses.includes(addr)) {
      this.setState({qId: qId})
      this.setState({answerModalOpen: true})
      } else {
        this.notGuestAlert()
      }
    }
  }

  hideAnswerModal = () => {
    this.setState({answerModalOpen: false})
  }

  showQuestionModal = async (ama) => {
    if (!await this.loggedIn()) {
      this.authErrorAlert()
    } else {
      this.setState({amaId: ama.id})
      this.setState({questionModalOpen: true})
    }
  }

  hideQuestionModal = () => {
    this.setState({questionModalOpen: false})
  }

  onQuestionFormSubmit = (e) => {
    this.setState({submitAlert: false})
    e.preventDefault()
    let question = e.target.questionText.value
    let amaId = e.target.amaId.value
    this.createQuestion(amaId, question)
    this.setState({questionModalOpen: false})
  }

  onAnswerFormSubmit = (e) => {
    e.preventDefault()
    let answerText = e.target.answerText.value
    let qId = e.target.qId.value
    let amaId = this.props.match.params.amaId
    this.createAnswer(qId, amaId, answerText)
    this.setState({answerModalOpen: false})
  }

  interactionWrapper = async (input, tags) => {
    const tx = await arweave.createTransaction({
      data: String(Date.now()),
    });
  
    for (let tag in tags) {
      tx.addTag(tag, tags[tag]);
    }
  
    tx.addTag("Input", JSON.stringify(input));
    tx.reward = (+tx.reward * 10).toString();
  
    await arweave.transactions.sign(tx);
    await arweave.transactions.post(tx);
  
    return tx.id;
  };

    createQuestion = async (amaId, questionText) => {
      const input = {'function': 'ask', 'id': amaId, 'question': questionText}
      const tags = { "Contract-Src": AMA_CONTRACT, "App-Name": "SmartWeaveAction", "App-Version": "0.3.0", "Content-Type": "text/plain" }
      const txId = await this.interactionWrapper(input, tags); // await interactWrite(arweave, "use_wallet", AMA_CONTRACT, input, tags)
      if (txId) {
        this.setState({
          lastQuestionTx: txId,
          submitAlert: true,
          questionFailed: false         
        })
      } else {
        this.setState({
          submitAlert: false,
          questionFailed: true
        })
      }
  }

  createAnswer = async (qId, amaId, answerText) => {
    const input = {'function': 'answer', 'id': amaId, 'qid': qId, 'answer': answerText}
    const tags = { "Contract": AMA_CONTRACT, "App-Name": "SmartWeaveAction", "App-Version": "0.3.0", "Content-Type": "text/plain" }
    const txId = await this.interactionWrapper(input, tags); //await interactWrite(arweave, "use_wallet", AMA_CONTRACT, input, tags)
    if (txId) {
      this.setState({
        lastAnswerTx: txId,
        answerSubmitAlert: true,
        answerFailed: false
      })
    } else {
      this.setState({
        answerSubmitAlert: false,
        answerFailed: true
      })
    }
  }

  render() {
     return(
      <>
      {/* question success and failure alerts */}
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

      {/* answer success and failure alerts */}
      { this.state.answerFailed ?
      <Alert transition="fade" className="mt-4 show alert alert-danger">
         Answer failed to submit - check you are connected with an account that holds AR
       </Alert>
      : null}
      { this.state.answerSubmitAlert ?
         <Alert transition="fade" className="mt-4 show alert alert-success">
         Answer submitted! {" "}<a href={`https://viewblock.io/arweave/tx/${this.state.lastAnswerTx}`}>Check on viewblock.io in a few minutes</a>
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
      {this.state.loading? <h5>Loading AMA...</h5> : 
      <>{this.state.ama}</>
      }
      </>
    )
  }
}
