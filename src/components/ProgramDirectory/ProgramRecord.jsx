import React, { useState, useMemo, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../helper/axiosInstance";
import MUIDataGridWrapper from "../HOC/MUIDataGridWrapper";
import { notifyError, notifySuccess } from "../../helper/toastNotication";

import EditPNG from "../images/edit.png";
import DeactivatePNG from "../images/deactivate.png";

import ActivateIcon from "../images/activate_icon.svg";
import DeactivateIcon from "../images/deactivate_icon.svg";
import PrivateComponent from "../PrivateComponent";
import Swal from "sweetalert2";

export default function ProgramRecord() {
  const { recordid } = useParams();
  const navigate = useNavigate();

  const [recordData, setRecordData] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [isDeactivating, setIsDeactivating] = useState({
    state: false,
    label: "",
  });

  useEffect(() => {
    fetchData();
  }, [recordid]);

  const fetchData = () => {
    axios
      .get(`/api/resources/program/${recordid}`)
      .then((response) => {
        setLoadingData(true);
        setRecordData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching SVS Questions:", error);
      })
      .finally(() => {
        setLoadingData(false);
      });
  };

  const primaryContactManagementTableRows = useMemo(() => {
    if (JSON.stringify(recordData) === "{}" || loadingData) {
      return [];
    }
    return recordData.primary_contact.map((item) => {
      return {
        id: item.id,
        StaffName: `${item?.first_name || " "} ${item?.last_name || " "}`,
        StaffTitle: item.profile?.position || "",
        StaffEmail: item.email || "",
        StaffPhone: item.email || "",
        LinkToContactCard: "Link to contact card",
      };
    });
  }, [recordData, loadingData]);

  const primaryContactReferralsTableRows = useMemo(() => {
    if (JSON.stringify(recordData) === "{}" || loadingData) {
      return [];
    }

    return recordData.client_matter_contact.map((item) => {
      return {
        id: item.id,
        StaffName: `${item?.first_name || " "} ${item?.last_name || " "}`,
        StaffTitle: item.profile?.position || "",
        StaffEmail: item.email || "",
        StaffPhone: item.email || "",
        LinkToContactCard: "Link to contact card",
      };
    });
  }, [recordData, loadingData]);

  const additionalTeamMembersTableRows = useMemo(() => {
    if (JSON.stringify(recordData) === "{}" || loadingData) {
      return [];
    }
    return recordData.team_members.map((item) => {
      return {
        id: item.id,
        StaffName: `${item?.first_name || " "} ${item?.last_name || " "}`,
        StaffTitle: item.profile?.position || "",
        StaffEmail: item.email || "",
        StaffPhone: item.email || "",
        LinkToContactCard: "Link to contact card",
      };
    });
  }, [recordData, loadingData]);

  const deactivateRecord = (isActive) => {
    let actionPerformed = isActive ? "Deactivate" : "Activate";

    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${actionPerformed} ?`,
      icon: isActive ? "error" : "info",
      showCancelButton: true,
      confirmButtonColor: isActive ? "#d33" : "#5BC4BF",
      cancelButtonColor: "#D3D3D3",
      confirmButtonText: actionPerformed,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsDeactivating({
          state: true,
          label: isActive ? "Deactivating" : "Activating",
        });
        axios
          .delete(`/api/resources/program/${recordid}`)
          .then((response) => {
            // navigate(-1);
            fetchData();
            notifySuccess(`${actionPerformed}d Successfully`);
          })
          .catch((error) => {
            notifyError(`Could not ${actionPerformed}, please try again later`);
            console.error("Error" + actionPerformed + ":", error);
          })
          .finally(() => {
            setIsDeactivating({
              state: false,
              label: isActive ? "Deactivated" : "Activated",
            });
            setIsDeactivating(false);
          });
      }
    });
  };

  return (
    <>
      <div className="w-100 flex flex-row gap-2 justify-end items-center my-1">
        <PrivateComponent permission="change_programs">
          <button
            className="p-1 px-2 hover:bg-teal-400 hover:text-white bg-opacity-50 hover:rounded flex justify-center items-center gap-2"
            onClick={() => {
              navigate(`/update-program-directory/${recordid}`);
            }}
          >
            <span>Edit</span>
            <img
              src={EditPNG}
              className="w-4 h-4"
              style={{ display: "block", margin: "0 auto" }}
            />
          </button>
        </PrivateComponent>
        <PrivateComponent permission="delete_programs">
          <button
            className={`p-1 px-2 hover:bg-${
              recordData.is_active ? "red" : "teal"
            }-400 hover:text-white bg-opacity-50 hover:rounded flex justify-center items-center gap-2`}
            onClick={() => {
              deactivateRecord(recordData?.is_active);
            }}
          >
            <span>{recordData?.is_active ? "Deactivate" : "Activate"}</span>
            <img
              src={recordData?.is_active ? DeactivateIcon : ActivateIcon}
              className="w-6 h-6"
              style={{ display: "block", margin: "0 auto" }}
            />
          </button>
        </PrivateComponent>
      </div>
      <div className="container mx-auto sm:grid-cols-12 md:grid-cols-7 shadow p-0">
        {isDeactivating.state && (
          <div className="flex flex-column absolute top-0 left-0 items-center justify-center gap-2 w-100 h-100 bg-gray-100/80">
            <svg
              className="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-base">{isDeactivating.label}</p>
          </div>
        )}

        <div className="w-100 bg-[#5BC4BF] text-white p-2.5 px-4">
          {recordData.name}
        </div>
        <div className="flex flex-column gap-4 p-4">
          <ProgramDetail
            dptName={recordData.department_name}
            progName={recordData.name}
            description={recordData?.description}
            eligibility={recordData?.eligibility}
            loadingData={loadingData}
          />
          <PrimaryContactManagementTable
            rows={primaryContactManagementTableRows}
            loadingData={loadingData}
          />
          <PrimaryContactReferralsTable
            rows={primaryContactReferralsTableRows}
            loadingData={loadingData}
          />
          <AdditionalTeamMembersTable
            rows={additionalTeamMembersTableRows}
            loadingData={loadingData}
          />
          <PriorityListTable />
        </div>
      </div>
    </>
  );
}

const ProgramDetail = ({
  loadingData,
  dptName = "",
  description = "",
  eligibility = "",
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-1 my-2">
        <p className="text-base m-0 p-0 flex gap-2 items-center">
          <span className="fw-medium">Department:</span>
          <span className="fw-bold">{loadingData ? "loading.." : dptName}</span>
        </p>
      </div>
      <div className="col-start-1 col-span-1">
        <FormField label="Description">
          <textarea
            rows={4}
            style={{ resize: "none" }}
            value={description}
            // placeholder="Description.."
            className={`placeholder:text-sm appearance-none border-1 border-[#5BC4BF] rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          />
        </FormField>
      </div>
      <div className="col-span-1">
        <FormField label="Eligibility">
          <textarea
            rows={4}
            style={{ resize: "none" }}
            value={eligibility}
            // placeholder="Eligibility.."
            className={`placeholder:text-sm appearance-none border-1 border-[#5BC4BF] rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          />
        </FormField>
      </div>
    </div>
  );
};

const PrimaryContactManagementTable = ({ rows, loadingData }) => {
  // const rows = [
  //   {
  //     id: 1,
  //     StaffName: "John",
  //     StaffTitle: "Staff Title",
  //     StaffEmail: "Staff Email",
  //     StaffPhone: "Staff phone",
  //     LinkToContactCard: "Link to contact card",
  //   },
  //   {
  //     id: 2,
  //     StaffName: "John",
  //     StaffTitle: "Staff Title",
  //     StaffEmail: "Staff Email",
  //     StaffPhone: "Staff phone",
  //     LinkToContactCard: "Link to contact card",
  //   },
  //   {
  //     id: 3,
  //     StaffName: "John",
  //     StaffTitle: "Staff Title",
  //     StaffEmail: "Staff Email",
  //     StaffPhone: "Staff phone",
  //     LinkToContactCard: "Link to contact card",
  //   },
  //   {
  //     id: 4,
  //     StaffName: "John",
  //     StaffTitle: "Staff Title",
  //     StaffEmail: "Staff Email",
  //     StaffPhone: "Staff phone",
  //     LinkToContactCard: "Link to contact card",
  //   },
  // ];

  return (
    <Box sx={{ width: "100%", my: 1 }}>
      <div className="flex flex-column gap-2 w-100 ">
        <p className="mb-2 fw-medium text-base">
          Primary Contact(s) for management/administration
        </p>
        <MUIDataGridWrapper>
          <DataGrid
            loading={loadingData}
            rows={rows}
            columns={[
              {
                field: "StaffName",
                headerName: "Staff Name",
                flex: 1,
                headerClassName: "bg-[#5BC4BF] text-white font-medium",
              },
              {
                field: "StaffTitle",
                headerName: "Staff Title",
                flex: 1,
                headerClassName: "bg-[#5BC4BF] text-white font-medium",
              },
              {
                field: "StaffEmail",
                headerName: "Staff Email",
                flex: 1,
                headerClassName: "bg-[#5BC4BF] text-white font-medium",
              },
              {
                field: "StaffPhone",
                headerName: "Staff Phone",
                flex: 1,
                headerClassName: "bg-[#5BC4BF] text-white font-medium",
              },
              {
                field: "LinkToContactCard",
                headerName: "Link To Contact Card",
                flex: 1,
                headerClassName: "bg-[#5BC4BF] text-white font-medium",
                renderCell: (params) => {
                  return (
                    <>
                      <Link
                        to={`/staff-directory/${params.row.id}`}
                        className="text-[#5BC4BF]"
                      >
                        {params.row.LinkToContactCard}
                      </Link>
                    </>
                  );
                },
              },
            ]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[3, 5, 10, 25]}
            disableRowSelectionOnClick
          />
        </MUIDataGridWrapper>
      </div>
    </Box>
  );
};
const PrimaryContactReferralsTable = ({ rows, loadingData }) => {
  return (
    <Box sx={{ width: "100%", my: 1 }}>
      <div className="flex flex-column gap-2 w-100 ">
        <p className="mb-2 fw-medium text-base">
          Primary Contact(s) for referrals/client care matters
        </p>
        <MUIDataGridWrapper>
          <DataGrid
            loading={loadingData}
            rows={rows}
            columns={[
              {
                field: "StaffName",
                headerName: "Staff Name",
                flex: 1,
                headerClassName: "bg-[#2F9384] text-white font-medium",
              },
              {
                field: "StaffTitle",
                headerName: "Staff Title",
                flex: 1,
                headerClassName: "bg-[#2F9384] text-white font-medium",
              },
              {
                field: "StaffEmail",
                headerName: "Staff Email",
                flex: 1,
                headerClassName: "bg-[#2F9384] text-white font-medium",
              },
              {
                field: "StaffPhone",
                headerName: "Staff Phone",
                flex: 1,
                headerClassName: "bg-[#2F9384] text-white font-medium",
              },
              {
                field: "LinkToContactCard",
                headerName: "Link To Contact Card",
                flex: 1,
                headerClassName: "bg-[#2F9384] text-white font-medium",
                renderCell: (params) => {
                  return (
                    <>
                      <Link
                        to={`/staff-directory/${params.row.id}`}
                        className="text-[#5BC4BF]"
                      >
                        {params.row.LinkToContactCard}
                      </Link>
                    </>
                  );
                },
              },
            ]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[3, 5, 10, 25]}
            disableRowSelectionOnClick
          />
        </MUIDataGridWrapper>
      </div>
    </Box>
  );
};
const AdditionalTeamMembersTable = ({ rows, loadingData }) => {
  return (
    <Box sx={{ width: "100%", my: 1 }}>
      <div className="flex flex-column gap-2 w-100 ">
        <p className="mb-2 fw-medium text-base">Additional team members</p>
        <MUIDataGridWrapper>
          <DataGrid
            loading={loadingData}
            rows={rows}
            columns={[
              {
                field: "StaffName",
                headerName: "Staff Name",
                flex: 1,
                headerClassName: "bg-[#89D6DE] text-black font-medium",
              },
              {
                field: "StaffTitle",
                headerName: "Staff Title",
                flex: 1,
                headerClassName: "bg-[#89D6DE] text-black font-medium",
              },
              {
                field: "StaffEmail",
                headerName: "Staff Email",
                flex: 1,
                headerClassName: "bg-[#89D6DE] text-black font-medium",
              },
              {
                field: "StaffPhone",
                headerName: "Staff Phone",
                flex: 1,
                headerClassName: "bg-[#89D6DE] text-black font-medium",
              },
              {
                field: "LinkToContactCard",
                headerName: "Link To Contact Card",
                flex: 1,
                headerClassName: "bg-[#89D6DE] text-black font-medium",
                renderCell: (params) => {
                  return (
                    <>
                      <Link
                        to={`/staff-directory/${params.row.id}`}
                        className="text-[#5BC4BF]"
                      >
                        {params.row.LinkToContactCard}
                      </Link>
                    </>
                  );
                },
              },
            ]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[3, 5, 10, 25]}
            disableRowSelectionOnClick
          />
        </MUIDataGridWrapper>
      </div>
    </Box>
  );
};

const PriorityListTable = ({ loadingData }) => {
  const rows = [
    {
      id: 1,
      PriorityListName: "Priority List Name",
      LinkToPriorityList: "link to priority list",
    },
    {
      id: 2,
      PriorityListName: "Priority List Name",
      LinkToPriorityList: "link to priority list",
    },
    {
      id: 3,
      PriorityListName: "Priority List Name",
      LinkToPriorityList: "link to priority list",
    },
    {
      id: 4,
      PriorityListName: "Priority List Name",
      LinkToPriorityList: "link to priority list",
    },
  ];

  return (
    <Box sx={{ width: "100%", my: 1 }}>
      <div className="flex flex-column gap-2 w-100 ">
        <p className="mb-2 fw-medium text-base">Priority Lists</p>
        <MUIDataGridWrapper>
          <DataGrid
            loading={loadingData}
            rows={rows}
            columns={[
              {
                field: "PriorityListName",
                headerName: "Priority ListName",
                flex: 1,
                headerClassName: "bg-[#C7CED4] text-black font-medium",
              },

              {
                field: "LinkToPriorityList",
                headerName: "Link To Priority List",
                flex: 1,
                headerClassName: "bg-[#C7CED4] text-black font-medium",
                renderCell: (params) => {
                  return (
                    <>
                      <Link to="#" className="text-[#5BC4BF]">
                        {params.row.LinkToPriorityList}
                      </Link>
                    </>
                  );
                },
              },
            ]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[3, 5, 10, 25]}
            disableRowSelectionOnClick
          />
        </MUIDataGridWrapper>
      </div>
    </Box>
  );
};

function FormField({ required = false, label = "", error, children }) {
  return (
    <>
      <div className="flex flex-column gap-1 w-100">
        {label && (
          <p className="mb-1 ms-1 text-base flex gap-2 items-center font-medium">
            <span>{label}</span>
            {required && <span className="text-red-400">*</span>}
          </p>
        )}
        {children}
        {error && <p className="mt-1 ms-1 text-xs text-red-400">{error}</p>}
      </div>
    </>
  );
}
