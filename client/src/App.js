
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import Main from './Components/Main';
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Main/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
