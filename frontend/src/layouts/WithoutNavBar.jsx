import React from 'react';
import { Outlet } from 'react-router-dom';

const WithoutNavbar = () => (
  <main>
    <Outlet />
  </main>
);

export default WithoutNavbar;
