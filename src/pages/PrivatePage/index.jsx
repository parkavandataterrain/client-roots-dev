import React from "react";
import usePermission from "../../hooks/usePermission";
import { Navigate } from "react-router-dom";

function PrivatePage({ permission = "", children }) {
  const { isAllowed, isPermissionsLoading } = usePermission();

  if (isPermissionsLoading) {
    return (
      <div className="flex flex-column justify-center items-center gap-2 w-100 h-100">
        <p className="text-xs font-bold m-0">Please wait</p>
      </div>
    );
  }

  if (!isPermissionsLoading && !isAllowed(permission)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivatePage;
