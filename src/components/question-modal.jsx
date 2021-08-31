import {React, Component} from 'react'
import { Modal, Button } from 'react-bootstrap'

export default class QuestionModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      question: null,
      addr: '123'
    };
  }

  handleChange = (e) => {
    this.setState({question: e.target.value})
  }

render() {
  return(
  <>
  <Modal
        show={this.props.showQuestionModal}
        onHide={this.props.hideQuestionModal}
      >
      <Modal.Body>
      <form onSubmit={this.props.onSubmit}>
                    <div>
                        <input
                            placeholder="AMA ID (e.g. @arweaveNews_1615928471657_AMA)"
                            className="modal-field mt-2"
                            type="text"
                            id="amaId"
                            name="amaId"
                            disabled={this.props.amaId}
                            defaultValue={this.props.amaId}
                            >
                        </input>
                    </div>
                    <div>
                        <textarea
                            placeholder="Your question..."
                            className="modal-field"
                            type="text"
                            rows="5"
                            id="questionText"
                            name="questionText"
                            onChange={this.handleChange}
                            value={this.state.question}
                        />
                    </div>         
                    <div>
                        { this.state.addr ? 
                             <Button {...this.state.submittingQuestion ? `disabled` : ``} variant="outline-primary" className="mt-3 mb-3" type="submit">
                                {this.state.submittingQuestion ? 'Loading...' : 'Submit question' }
                              </Button>
                            :
                            <Button disabled variant="outline-primary" className="mt-2 mb-5" type="submit">
                                Connect wallet to submit
                            </Button>
                        }
                    </div>
                </form>
      </Modal.Body>
      </Modal>
      </>
                
  )

}
}