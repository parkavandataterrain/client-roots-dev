import React, { useState, useMemo, useEffect } from "react";
import ExternalLinkIcon from "../images/externalLink.svg";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import BasicTable from "../react-table/BasicTable";
import EyeIcon from "../images/eye.svg";
import { format } from "date-fns";
import EditIcon from "../images/edit.svg";
import { Link } from "react-router-dom";
import { protectedApi } from "../../services/api";
import PrivateComponent from "../PrivateComponent";

const Content = ({ data, columns }) => {
  console.log(data, columns);
  return (
    <>
      <hr className="w-[99%] mx-auto text-[#bababa]" />
      <BasicTable
        type={"carePlan"}
        defaultPageSize={3}
        columns={columns}
        data={data}
      />
    </>
  );
};

const fetchCarePlans = async (clientId) => {
  try {
    const response = await protectedApi.get(
      `/client-careplan-list/${clientId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

function CarePlan({ clientId }) {
  const [open, setOpen] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchCarePlans(clientId)
      .then((res) => setData(res))
      .catch((err) => console.log(err));
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Program",
        accessor: "program",
        align: "left",
      },
      {
        Header: "User name",
        accessor: "user_name",
        align: "left",
      },
      {
        Header: "Approval status",
        accessor: "approval_status",
      },
      {
        Header: "Approval status Date",
        accessor: "approval_status_date",
        align: "left",
      },
      {
        Header: "Date Created",
        accessor: "created_date",
        align: "left",
        Cell: ({ value }) =>
          value ? format(new Date(value), "MM-dd-yyyy") : "",
      },
      // {
      //   Header: "Goal 1 Problem",
      //   accessor: "goal_1_problem",
      //   align: "left",
      // },
      // {
      //   Header: "Goal 2 Problem",
      //   accessor: "goal_2_problem",
      //   align: "left",
      // },
      // {
      //   Header: "Goal 1 status",
      //   Cell: ({ row }) => <Tag text={row.original.goal_1_status} />,
      // },
      // {
      //   Header: "Goal 2 status",
      //   Cell: ({ row }) => <Tag text={row.original.goal_2_status} />,
      // },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-x-3 items-center mx-auto justify-center">
            <PrivateComponent permission="edit_care_plan_for_clients_in_my_program">
              <Link
                to={`/care-plan/add/${clientId}/?carePlanId=${row.original.id}&mode=edit`}
              >
                <img src={EditIcon} className="size-4" alt="edit" />
              </Link>
            </PrivateComponent>
            <Link
              to={`/care-plan/add/${clientId}/?carePlanId=${row.original.id}&mode=view`}
            >
              <img src={EyeIcon} className="size-4" alt="view" />
            </Link>
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
          <div className="text-[#28293B] text-xl">Care Plan</div>
          <img src={ExternalLinkIcon} className="size-4" alt="link" />
        </div>
        <div className="flex items-center gap-x-10">
          <PrivateComponent permission="create_care_plan_for_clients_in_my_program">
            <Link to={`/care-plan/add/${clientId}`}>
              <button className="px-3 py-2 text-sm bg-[#FFF2E9] text-[#1A1F25] rounded-sm font-medium">
                Add New
              </button>
            </Link>
          </PrivateComponent>
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

export default CarePlan;
