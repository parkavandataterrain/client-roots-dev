import { useMemo } from "react";
import React, { useState } from "react";

import ExternalLinkIcon from "../images/externalLink.svg";
import BasicTable from "../react-table/BasicTable";
import EyeIcon from "../images/eye.svg";
import EditIcon from "../images/edit.svg";
import AddGroup from "./AddGroup";

const Groups = ({ setShowAlert, group, setGroup, available_permissions }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Group Name",
        accessor: "groupName",
        align: "left",
      },
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

  const [user, setUser] = useState({
    username: "admin",
    // permissions: localStorage.getItem("permissions")
    //   ? localStorage.getItem("permissions").split(",")
    //   : ["admin"],
    permissions: [],
  });
  const [list1, setList1] = useState(
    available_permissions.filter(
      (permission) => !user.permissions.includes(permission)
    )
  );
  const [list2, setList2] = useState(user.permissions);

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const addGroup = () => {
    setShowModal(false);
    setShowAlert(true);
  };

  return (
    <div className="flex flex-col  p-3">
      <div className="flex flex-row justify-between pb-3">
        <div className="flex gap-4 items-center">
          <div className="text-[#28293B] text-xl">Groups</div>
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
        data={group}
      />
      {showModal && (
        <AddGroup
          toggleModal={toggleModal}
          handleSubmit={addGroup}
          setGroup={setGroup}
          list1={list1}
          setList1={setList1}
          list2={list2}
          setList2={setList2}
        />
      )}
    </div>
  );
};

export default Groups;
