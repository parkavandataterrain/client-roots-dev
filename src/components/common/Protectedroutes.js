import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { routes } from '../../constants/routes';

const Protectedroutes = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);


  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate to={routes.index} state={{ from: location }} relative={true} />
    );
  }

  return <Outlet />;
};

export default Protectedroutes;
