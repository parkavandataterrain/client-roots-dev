import React, { useState, useMemo, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Select from "react-select";
import SearchIcon from "../images/search.svg";
import axios from "../../helper/axiosInstance";

import { Link, useNavigate, useParams } from "react-router-dom";

import ViewPNG from "../images/view.png";
import EditPNG from "../images/edit.png";

import ActivateIcon from "../images/activate_icon.svg";
import DeactivateIcon from "../images/deactivate_icon.svg";

import DeactivatePNG from "../images/deactivate.png";
import MUIDataGridWrapper from "../HOC/MUIDataGridWrapper";
import PrivateComponent from "../PrivateComponent";

import Swal from "sweetalert2";

import { notifySuccess, notifyError } from "../../helper/toastNotication";
import ActivateDeactivate from "../common/ActivateDeactivate";

export default function ProgramListTable() {
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
      .get(`api/resources/program`)
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
          .delete(`/api/resources/program/${id}`)
          .then((response) => {
            fetchData();
            notifySuccess(`${actionPerformed}d Successfully`);
          })
          .catch((error) => {
            notifyError(`Could not ${actionPerformed}, please try again later`);
            console.error("Error Deactivating:", error);
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
          label: item.name,
          value: item.name,
        };
      }),
    [recordData]
  );

  let rowData = useMemo(
    () =>
      recordData.map((item) => {
        return {
          id: item.id,
          Link: `Record ${item.id}`,
          ProgramName: item.name || "",
          Department: item.department_name || "",
          Description: item.description || "",
          Eligibility: item.eligibility || "",
          SystemStatus: item.is_active || null,
          ManagementAdminContacts:
            item.primary_contact.length > 0
              ? `${item.primary_contact[0].first_name} ${item.primary_contact[0].last_name}`
              : "",
          ClientMattersContacts:
            item.client_matter_contact.length > 0
              ? `${item.client_matter_contact[0].first_name} ${item.client_matter_contact[0].last_name}`
              : "",
        };
      }),
    [recordData]
  );

  function searchFilter(arrayOfObjects, searchText) {
    if (!searchText) return arrayOfObjects; // Return the original array if searchText is empty

    if (arrayOfObjects.length === 0) {
      return [];
    }
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
            <DataGrid
              loading={loadingData}
              onRowClick={(e) => {
                navigate(`/program-directory/${e.id}`);
              }}
              rows={rows}
              columns={[
                // {
                //   field: "Link",
                //   headerName: "Link",
                //   flex: 1,
                //   headerClassName: "bg-[#5BC4BF] text-white font-medium",
                //   minWidth: 50,
                //   renderCell: (params) => {
                //     return (
                //       <>
                //         <Link
                //           to={`/program-directory/${params.row.id}`}
                //           className="text-[#5BC4BF]"
                //         >
                //           {params.row.Link}
                //         </Link>
                //       </>
                //     );
                //   },
                // },
                {
                  field: "ProgramName",
                  headerName: "Program Name",
                  flex: 1,
                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 150,
                },
                {
                  field: "Department",
                  headerName: "Department",
                  flex: 1,
                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 150,
                },
                {
                  field: "Description",
                  headerName: "Description",
                  flex: 1,
                  filterable: true,
                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 200,
                },
                {
                  field: "Eligibility",
                  headerName: "Eligibility",
                  flex: 1,
                  sortable: true,
                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 200,
                },
                {
                  field: "SystemStatus",
                  headerName: "Status",
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
                  field: "Action",
                  headerName: "Action",
                  align: "left",
                  headerAlign: "center",
                  flex: 1,
                  headerClassName:
                    "bg-[#5BC4BF] text-white font-medium text-center w-100",
                  minWidth: 150,
                  // renderCell: (params) => {
                  //   return (
                  //     <>
                  //       <div
                  //         className="text-[#5BC4BF] flex items-center justify-evenly"
                  //         style={{ height: "100%" }}
                  //       >
                  //         <img src={ViewPNG} className="w-5 h-5" />
                  //         <img src={EditPNG} className="w-5 h-5" />
                  //         <img src={DeletePNG} className="w-5 h-5" />
                  //       </div>
                  //     </>
                  //   );
                  // },

                  renderCell: (params) => {
                    const {
                      row: { SystemStatus },
                    } = params;

                    return (
                      <>
                        <div className="h-100 w-100 flex flex-row gap-2 justify-center items-center">
                          {SystemStatus && (
                            <PrivateComponent permission="change_programs">
                              <button
                                className="p-1 hover:bg-teal-400 bg-opacity-50 hover:rounded"
                                title="Edit"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(
                                    `/update-program-directory/${params.row.id}`
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
                          <PrivateComponent permission="delete_programs">
                            {/* <button
                              className={`p-1 hover:bg-${
                                params.row.SystemStatus ? "red-400" : "teal-400"
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
                                    ? DeactivateIcon
                                    : ActivateIcon
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
                // {
                //   field: "ManagementAdminContacts",
                //   headerName: "Management Admin Contacts",
                //   align: "center",
                //   headerAlign: "center",
                //   flex: 1,
                //   headerClassName:
                //     "bg-[#5BC4BF] text-white font-medium text-center w-100",
                //   minWidth: 150,
                // },
                // {
                //   field: "ClientMattersContacts",
                //   headerName: "Client Matters Contacts",
                //   align: "center",
                //   headerAlign: "center",
                //   flex: 1,
                //   headerClassName:
                //     "bg-[#5BC4BF] text-white font-medium text-center w-100",
                //   minWidth: 150,
                // },
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
          placeholder="Program Name"
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
          <PrivateComponent permission="add_programs">
            <button
              className="px-3 py-2 text-[13px] font-medium leading-5 bg-[#5BC4BF] border-1 border-[#5BC4BF] text-white rounded-sm font-medium hover:bg-[#429e97] focus:outline-none focus:ring-2 focus:ring-[#429e97] focus:ring-opacity-50 transition-colors duration-300"
              onClick={() => {
                navigate("/add-new-program-directory/");
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
