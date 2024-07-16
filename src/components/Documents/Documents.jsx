import React, { useState, useMemo, useEffect, useCallback } from "react";
import ExternalLinkIcon from "../images/externalLink.svg";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import BasicTable from "../react-table/BasicTable";
import EyeIcon from "../images/eye.svg";
import EditIcon from "../images/edit.svg";
import { useNavigate } from "react-router-dom";
import { protectedApi } from "../../services/api";
import { notifyError } from "../../helper/toastNotication";
import { format } from "date-fns";

const Content = ({ data, columns }) => {
  return (
    <>
      <hr className="w-[99%] mx-auto text-[#bababa]" />
      <BasicTable type={"documents"} columns={columns} data={data} />
    </>
  );
};

function Documents({ clientId }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await protectedApi.get(`/client-documents/${clientId}/`);

      setData(response.data);
    } catch (err) {
      notifyError("Failed to fetch documents!");
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Type",
        accessor: "document_type",
        align: "left",
      },
      {
        Header: "Doc Name",
        accessor: "document_name",
        align: "left",
      },
      {
        Header: "Program",
        accessor: "program",
        align: "left",
      },
      {
        Header: "Uploaded by",
        accessor: "created_by",
        align: "left",
      },
      {
        Header: "Doc Date",
        accessor: "form_completion_date",
        align: "center",
        headerAlign: "center",
        Cell: ({ value }) => {
          return value ? format(value, "MM-dd-yyyy") : "";
        },
      },
      {
        Header: "Uploaded Date",
        accessor: "created_at",
        align: "center",
        headerAlign: "center",
        Cell: ({ value }) => {
          return value ? format(value, "MM-dd-yyyy") : "";
        },
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
          <div className="text-[#28293B] text-xl">Documents</div>
          <img src={ExternalLinkIcon} className="size-4" alt="link" />
        </div>
        <div className="flex items-center gap-x-10">
          <button
            onClick={() => navigate(`/document/add/${clientId}`)}
            className="px-3 py-2 text-sm bg-[#8AD0F5] text-[#1A1F25] rounded-sm font-medium"
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

export default Documents;
