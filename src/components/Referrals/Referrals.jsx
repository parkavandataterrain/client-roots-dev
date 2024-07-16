import React, { useState, useMemo, useEffect } from "react";
import ExternalLinkIcon from "../images/externalLink.svg";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import BasicTable from "../react-table/BasicTable";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "../images/edit.svg";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Tag from "../Tag/Tag";
import { protectedApi } from "../../services/api";
import { notifyError } from "../../helper/toastNotication";

const Content = ({ data, columns }) => {
  console.log(data, columns);
  return (
    <>
      <hr className="w-[99%] mx-auto text-[#bababa]" />
      <BasicTable
        type={"referrals"}
        defaultPageSize={3}
        columns={columns}
        data={data}
      />
    </>
  );
};

function Referrals({ clientId }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [data, setData] = useState([
    {
      referred_to: "ECM",
      referred_by: "...",
      notes: "...",
      date: "1-1-2000",
      time: "10 a.m",
      activity_no: "...",
      status: "Done",
    },
    {
      referred_to: "ECM",
      referred_by: "...",
      notes: "...",
      date: "1-1-2000",
      time: "10 a.m",
      activity_no: "...",
      status: "Active",
    },
    {
      referred_to: "ECM",
      referred_by: "...",
      notes: "...",
      date: "1-1-2000",
      time: "10 a.m",
      activity_no: "...",
      status: "Pending",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await protectedApi.get(
          `/referral-client-data/${clientId}/`
        );

        setData(response.data);
      } catch (error) {
        notifyError("Failed to fetch referrals");
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Referred to",
        accessor: "program_name",
        align: "left",
      },
      {
        Header: "Referred by",
        accessor: "referred_by_username",
        align: "left",
      },
      {
        Header: "Notes",
        accessor: "comments",
        align: "left",
      },
      {
        Header: "Date",
        accessor: "submitted_date",
        align: "left",
        Cell: ({ value }) => (value ? format(value, "MM-dd-yyyy") : ""),
      },
      {
        Header: "Time",
        accessor: "submitted_time",
        align: "left",
        Cell: ({ value }) =>
          value ? format("2000-01-01T" + value, "hh:mm a") : "",
      },
      {
        Header: "Activity No",
        accessor: "activity_name",
        align: "left",
        Cell: ({ value }) => value?.[0] || "",
      },
      {
        Header: "Status",
        accessor: "status",
        align: "left",
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <img src={EditIcon} className="size-4 mx-auto" alt="view" />
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
          <div className="text-[#28293B] text-xl">Referrals</div>
          <img src={ExternalLinkIcon} className="size-4" alt="link" />
        </div>
        <div className="flex items-center gap-x-10">
          <SearchIcon className="text-[#585A60] hover:cursor-pointer" />
          <button
            onClick={() =>
              navigate(`/assignments-and-referrals/${clientId}?tab=referrals`)
            }
            className="px-3 py-2 text-sm bg-[#FFD9EB] text-[#1A1F25] rounded-sm font-medium"
          >
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

export default Referrals;
