import FakeStackOverFlow from './components/fakestackoverflow.js'
import { BrowserRouter as Router} from 'react-router-dom';

function App() {
    return (
        <Router>
            <div className="fakeso">
                <FakeStackOverFlow />
            </div>
        </Router>
    );
}

export default App;
