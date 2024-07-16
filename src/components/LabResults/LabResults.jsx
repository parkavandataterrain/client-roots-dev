import React, { useState, useMemo } from "react";
import ExternalLinkIcon from "../images/externalLink.svg";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import BasicTable from "../react-table/BasicTable";
import EyeIcon from "../images/eye.svg";
import SearchIcon from "@mui/icons-material/Search";

const Content = ({ data, columns }) => {
  console.log(data, columns);
  return (
    <>
      <hr className="w-[99%] mx-auto text-[#bababa]" />
      <BasicTable
        type={"labResults"}
        defaultPageSize={3}
        columns={columns}
        data={data}
      />
    </>
  );
};

function LabResults({ clientId }) {
  const [open, setOpen] = useState(true);
  const [data, setData] = useState([
    {
      collection_date: "1-1-2024",
      diagnosic_test_results: "Cholest SerPl-mCnc",
      results: "195",
      out_of_range: "...",
      flag: "N",
      units: "mg/dL",
      lab: "Quest - All Facilities",
      ordering_provider: "Golden, Donald",
      source: "AMD",
    },
    {
      collection_date: "1-1-2024",
      diagnosic_test_results: "LDLc SerPl Calc-mCnc",
      results: "...",
      out_of_range: "115",
      flag: "N",
      units: "mg/dL",
      lab: "Quest - All Facilities",
      ordering_provider: "Golden, Donald",
      source: "AMD",
    },
    {
      collection_date: "1-1-2024",
      diagnosic_test_results: "...",
      results: "..",
      out_of_range: "...",
      flag: "N",
      units: "...",
      lab: "...",
      ordering_provider: "...",
      source: "AMD",
    },
  ]);

  const columns = useMemo(
    () => [
      {
        Header: "Collection Date",
        accessor: "collection_date",
        align: "left",
      },
      {
        Header: "Diagnosic Test/Results",
        accessor: "diagnosic_test_results",
        align: "left",
      },
      {
        Header: "Results",
        accessor: "results",
      },
      {
        Header: "Out of Range",
        accessor: "out_of_range",
      },
      {
        Header: "Flag",
        accessor: "flag",
        align: "left",
      },
      {
        Header: "Units",
        accessor: "units",
      },
      {
        Header: "Lab",
        accessor: "lab",
        align: "left",
      },
      {
        Header: "Ordering Provider",
        accessor: "ordering_provider",
        align: "left",
      },
      {
        Header: "Source",
        accessor: "source",
        align: "left",
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
          <div className="text-[#28293B] text-xl">
            Lab Results <span className="italic text-xs">[from AMD]</span>
          </div>
          <img src={ExternalLinkIcon} className="size-4" alt="link" />
        </div>
        <div className="flex items-center gap-x-10">
          <SearchIcon className="text-[#585A60] hover:cursor-pointer" />
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

export default LabResults;
