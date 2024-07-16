import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { routes } from '../../constants/routes';

const ProtectedRoutes = () => {
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (!isLoggedIn) {
    return (
      <Navigate to={routes.index} state={{ from: location }} replace={true} />
    );
  }

  return <Outlet />;
};

export default ProtectedRoutes;
