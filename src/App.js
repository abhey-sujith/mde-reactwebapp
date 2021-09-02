import './App.css';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import RouteList from './routes'

function App() {
  return (
    <Router>
    <div className="App">
    <RouteList/>
    </div>
    </Router>
  );
}

export default App;
