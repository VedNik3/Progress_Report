import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify
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
        position="top-right" // Customize the position of the toast
        autoClose={5000}     // Set how long the toast will stay visible (in ms)
        hideProgressBar={false} // Display progress bar on the toast
        newestOnTop={false}  // Place newest toast on top
        closeOnClick={true}  // Close toast on click
        rtl={false}          // Set to true for right-to-left languages
        pauseOnFocusLoss={false} // Stop the toast when focus is lost
        draggable
        pauseOnHover // Pause the toast on hover
      />
    </Router>
  );
}

export default App;
