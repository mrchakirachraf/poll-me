import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WithNavbar from './layouts/WithNavBar';
import WithoutNavbar from './layouts/WithoutNavBar';
import HomePage from './routes/HomePage';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';
import PollMe from './routes/PollMe';


import './App.css'
import "./tailwind.css"

const App = () => (
  <Router>
    <Routes>
    
      {/* Pages with Navbar */}
      <Route element={<WithNavbar />}>
        <Route path='/home-page' element={<HomePage />} />
        
      </Route>
      {/* Pages without Navbar */}
      <Route element={<WithoutNavbar />}>
        <Route path="" element={<PollMe />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>

    </Routes>
  </Router>
);

export default App
