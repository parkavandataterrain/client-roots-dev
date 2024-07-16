import { useMemo } from "react";
import React, { useState } from "react";

import ExternalLinkIcon from "../images/externalLink.svg";
import BasicTable from "../react-table/BasicTable";
import EyeIcon from "../images/eye.svg";
import EditIcon from "../images/edit.svg";
import AddUser from "./AddUser";

const Users = ({ setShowAlert, user, setUser, group }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Email",
        accessor: "email",
        align: "left",
      },
      {
        Header: "User Name",
        accessor: "userName",
      },
      {
        Header: "Group",
        accessor: "groupName",
      },
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Staff Status",
        accessor: "staffStatus",
      },
      //   {
      //     Header: "Status",
      //     Cell: ({ row }) => <Tag text={row.original.status} />,
      //   },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-x-3 items-center mx-auto justify-center">
            <img src={EditIcon} className="size-4" alt="edit" />
            <img src={EyeIcon} className="size-4" alt="view" />
          </div>
        ),
      },
    ],
    []
  );

  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const addUser = () => {
    setShowModal(false);
    setShowAlert(true);
  };

  return (
    <div className="flex flex-col  p-3">
      <div className="flex flex-row justify-between pb-3">
        <div className="flex gap-4 items-center">
          <div className="text-[#28293B] text-xl">Users</div>
          <img src={ExternalLinkIcon} className="size-4" alt="link" />
        </div>
        <button
          className="px-3 py-1.5 text-xs bg-[#5BC4BF] text-white rounded-sm font-medium"
          onClick={toggleModal}
        >
          Add New
        </button>
      </div>
      <hr className="w-[99%] mx-auto text-[#bababa]" />
      <BasicTable
        type={"encounterNotes"}
        defaultPageSize={10}
        columns={columns}
        data={user}
      />
      {showModal && (
        <AddUser
          toggleModal={toggleModal}
          setUser={setUser}
          group={group}
          // handleSubmit={addUser}
          //   savedEvents={savedEvents}
          //   setSavedEvents={setSavedEvents}
          //   setShowAlert={setShowAlert}
          //   fetchEvents={fetchEvents}
        />
      )}
    </div>
  );
};

export default Users;
