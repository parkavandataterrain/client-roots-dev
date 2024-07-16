import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMedicationInfoAsync } from "../../store/slices/medicationSlice";
import ExternalLinkIcon from "../images/externalLink.svg";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import BasicTable from "../react-table/BasicTable";
import EditIcon from "../images/edit.svg";
import SearchIcon from "@mui/icons-material/Search";
import MedicationsModal from "./MedicationsModal";
import TextBox from "../common/TextBox";
import Tag from "../Tag/Tag";

const Content = ({ data, columns }) => {
  return (
    <>
      <hr className="w-[99%] mx-auto text-[#bababa]" />
      <BasicTable
        type={"medications"}
        defaultPageSize={3}
        columns={columns}
        data={data}
      />
    </>
  );
};

function Medications({ clientId, setShowModal, showModal }) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.medication.data);
  const dataLoading = useSelector((state) => state.medication.loading);

  const [id, setId] = useState(null);

  function fetchData() {
    if (!dataLoading) {
      dispatch(fetchMedicationInfoAsync({ clientId }));
    }
  }

  useState(() => {
    fetchData();
  }, []);

  const [open, setOpen] = useState(true);
  const [update, setUpdate] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: "Medication",
        accessor: "medication",
        align: "left",
      },
      {
        Header: "Comment",
        accessor: "comments",
        align: "left",
      },
      {
        Header: "Updated By",
        accessor: "last_updated_by",
        align: "left",
      },
      {
        Header: "Updated Date",
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
        Header: "status",
        Cell: ({ row }) => <Tag text={row.original.status} />,
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <img
            src={EditIcon}
            className="size-4 mx-auto"
            alt="view"
            onClick={() => {
              setUpdate(true);
              setId(row.original.id);
              toggleModal();
            }}
          />
        ),
      },
    ],
    []
  );

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div
      id="clientChartClientProfile"
      className={`bg-white rounded-md shadow-sm flex flex-col ${
        open ? "h-full" : ""
      }`}
    >
      <div className="flex justify-between p-3">
        <div className="flex gap-4 items-center">
          <div className="text-[#28293B] text-xl">Medications</div>
          <img src={ExternalLinkIcon} className="size-4" alt="link" />
        </div>
        <div className="flex items-center gap-x-10">
          <SearchIcon className="text-[#585A60] hover:cursor-pointer" />
          <button
            className="px-3 py-2 text-sm bg-[#E4C3B1] text-white rounded-sm font-medium"
            onClick={() => {
              setUpdate(false);
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
        <MedicationsModal
          toggleModal={toggleModal}
          clientId={clientId}
          fetchData={fetchData}
          data={update ? data : null}
          id={id}
          update={update}
        />
      )}
    </div>
  );
}

export default Medications;
