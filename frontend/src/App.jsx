import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AccountCreation from './pages/AccountCreation';
import DataEntry from './pages/DataEntry';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts/new" element={<AccountCreation />} />
          <Route path="/data-entry" element={<DataEntry />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
