import './App.css';
import Crud from './views/crud';
import Login from './views/login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/crud" element={<Crud />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
