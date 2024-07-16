import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDiagnosesInfoAsync } from "../../store/slices/diagnosesSlice";
import ExternalLinkIcon from "../images/externalLink.svg";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import BasicTable from "../react-table/BasicTable";
import EyeIcon from "../images/eye.svg";
import SearchIcon from "@mui/icons-material/Search";
import DiagnosesModal from "./DiagnosesModal";
import Tag from "../Tag/Tag";

const Content = ({ data, columns }) => {
  return (
    <>
      <hr className="w-[99%] mx-auto text-[#bababa]" />
      <BasicTable
        type={"diagnoses"}
        defaultPageSize={3}
        columns={columns}
        data={data}
      />
    </>
  );
};

function Diagnoses({ clientId, setShowModal, showModal }) {
  const dispatch = useDispatch();
  const [id, setId] = useState(null);
  const data = useSelector((state) => state.diagnoses.data);
  const dataLoading = useSelector((state) => state.diagnoses.loading);

  const [open, setOpen] = useState(true);
  const [disable, setDisable] = useState(false);
  const [selectedRow, setSelectedRow] = useState(true);

  function fetchData() {
    if (!dataLoading) {
      dispatch(fetchDiagnosesInfoAsync({ clientId }));
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Diagnosis Name",
        accessor: "diagnosis_name",
        align: "left",
      },
      {
        Header: "Comments",
        accessor: "comments",
        align: "left",
      },
      {
        Header: "Last Updated By",
        accessor: "last_updated_by",
        align: "left",
      },
      {
        Header: "Last Updated Date",
        accessor: "last_updated_date",
        align: "left",
        Cell: ({ value }) => {
          if (!value) return "";

          // Parse the date string
          const date = new Date(value);
          // Extract day, month, and year
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          // Format date as "dd-mm-yyyy"
          return `${month}-${day}-${year}`;
        },
      },
      {
        Header: "Start Date",
        accessor: "start_date",
        align: "left",
        Cell: ({ value }) => {
          if (!value) return "";

          // Parse the date string
          const date = new Date(value);
          // Extract day, month, and year
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          // Format date as "dd-mm-yyyy"
          return `${month}-${day}-${year}`;
        },
      },
      {
        Header: "Stop Date",
        accessor: "stop_date",
        align: "left",
        Cell: ({ value }) => {
          if (!value) return "";

          // Parse the date string
          const date = new Date(value);
          // Extract day, month, and year
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          // Format date as "dd-mm-yyyy"
          return `${month}-${day}-${year}`;
        },
      },
      {
        Header: "Status",
        Cell: ({ row }) => <Tag text={row.original.diagnosis_status} />,
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <button
            type="button"
            onClick={(e) => {
              setDisable(true);
              setId(row.original.id);
              toggleModal();
            }}
          >
            <img src={EyeIcon} className="size-4 mx-auto" alt="view" />
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div
      id="clientChartClientProfile"
      className={`bg-white rounded-md shadow-sm flex flex-col 
      } ${open ? "h-full" : ""}`}
    >
      <div className="flex justify-between p-3">
        <div className="flex gap-4 items-center">
          <div className="text-[#28293B] text-xl">Diagnoses</div>
          <img src={ExternalLinkIcon} className="size-4" alt="link" />
        </div>
        <div className="flex items-center gap-x-10">
          <SearchIcon className="text-[#585A60] hover:cursor-pointer" />
          <button
            className="px-3 py-2 text-sm bg-[#D9F1FF] text-[#1A1F25] rounded-sm font-medium"
            onClick={() => {
              setDisable(false);
              setShowModal(true);
            }}
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
      {showModal && (
        <DiagnosesModal
          toggleModal={toggleModal}
          clientId={clientId}
          fetchData={fetchData}
          data={disable ? data : null}
          id={id}
          disable={disable}
        />
      )}
    </div>
  );
}

export default Diagnoses;
