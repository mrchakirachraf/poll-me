import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WithNavbar from './layouts/WithNavBar';
import WithoutNavbar from './layouts/WithoutNavBar';
import HomePage from './routes/HomePage';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';
import PollMe from './routes/PollMe';
import PollPage from './routes/PollPage';
import UserPage from './routes/UserPage';
import StatisticsPage from './routes/StatisticsPage';
import DeletePollPage from './routes/DeletePollPage';


import './App.css';
import "./tailwind.css";

const App = () => (
  <Router>
    <Routes>
    
      {/* Pages with Navbar */}
      <Route element={<WithNavbar />}>
        <Route path='/home-page' element={<HomePage />} />
        <Route path='/sondages/:id_sondage' element={<PollPage />} />
        <Route path='/sondages/user/:id_user' element={<UserPage />} />
        <Route path="/sondages/:id_sondage/statistics" element={<StatisticsPage />} />
        <Route path="/sondages/:id_sondage/delete" element={<DeletePollPage />} />

         
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
