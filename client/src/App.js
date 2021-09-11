
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import Login from './Components/Login/Login';
import Main from './Components/Main';
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Main/>
          </Route>
          <Route exact path="/loginpart">
            <Login/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
