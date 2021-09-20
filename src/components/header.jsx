import { React, Component } from 'react'
import { Navbar, Button, NavLink } from 'react-bootstrap'
import Swal from 'sweetalert2'

export default class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      walletConnected: false
    };
  }

  installArConnectAlert = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Install ArConnect to continue',
      text: 'Permablog uses ArConnect to make it easier to authenticate and send transactions for questions and answers',
      footer: '<a href="https://arconnect.io" rel="noopener noreferrer" target="_blank">Download ArConnect here</a>'
    })
  }

  arconnectConnect = () => {
    if (window.arweaveWallet) {
      window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGNATURE', 'SIGN_TRANSACTION'])
      this.setState({walletConnected: true})
    } else {
      this.installArConnectAlert()
    }
  }

  arconnectDisconnect = () => {
    window.arweaveWallet.disconnect()
    this.setState({walletConnected: false}) 
  }

  render() {
    return (
      <div className="topBar">
        <Navbar className="border-bottom mb-4">
        <NavLink className="btn navbar-item text-decoration-none" href="#/amas"><Navbar.Brand>permablog</Navbar.Brand></NavLink>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <div className="d-flex">
            <Navbar.Text className="p-2">
          {this.state.walletConnected ? 
                 <Button variant="outline-danger" onClick={ () => this.arconnectDisconnect() }>Disconnect wallet</Button> :
                 <Button variant="primary" onClick={ () => this.arconnectConnect() }>Connect wallet</Button>
              }
              </Navbar.Text>
              </div>
              </Navbar.Collapse>
      </Navbar>
</div>

    )
  }
}