import React, { useState, useMemo, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Select from "react-select";
import SearchIcon from "../images/search.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../helper/axiosInstance";
import { styled } from "@mui/material/styles";

import MUIDataGridWrapper from "../HOC/MUIDataGridWrapper";

import EditPNG from "../images/edit.png";
import DeactivatePNG from "../images/deactivate.png";
import ActivateIcon from "../images/activate_icon.svg";
import DeactivateIcon from "../images/deactivate_icon.svg";
import PrivateComponent from "../PrivateComponent";
import ActivateDeactivate from "../common/ActivateDeactivate";

import { notifySuccess, notifyError } from "../../helper/toastNotication";
import Swal from "sweetalert2";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-sortIcon": {
    opacity: 1,
    color: "white",
  },
  "& .MuiDataGrid-menuIconButton": {
    opacity: 1,
    color: "white",
  },
}));

export default function StaffDirectoryTable() {
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);
  const [recordData, setRecordData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(`/api/users`)
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

  const deactivateRecord = (id, isActive) => {
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
        axios
          .delete(`/api/users/${id}`)
          .then((response) => {
            fetchData();
            notifySuccess(`${actionPerformed}d Successfully`);
          })
          .catch((error) => {
            notifyError(`Could not ${actionPerformed}, please try again later`);
            console.error("Error deactivating:", error);
          })
          .finally(() => { });
      }
    });
  };

  const handleSearchText = (e) => {
    setSearchText(e.target.value);
  };

  const handleSelectorValue = (item) => {
    setSelectedValue(item);
  };

  const selectorList = useMemo(
    () =>
      recordData.map((item) => {
        return {
          label: item.last_name,
          value: item.last_name,
        };
      }),
    [recordData]
  );

  let rowData = useMemo(
    () =>
      recordData.map((item) => {
        const programValue =
          item.profile?.program.length > 0 ? item.profile?.program[0] : "";

        return {
          id: item.id,
          Link: `Record ${item.id}`,
          LastName: item.last_name || "",
          FirstName: item.first_name || "",
          PhoneNumber: item.profile?.phone_no || "",
          RootsEmailAddress: item.email || "",
          LastActivityDate: item.last_login || "",
          SystemStatus: item.is_active || null,
          PositionTitle: item.profile?.position || "",
          PrimaryFacility: item.profile?.facility || "",
          Program: programValue,
          // Supervisor: `${item.profile?.supervisor_first_name || " "} ${
          //   item.profile?.supervisor_last_name || " "
          // }`,

          // SupervisorTitle: item.profile?.supervisor_title || "",
          // SupervisorEmail: item.profile?.supervisor_email || "",
          Action: "",
        };
      }),
    [recordData]
  );

  function searchFilter(arrayOfObjects, searchText) {
    if (!searchText) return arrayOfObjects; // Return the original array if searchText is empty

    const filteredArray = arrayOfObjects.filter((obj) => {
      // Convert object keys to an array and check if any of them contains the searchText
      return Object.keys(obj).some((key) => {
        const value = obj[key];
        if (typeof value === "string") {
          // If the value is a string, perform case-insensitive search
          return value.toLowerCase().includes(searchText.toLowerCase());
        } else {
          // If the value is not a string, convert it to string and perform search
          return String(value).toLowerCase().includes(searchText.toLowerCase());
        }
      });
    });

    return filteredArray;
  }

  const rows = useMemo(() => {
    return searchFilter(rowData, searchText);
  }, [searchText, rowData]);

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Paper sx={{ width: "100%" }}>
        <div className="flex flex-column gap-2 w-100 p-4">
          <TableActions
            selectorList={selectorList}
            selectedValue={selectedValue}
            handleSelectorValue={handleSelectorValue}
            searchText={searchText}
            handleSearchText={handleSearchText}
          />
          <MUIDataGridWrapper>
            <StyledDataGrid
              loading={loadingData}
              onRowClick={(e) => {
                navigate(`/staff-directory/${e.id}`);
              }}
              rows={rows}
              columns={[
                // {
                //   field: "Link",
                //   headerName: "Link",
                //   flex: 1,
                //   headerClassName: "bg-[#5BC4BF] text-white font-medium",
                //   minWidth: 100,
                //   renderCell: (params) => {
                //     return (
                //       <>
                //         <Link
                //           to={`/staff-directory/${params.row.id}`}
                //           className="text-[#5BC4BF]"
                //         >
                //           {params.row.Link}
                //         </Link>
                //       </>
                //     );
                //   },
                // },
                {
                  field: "LastName",
                  headerName: "Last Name",
                  flex: 1,
                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 150,
                },
                {
                  field: "FirstName",
                  headerName: "First Name",
                  flex: 1,
                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 150,
                },
                {
                  field: "PhoneNumber",
                  headerName: "Phone Number",
                  flex: 1,
                  filterable: true,
                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 150,
                },
                {
                  field: "RootsEmailAddress",
                  headerName: "Roots Email Address",
                  flex: 1,
                  sortable: true,
                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 250,
                },
                {
                  field: "LastActivityDate",
                  headerName: "Last Activity Date",
                  align: "center",
                  headerAlign: "center",
                  flex: 1,
                  headerClassName:
                    "bg-[#5BC4BF] text-white font-medium text-center w-100",
                  minWidth: 150,
                  renderCell: (params) => {
                    let date = params.row.LastActivityDate
                      ? new Date(
                        params.row.LastActivityDate
                      ).toLocaleDateString()
                      : "";

                    return date;
                  },
                },

                {
                  field: "SystemStatus",
                  headerName: "System Status",
                  flex: 1,
                  align: "center",
                  headerAlign: "center",

                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 150,
                  renderCell: (params) => {
                    const {
                      row: { SystemStatus },
                    } = params;

                    let classToApply = SystemStatus
                      ? "text-[#2F9384] bg-[#DAFCE7]"
                      : "text-[#E0382D] bg-[#FFC7C7]";

                    // if (SystemStatus === "Active") {
                    //   classToApply = "text-[#2F9384] bg-[#DAFCE7]";
                    // }
                    // if (SystemStatus === "Deactivated") {
                    //   classToApply = "text-[#E0382D] bg-[#FFC7C7]";
                    // }

                    return (
                      <>
                        <div className="h-100 w-100">
                          <span className={`m-2 p-1 px-2 ${classToApply}`}>
                            {SystemStatus ? "Active" : "Deactivated"}
                          </span>
                        </div>
                      </>
                    );
                  },
                },

                {
                  field: "PositionTitle",
                  headerName: "Position Title",
                  align: "left",
                  headerAlign: "left",
                  flex: 1,
                  headerClassName:
                    "bg-[#5BC4BF] text-white font-medium text-center w-100",
                  minWidth: 200,
                },

                {
                  field: "PrimaryFacility",
                  headerName: "Primary Facility",
                  align: "left",
                  headerAlign: "left",
                  flex: 1,
                  headerClassName:
                    "bg-[#5BC4BF] text-white font-medium text-center w-100",
                  minWidth: 150,
                },

                {
                  field: "Program",
                  headerName: "Program",
                  align: "left",
                  headerAlign: "left",
                  flex: 1,
                  headerClassName:
                    "bg-[#5BC4BF] text-white font-medium text-center w-100",
                  minWidth: 150,
                },

                // {
                //   field: "Supervisor",
                //   headerName: "Supervisor",
                //   align: "left",
                //   headerAlign: "left",
                //   flex: 1,
                //   headerClassName:
                //     "bg-[#5BC4BF] text-white font-medium text-center w-100",
                //   minWidth: 150,
                // },

                // {
                //   field: "SupervisorTitle",
                //   headerName: "Supervisor Title",
                //   align: "left",
                //   headerAlign: "left",
                //   flex: 1,
                //   headerClassName:
                //     "bg-[#5BC4BF] text-white font-medium text-center w-100",
                //   minWidth: 200,
                // },

                // {
                //   field: "SupervisorEmail",
                //   headerName: "Supervisor Email",
                //   align: "left",
                //   headerAlign: "left",
                //   flex: 1,
                //   headerClassName:
                //     "bg-[#5BC4BF] text-white font-medium text-center w-100",
                //   minWidth: 250,
                // },

                {
                  field: "Action",
                  headerName: "Action",
                  align: "left",
                  headerAlign: "center",
                  flex: 1,
                  headerClassName:
                    "bg-[#5BC4BF] text-white font-medium text-center w-100",
                  minWidth: 150,
                  renderCell: (params) => {
                    const {
                      row: { SystemStatus },
                    } = params;

                    return (
                      <>
                        <div className="h-100 w-100 flex flex-row gap-2 justify-center items-center">
                          {SystemStatus && (
                            <PrivateComponent permission="change_customuser">
                              <button
                                className="p-1 hover:bg-teal-400 bg-opacity-50 hover:rounded"
                                title="Edit"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(
                                    `/update-staff-directory/${params.row.id}`
                                  );
                                }}
                              >
                                <img
                                  src={EditPNG}
                                  className="w-4 h-4"
                                  style={{ display: "block", margin: "0 auto" }}
                                />
                              </button>
                            </PrivateComponent>
                          )}
                          <PrivateComponent permission="delete_customuser">
                            {/* <button
                              className={`p-1 hover:bg-${params.row.SystemStatus ? "red-400" : "teal-400"
                                } bg-opacity-50 hover:rounded`}
                              title={
                                params.row.SystemStatus
                                  ? "Deactivate"
                                  : "Activate"
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                deactivateRecord(
                                  params.row.id,
                                  params.row.SystemStatus
                                );
                              }}
                            >
                              <img
                                src={
                                  params.row.SystemStatus
                                    ? ActivateIcon
                                    : DeactivateIcon
                                }
                                className="w-4 h-4"
                                style={{ display: "block", margin: "0 auto" }}
                              />
                            </button> */}
                            <ActivateDeactivate
                              status={params.row.SystemStatus}
                              onclickAction={() => {
                                deactivateRecord(
                                  params.row.id,
                                  params.row.SystemStatus
                                );
                              }}
                            />
                          </PrivateComponent>
                        </div>
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
      </Paper>
    </Box>
  );
}

function TableActions({
  selectorList,
  selectedValue,
  handleSelectorValue,
  searchText,
  handleSearchText,
}) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-4 justify-between gap-2 w-100 mt-1 mb-4">
      {/* <div className="col-start-1 col-span-1">
        <Select
          name={"selector"}
          options={selectorList}
          placeholder="Last Name"
          value={selectedValue}
          styles={{
            control: (styles) => ({
              ...styles,
              padding: "5px",
              // height: `${height}`,
              border: `1px solid #5BC4BF`,
              // background: `${bgDisabled}`,
              fontSize: "14px",
              // borderRadius: "0.375rem",
            }),
            menu: (styles) => ({
              ...styles,
              background: "white",
              zIndex: 9999,
            }),
          }}
          components={{
            IndicatorSeparator: () => null,
          }}
          isClearable
          onChange={(item) => { 
            handleSelectorValue(item);
          }}
          menuPortalTarget={document.body}
        />
      </div> */}
      <div className="col-end-5 col-span-2 flex gap-2 items-center justify-end">
        <div className="flex gap-1 items-center border-b-2 border-[#5BC4BF]">
          <img src={SearchIcon} className="w-[20px] h-100" />
          <input
            type={"text"}
            value={searchText}
            onChange={handleSearchText}
            placeholder="Search here"
            className={`appearance-none w-full p-2.5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          />
        </div>
        <div className="ms-3">
          <PrivateComponent permission="add_customuser">
            <button
              className="px-3 py-2 text-[13px] font-medium leading-5 bg-[#5BC4BF] border-1 border-[#5BC4BF] text-white rounded-sm font-medium hover:bg-[#429e97] focus:outline-none focus:ring-2 focus:ring-[#429e97] focus:ring-opacity-50 transition-colors duration-300"
              onClick={() => {
                navigate("/add-new-staff-directory/");
              }}
            >
              Add New
            </button>
          </PrivateComponent>
        </div>
      </div>
    </div>
  );
}

// DUMMY DATA

// [
//   {
//     id: 3,
//     first_name: "Alice",
//     last_name: "Johnson",
//     email: "alice.johnson@rootsclinic.org",
//     last_login: null,
//     is_active: true,
//     profile: {
//       phone_no: "+1-555-345-6789",
//       position: null,
//       facility: "",
//       program: ["STI", "Asthma"],
//       supervisor_first_name: "arrun",
//       supervisor_last_name: "prasaath",
//       supervisor_title: null,
//       supervisor_email: "arrun@dataterrain.com",
//     },
//   },
//   {
//     id: 1,
//     first_name: "arrun",
//     last_name: "prasaath",
//     email: "arrun@dataterrain.com",
//     last_login: "2024-04-17T17:51:01.236789Z",
//     is_active: true,
//     profile: {
//       phone_no: "+1-555-123-4567",
//       position: null,
//       facility: "",
//       program: [],
//       supervisor_first_name: "",
//       supervisor_last_name: "",
//       supervisor_title: "",
//       supervisor_email: "",
//     },
//   },
//   {
//     id: 4,
//     first_name: "David",
//     last_name: "Brown",
//     email: "david.brown@rootsclinic.org",
//     last_login: null,
//     is_active: true,
//     profile: {
//       phone_no: "2345124",
//       position: null,
//       facility: "",
//       program: [],
//       supervisor_first_name: "Alice",
//       supervisor_last_name: "Johnson",
//       supervisor_title: null,
//       supervisor_email: "alice.johnson@rootsclinic.org",
//     },
//   },
//   {
//     id: 2,
//     first_name: "John",
//     last_name: "Smith",
//     email: "john.smith@rootsclinic.org",
//     last_login: null,
//     is_active: true,
//     profile: {
//       phone_no: "+1-555-234-5678",
//       position: null,
//       facility: "",
//       program: ["XXX", "YYYY"],
//       supervisor_first_name: "arrun",
//       supervisor_last_name: "prasaath",
//       supervisor_title: null,
//       supervisor_email: "arrun@dataterrain.com",
//     },
//   },
// ]
