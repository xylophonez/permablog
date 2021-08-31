import {React, Component} from 'react'
import { Modal, Button } from 'react-bootstrap'

export default class AnswerModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      answer: null,
      addr: '123'
    };
  }

  handleChange = (e) => {
    this.setState({answer: e.target.value})
  }

render() {
  return(
  <>
  <Modal
        show={this.props.showAnswerModal}
        onHide={this.props.hideAnswerModal}
      >
      <Modal.Body>
      <form onSubmit={this.props.onSubmit}>
                    <div>
                        <input
                            placeholder="Question ID"
                            className="modal-field mt-2"
                            type="text"
                            id="qId"
                            name="qId"
                            disabled={this.props.questionId}
                            defaultValue={this.props.questionId}
                            >
                        </input>
                    </div>
                    <div>
                        <textarea
                            placeholder="Your answer..."
                            className="modal-field"
                            type="text"
                            rows="5"
                            id="answerText"
                            name="answerText"
                            onChange={this.handleChange}
                            value={this.state.answer}
                        />
                    </div>         
                    <div>
                        { this.state.addr ? 
                             <Button {...this.state.submittingQuestion ? `disabled` : ``} variant="outline-primary" className="mt-3 mb-3" type="submit">
                                {this.state.submittingQuestion ? 'Loading...' : 'Submit answer' }
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