import { React, Component } from 'react'
import './App.css';
import Header from './components/header.jsx'
import Ama from './components/ama.jsx'
import Index from './components/index.jsx'
import { HashRouter as Router, Route } from 'react-router-dom'
import Amas from './components/amas.jsx'
import Admin from './components/admin.jsx'
import { readContract } from 'smartweave'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AMA_CONTRACT, arweave } from './utils/arweave'

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
     amas: []
    };
  }

  async componentDidMount() {
    window.addEventListener("arweaveWalletLoaded", () => {
      this.setState({arconnectInstalled: true})
    });
    this.loadAma()
  }

  loadAma = async () => {
    let arr = []
    let tx = await readContract(arweave, AMA_CONTRACT)
    for (const [key, value] of Object.entries(tx.ama)) {
      arr.push(value)
    }
    this.setState({amas: arr})
  }

  render() {
    return (
      <div className="App">
        <Router>
          <div className="topBar"><Header/></div>
            {<Route exact path="/amas/:amaId" render={({match}) => <Ama match={match} data={this.state.amas}/> } />}
            <Route exact path="/" render={() => <Index/> }/>
            <Route exact path="/amas" render={() => <Amas data={this.state.amas}/> }/>
            <Route exact path="/admin" render={() => <Admin/>} />
          </Router>
      </div>
    );
  }
}

