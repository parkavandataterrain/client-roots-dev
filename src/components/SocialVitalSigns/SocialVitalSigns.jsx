import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fetchSocialVitalSignsAsync } from "../../store/slices/socialVitalSignsSlice";
import ExternalLinkIcon from "../images/externalLink.svg";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import BasicTable from "../react-table/BasicTable";
import EyeIcon from "../images/eye.svg";
import Tag from "../Tag/Tag";

const Content = ({ data, columns }) => {
  return (
    <div className="flex-grow flex flex-col">
      <hr className="w-[99%] mx-auto text-[#bababa] flex-grow-0" />
      <BasicTable
        type={"socialVitalSigns"}
        defaultPageSize={10}
        columns={columns}
        data={data}
      />
    </div>
  );
};

function SocialVitalSigns({ clientId }) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.socialVitalSigns.data);
  const dataLoading = useSelector((state) => state.socialVitalSigns.loading);

  useState(() => {
    if (!dataLoading) {
      dispatch(fetchSocialVitalSignsAsync({ clientId }));
    }
  }, []);

  const [open, setOpen] = useState(true);

  const columns = useMemo(
    () => [
      {
        Header: "Domain",
        accessor: "domain",
        align: "left",
      },
      {
        Header: "Risk",
        align: "center",
        headerAlign: "center",
        Cell: ({ row }) => <Tag text={row.original.risk} />,
      },
      {
        Header: "Last Assessed",
        accessor: "changed_at",
        align: "center",
        headerAlign: "center",
        Cell: ({ value }) => (value ? format(value, "MM-dd-yyyy") : ""),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <Link
            to={`/socialvitalsigns/${clientId}`}
            state={`${row.original.domain}`}
          >
            <img src={EyeIcon} className="size-4 mx-auto" alt="view" />
          </Link>
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
          <div className="text-[#28293B] text-xl">Social Vital Signs</div>
          <img src={ExternalLinkIcon} className="size-4" alt="link" />
        </div>
        <div className="flex items-center gap-x-4">
          {/* {!dataLoading && data.length === 0 && ( */}
          <Link
            to={`/svs/${clientId}`}
            className="px-3 py-2 text-sm bg-[#F2D2BC] rounded-sm font-medium"
          >
            View all
          </Link>
          {/* )} */}
          <Link
            to={`/addNewSocialVitalSigns/${clientId}`}
            className="px-3 py-2 text-sm bg-[#5BC4BF] text-white rounded-sm font-medium"
          >
            Add New
          </Link>
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

export default SocialVitalSigns;
