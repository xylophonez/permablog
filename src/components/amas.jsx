import { React, Component } from 'react'
import { Button, Container, Card, Badge } from 'react-bootstrap'
import ReactTooltip from 'react-tooltip'

export default class Amas extends Component {

  constructor(props) {
    super(props);
    this.state = {
     questionModalOpen: false
    };
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
  }

  parseActiveAmas = () => {
    let amas = this.props.data.reverse()
    let amasHtml = []
    for (let i in amas) {
      let ama = amas[i]
     // if (!ama.imported) {
        amasHtml.push(
          <>
          <Card border="dark" className="m-4 mx-auto mb-2">
          <div className="">
            <Card.Header>
              <Button size="lg" variant="link"  href={`#/amas/${ama.id}`}>{ama.guests || ama.guest}</Button>
              { ama.endOn > this.state.height ? 
              <><span className="small" data-html="true" data-tip="ARN (Arweave News Token) is rewarded to users<br/>whose questions are answered by AMA guests,<br/>and to guests for answering questions.">
                <Badge className="" bg="info">{ama.reward} $ARN</Badge>
                <span> </span>
                <Badge bg="success">Active</Badge> </span>
              <ReactTooltip globalEventOff="hover"/></>
              : 
              <span className="small"><Badge bg="secondary">Archived</Badge></span> }
            </Card.Header>
          </div>
          <Card.Body>
            <p>{ama.description}</p>
            { ama.endOn > this.state.height ?
            <Button className="mb-3"  href={`#/amas/${ama.id}`} variant="outline-primary">Ask a question</Button>
            : null }
            <footer className="ama-id"><code className="mt-2">AMA id: {ama.id}</code></footer>
          </Card.Body>
          </Card>
          </>
        )
      //}
  }

    return amasHtml

  }

  parseArchivedAmas = () => {
    let amas = this.props.data
    let amasHtml = []
       for (let i in amas) {
      let ama = amas[i]
      if (ama.imported) {
      amasHtml.push(
        <>
        <Card border="dark" className="m-4 mx-auto mb-2">
          <div className="">
            <Card.Header>
              <Button size="lg" variant="link"  href={`#/amas/${ama.id}`}>{ama.guests || ama.guest}</Button>
              <span><Badge bg="secondary">Archived</Badge></span>
              <ReactTooltip globalEventOff="hover"/>
            </Card.Header>
          </div>
          <Card.Body>
            <p>{ama.description}</p>
            <footer className="ama-id"><code className="mt-2">AMA id: {ama.id}</code></footer>
          </Card.Body>
      </Card>
        </>
      )
      }
    }
    //amasHtml.unshift(
  //    <><div className="h2 mt-4">Archived AMAs</div></>
//)

    return amasHtml
  }

  render() {
    return(
      <>
        <div className="h2">AMAs</div>
        {!this.state.loading ? <h5>Loading...</h5> :
        <><Container>
          {this.parseActiveAmas()}
        </Container>
        <Container>
          {/*this.parseArchivedAmas() */}
        </Container></>
        }
      </>
    )
  }
}