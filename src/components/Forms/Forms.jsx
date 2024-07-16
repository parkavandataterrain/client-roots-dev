import React, { useState, useMemo } from "react";
import ExternalLinkIcon from "../images/externalLink.svg";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import BasicTable from "../react-table/BasicTable";
import EyeIcon from "../images/eye.svg";
import EditIcon from "../images/edit.svg";
import Tag from "../Tag/Tag";

const Content = ({ data, columns }) => {
  console.log(data, columns);
  return (
    <>
      <hr className="w-[99%] mx-auto text-[#bababa]" />
      <BasicTable type={"forms"} columns={columns} data={data} />
    </>
  );
};

function Forms({ clientId }) {
  const [open, setOpen] = useState(true);
  const [data, setData] = useState([
    {
      program: "ECM",
      form_name: "...",
      date: "1-1-2000",
      status: "Done",
    },
    {
      program: "Diabetes",
      form_name: "...",
      date: "1-1-2000",
      status: "Active",
    },
    {
      program: "STOMP",
      form_name: "...",
      date: "1-1-2000",
      status: "Pending",
    },
    {
      program: "Diabetes",
      form_name: "...",
      date: "1-1-2000",
      status: "Done",
    },
    {
      program: "ECM",
      form_name: "...",
      date: "1-1-2000",
      status: "Done",
    },
  ]);

  const columns = useMemo(
    () => [
      {
        Header: "Program",
        accessor: "program",
        align: "left",
      },
      {
        Header: "Form Name",
        accessor: "form_name",
        align: "left",
      },
      {
        Header: "Date",
        accessor: "date",
        align: "left",
      },
      {
        Header: "Status",
        Cell: ({ row }) => <Tag text={row.original.status} />,
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

  return (
    <div
      id="clientChartClientProfile"
      className={`bg-white rounded-md shadow-sm flex flex-col ${
        open ? "h-full" : ""
      }`}
    >
      <div className="flex justify-between p-3">
        <div className="flex gap-4 items-center">
          <div className="text-[#28293B] text-xl">Forms</div>
          <img src={ExternalLinkIcon} className="size-4" alt="link" />
        </div>
        <div className="flex items-center gap-x-10">
          <button className="px-3 py-2 text-sm bg-[#FFF6C4] text-[#1A1F25] rounded-sm font-medium">
            Add New
          </button>
          <RemoveCircleIcon
            onClick={() => setOpen(!open)}
            className="text-[#585A60] hover:cursor-pointer"
          />
        </div>
      </div>
      {open && <Content data={data} columns={columns} />}
    </div>
  );
}

export default Forms;
