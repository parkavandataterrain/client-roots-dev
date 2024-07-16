import React, { useState } from "react";
import { useMemo } from "react";

import Header from "../../components/AdminDashboard/Header";
import BasicTable from "../../components/react-table/BasicTable";
import SideBar from "../../components/AdminDashboard/sidebar";
import { PERMISSIONS } from "../../components/permissions";
import EyeIcon from "../../components/images/eye.svg";
import EditIcon from "../../components/images/edit.svg";
import ExternalLinkIcon from "../../components/images/externalLink.svg";
import Users from "../../components/AdminDashboard/User";
import Groups from "../../components/AdminDashboard/Group";
import AlertSuccess from "../../components/common/AlertSuccess";

const Admin = () => {
  const [showAlert, setShowAlert] = useState(false);
  const closeAlert = () => {
    setShowAlert(false);
  };

  // Groups
  const [group, setGroup] = useState([
    {
      groupName: "Super Users",
      permissions: [
        "admin",
        "create_form",
        "view_care_form",
        "view_encounter_form",
      ],
    },
    {
      groupName: "System Admin",
      permissions: [
        "admin",
        "create_form",
        "view_care_form",
        "view_encounter_form",
      ],
    },
    {
      groupName: "Program Assigners",
      permissions: [
        "admin",
        "create_form",
        "view_care_form",
        "view_encounter_form",
      ],
    },
    {
      groupName: "Document Admins",
      permissions: [
        "admin",
        "create_form",
        "view_care_form",
        "view_encounter_form",
      ],
    },
    {
      groupName: "Data Managers",
      permissions: [
        "admin",
        "create_form",
        "view_care_form",
        "view_encounter_form",
      ],
    },
  ]);

  //Users
  const [user, setUser] = useState([
    {
      email: "rootsadmin@gmail.com",
      userName: "rootsadmin",
      firstName: "John",
      lastName: "Doe",
      groupName: "users",
      staffStatus: "Active",
    },
    {
      email: "rootsstaff@gmail.com",
      userName: "rootsstaff",
      firstName: "Ken",
      lastName: "Anthony",
      groupName: "Super Users",
      staffStatus: "Active",
    },
    {
      email: "rootsadmin@gmail.com",
      userName: "rootsadmin",
      firstName: "John",
      lastName: "Doe",
      groupName: "System Admin",
      staffStatus: "Active",
    },
    {
      email: "rootsstaff@gmail.com",
      userName: "rootsstaff",
      firstName: "Ken",
      lastName: "Anthony",
      groupName: "Program Assigners",
      staffStatus: "Active",
    },
    {
      email: "rootsadmin@gmail.com",
      userName: "rootsadmin",
      firstName: "John",
      lastName: "Doe",
      groupName: "Program Assigners",
      staffStatus: "Active",
    },
    {
      email: "rootsstaff@gmail.com",
      userName: "rootsstaff",
      firstName: "Ken",
      lastName: "Anthony",
      groupName: "Document Admins",
      staffStatus: "Active",
    },
    {
      email: "rootsadmin@gmail.com",
      userName: "rootsadmin",
      firstName: "John",
      lastName: "Doe",
      groupName: "Document Admins",
      staffStatus: "Active",
    },
    {
      email: "rootsstaff@gmail.com",
      userName: "rootsstaff",
      firstName: "Ken",
      lastName: "Anthony",
      groupName: "Data Managers",
      staffStatus: "Active",
    },
    {
      email: "rootsstaff@gmail.com",
      userName: "rootsstaff",
      firstName: "Ken",
      lastName: "Anthony",
      groupName: "Super Users",
      staffStatus: "Active",
    },
  ]);

  const available_permissions = [
    "admin",
    "create_form",
    "view_care_form",
    "view_encounter_form",
  ];

  return (
    <div className="h-full bg-gray-50 space-y-5">
      {showAlert && (
        <AlertSuccess message="New User Created" handleClose={closeAlert} />
      )}
      <Header />
      {/* <div className="bg-white shadow"> */}
      <div className="flex flex-row">
        <div className="grid grid-cols-12 gap-x-4">
          <div className="col-span-7 bg-white shadow">
            <Users
              showAlert={setShowAlert}
              user={user}
              setUser={setUser}
              group={group}
            />
          </div>
          <div className="col-span-5 bg-white shadow">
            <Groups
              showAlert={setShowAlert}
              group={group}
              setGroup={setGroup}
              available_permissions={available_permissions}
            />
          </div>
        </div>

        {/* <div className='flex flex-col justify-center'>
                    <div className='flex flex-row space-x-12 justify-center items-center'>
                        <div className='flex flex-col'>
                            <label for="availableScreens" class="block mb-2 text-sm font-medium ">Available Screens</label>
                            <select id="availableScreens" size="5" class="bg-white border border-gray-300  text-sm rounded-lg block w-full p-2.5 dark overflow-hidden">

                                {list1.map(item => (
                                    <option key={item} onClick={() => moveItem(list1, list2, item, 'right')}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='flex flex-col'>
                            <label for="permittedScreens" class="block mb-2 text-sm font-medium ">Permitted Screens</label>
                            <select id="permittedScreens" size="5" class="bg-white border border-gray-300  text-sm rounded-lg block w-full p-2.5 dark overflow-hidden">
                                {list2.map(item => (
                                    <option key={item} onClick={() => moveItem(list2, list1, item, 'left')}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div> */}
      </div>
      {/* </div> */}
    </div>
  );
};

export default Admin;
