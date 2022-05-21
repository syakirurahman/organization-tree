import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Employees from './pages/employees/Employees';
import './App.scss'

function App() {

  return (
    <div className="app-wrapper">
      <div className='app-header'>
        <h1>Justice League Inc.</h1>
      </div>
      <Router>
          <Routes>
            <Route element={<Employees />} index />
            <Route element={<Employees />} path="/employees" />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
