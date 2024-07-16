import React from 'react';
import HorizontalSidebar from '../SideBar/HorizontalSidebar';
import Navbar from '../NavBar/NavBar';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { routes } from '../../constants/routes';

const RootLayout = () => {


  return (
    <main className="">
      <Navbar />
      <section className="m-4">
        <Outlet />
      </section>
    </main>
  );
};

export default RootLayout;
