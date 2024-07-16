import React from 'react';
import HorizontalSidebar from '../SideBar/HorizontalSidebar';
import Navbar from '../NavBar/NavBar';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <main className="">
      <Navbar />
      <section className='m-4'>
        <Outlet />
      </section>
    </main>
  );
};

export default RootLayout;
