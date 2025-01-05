import React from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import { Outlet } from 'react-router-dom';

const WithNavbar = () => {
  return (
    <>
        <NavBar />
            <main>
                <Outlet />
            </main>
        <Footer />
    </>
  );
};

export default WithNavbar;
