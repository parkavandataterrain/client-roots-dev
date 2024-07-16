import React from "react";

import { useSelector } from "react-redux";
import { selectUserInfo } from "../store/slices/userInfoSlice";

function usePermission() {
  const userInfo = useSelector(selectUserInfo);

  let isPermissionsLoading = userInfo.permissionListStatus === "loading";

  const isAllowed = (permissionID) => {
    const { permissions } = userInfo;

    let foundID = permissions.find(
      (permission) => permission.id === permissionID
    );
    let foundCodeName = permissions.find(
      (permission) => permission.codename === permissionID
    );
    if (foundID || foundCodeName) {
      return true;
    }
    return false;
  };
  return { isPermissionsLoading, isAllowed, userInfo };
}

export default usePermission;
