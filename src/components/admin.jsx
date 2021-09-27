import { React, Component } from 'react'
import { Card, Button } from 'react-bootstrap'
import { interactWrite } from 'smartweave'
import { AMA_CONTRACT, arweave } from '../utils/arweave'
import Swal from 'sweetalert2'

export default class Admin extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    let addr = window.arweaveWallet.getActiveAddress()
    this.setState({ addr: addr })
  }

  createAma = async (e) => {
    e.preventDefault()
    const guests = e.target.guests.value;
    const guestAddresses = e.target.guestAddresses.value;
    const description = e.target.description.value;
    const reward = e.target.reward.value;
    const period = e.target.period.value;

    const input = {
      'function': 'createAMA',
      'guests': guests,
      'guestAddresses': guestAddresses,
      'description': description,
      'reward': parseInt(reward),
      'period': parseInt(period)
    }
    const tags = { "Contract-Src": AMA_CONTRACT, "App-Name": "SmartWeaveAction", "App-Version": "0.3.0", "Content-Type": "text/plain" }
    const txId = await interactWrite(arweave, "use_wallet", AMA_CONTRACT, input, tags);

    if (txId) {
      Swal.fire('AMA created!', `check: ${txId}`, 'success')
    } else {
      Swal.fire('Something went wrong', 'Check your wallet has AR', 'error')
    }
  }

  /*

 // guest name or nickname
        const guests = input.guests
        // AMA period in days (time of accepting questions)
        const period = input.period
        // ARN reward for each answered question
        const reward = input.reward
        // The address of the guest which will be used by them to answer the questions
        const guestAddresses = input.guestAddresses
        //some info about the guest.
        const description = input.description

  */

  render() {
    return (
      <>
        <Card>
          <Card.Body>
            <form onSubmit={this.createAma}>
              <div>
                <input
                  placeholder="Guest names"
                  className="modal-field mt-2 mb-2"
                  type="text"
                  id="guests"
                  name="guests"
                >
                </input>
              </div>
              <div>
                <input
                  placeholder="Guest addresses"
                  className="modal-field mt-2 mb-2"
                  type="text"
                  id="guestAddresses"
                  name="guestAddresses"
                >
                </input>
              </div>
              <div>
                <input
                  placeholder="Guest description"
                  className="modal-field mt-2 mb-2"
                  type="text"
                  id="description"
                  name="description"
                >
                </input>
              </div>
              <div>
                <input
                  placeholder="PST reward"
                  className="modal-field mt-2 mb-2"
                  type="text"
                  id="reward"
                  name="reward"
                >
                </input>
              </div>
              <div>
                <input
                  placeholder="Days the AMA should last"
                  className="modal-field mt-2 mb-2"
                  type="text"
                  id="period"
                  name="period"
                >
                </input>
              </div>
              <div>
                {this.state.addr ?
                  <Button {...this.state.submittingQuestion ? `disabled` : ``} variant="outline-primary" className="mt-3 mb-3" type="submit">
                    {this.state.submittingQuestion ? 'Loading...' : 'Create AMA'}
                  </Button>
                  :
                  <Button disabled variant="outline-primary" className="mt-2 mb-5" type="submit">
                    Connect wallet to create a new AMA
                  </Button>
                }
              </div>
            </form>
          </Card.Body>
        </Card>
      </>
    )
  }
}