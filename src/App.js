import logo from './logo.svg';
import './App.css';
import Homepage from './homepage';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import UserPage from './UserPage';

function App() {

  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Homepage} />
        <Route path='/user' exact component={UserPage} />
      </Switch>
    </Router>
  );
}

export default App;