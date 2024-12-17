import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import CandidateLogin from './componentes/CandidateLogin';
import Dashboard from './componentes/Dashboard';
import AdminDashboard from './componentes/AdminDashboard';
import CandidateSignup from './componentes/CandidateSignup';
import AdminProgress from './componentes/AdminProgress';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CandidateLogin />} />
        <Route path="/signup" element={<CandidateSignup />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/progress" element={<AdminProgress />} />
        <Route path="/dashboard/:candidateId" element={<Dashboard />} />
      </Routes>
      
      {/* ToastContainer for displaying toast messages globally */}
      <ToastContainer 
        position="top-right" 
        autoClose={5000}     
        hideProgressBar={false} 
        newestOnTop={false}  
        closeOnClick={true}  
        rtl={false}          
        pauseOnFocusLoss={false} 
        draggable
        pauseOnHover 
      />
    </Router>
  );
}

export default App;
