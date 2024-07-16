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
import DeleteIcon from "../images/form_builder/trash.svg";
import PrivateComponent from "../PrivateComponent";

import {
  notify,
  notifySuccess,
  notifyError,
} from "../../helper/toastNotication";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import CloseIcon from "../images/form_builder/close_x.svg";
import { Modal } from "react-bootstrap";

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

export default function FacilityTable() {
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);
  const [recordData, setRecordData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  const [showModal, setShowModal] = useState({
    show: false,
    id: null,
    isUpdate: false,
    data: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(`/api/resources/facilities`)
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
      .finally(() => {});
  };

  const deleteRecord = (id) => {
    let actionPerformed = "Delete";
    let isActive = true;

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
          .delete(`/api/resources/facilities/${id}`)
          .then((response) => {
            fetchData();
            notifySuccess(`${actionPerformed}d Successfully`);
          })
          .catch((error) => {
            notifyError(`Could not ${actionPerformed}, please try again later`);
            console.error("Error Deleting:", error);
          })
          .finally(() => {});
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
        return {
          id: item.id,
          name: item.name,
          description: item.description,
          // Link: `Record ${item.id}`,
          // LastName: item.last_name || "",
          // FirstName: item.first_name || "",
          // PhoneNumber: item.profile?.phone_no || "",
          // RootsEmailAddress: item.email || "",
          // LastActivityDate: item.last_login || "",
          // SystemStatus: item.is_active || null,
          // PositionTitle: item.profile?.position || "",
          // PrimaryFacility: item.profile?.facility || "",
          // Program: programValue,
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

  const toggleModal = () => {
    setShowModal({
      show: false,
      isUpdate: false,
      id: null,
    });
  };

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
            showAddNew={() => {
              setShowModal({
                show: true,
                id: null,
                isUpdate: false,
              });
            }}
          />
          <MUIDataGridWrapper>
            <StyledDataGrid
              loading={loadingData}
              // onRowClick={(e) => {
              //   navigate(`/staff-directory/${e.id}`);
              // }}
              rows={rows}
              columns={[
                {
                  field: "id",
                  headerName: "ID",
                  flex: 1,
                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 150,
                },
                {
                  field: "name",
                  headerName: "Name",
                  flex: 1,
                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 250,
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
                  renderCell: (params) => {
                    return (
                      <>
                        <div className="h-100 w-100 flex flex-row gap-2 justify-center items-center">
                          <button
                            className="p-1 hover:bg-teal-400 bg-opacity-50 hover:rounded"
                            title="Edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              // navigate(
                              //   `/update-staff-directory/${params.row.id}`
                              // );
                              setShowModal({
                                show: true,
                                isUpdate: true,
                                id: params.row.id,
                                data: params.row,
                              });
                            }}
                          >
                            <img
                              src={EditPNG}
                              className="w-4 h-4"
                              style={{ display: "block", margin: "0 auto" }}
                            />
                          </button>

                          <button
                            className="p-1 hover:bg-teal-400 bg-opacity-50 hover:rounded"
                            title="Delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRecord(params.row.id);
                            }}
                          >
                            <img
                              src={DeleteIcon}
                              className="w-4 h-4"
                              style={{ display: "block", margin: "0 auto" }}
                            />
                          </button>

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
                          </button>   */}
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
          <AddNewFacility
            refresh={fetchData}
            toggleModal={toggleModal}
            {...showModal}
          />
        </div>
      </Paper>
    </Box>
  );
}

function AddNewFacility({
  isUpdate = false,
  id = null,
  show = false,
  data = {},
  refresh = () => {},
  toggleModal = () => {},
}) {
  const [isSubmitting, setIsSubmitting] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    getValues,
    watch,
    resetField,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (show) {
      if (isUpdate) {
        setValue("facility_name", data?.name || "");
        setValue("description", data?.description || "");
      }
    }
  }, [show]);

  const onSubmit = (data) => {
    setIsSubmitting(true);

    let postData = {
      description: data.description,
      name: data.facility_name,
    };

    let endpoint = "/api/resources/facilities";
    let axiosCall = axios.post;

    const access_token = localStorage.getItem("access_token");
    console.log({ access_token });

    if (isUpdate) {
      endpoint = `/api/resources/facilities/${id}`;
      axiosCall = isUpdate ? axios.put : axios.post;
    }

    axiosCall(`${endpoint}`, postData, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((response) => {
        Swal.fire({
          title: "Success!",
          text: `Facility ${isUpdate ? "Updated" : "Created"}`,
          icon: "success",
          timer: 2000,
        });
        refresh && refresh();
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((error) => {
        console.error("Error", error);
        Swal.fire({
          title: "Error!",
          text: `Unable to ${isUpdate ? "Update" : "Create"} Facility`,
          icon: "error",
          timer: 2000,
        });
      })
      .finally(() => {
        reset();
        setIsSubmitting(false);
        toggleModal();
      });
  };

  return (
    <Modal
      show={show}
      onHide={() => toggleModal()}
      backdrop="static"
      keyboard={false}
      centered
      size="lg"
    >
      <Modal.Header className="m-0 p-2 w-100 text-white text-base bg-[#5BC4BF] font-medium">
        <Modal.Title className="m-0 p-0 w-100">
          <div className="flex justify-between items-center w-100">
            <span className="text-white text-base">
              {`${isUpdate ? "Update" : "Add New"} Facility`}
            </span>
            <button onClick={() => toggleModal()}>
              <img
                src={CloseIcon}
                style={{
                  height: "20px",
                  width: "100%",
                }}
              />
            </button>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="flex relative items-center justify-centerx">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 w-100">
            <div className="mb-4">
              <label className="block mb-2">Facility Name *</label>
              <input
                className="w-100 p-[0.725rem] rounded-[2px]"
                name={"facility_name"}
                placeholder="Enter Facility Name"
                style={{
                  border: `1px solid ${
                    !errors.facility_name ? "#5BC4BF" : "red"
                  }`,
                  fontSize: "14px",
                }}
                {...register("facility_name", {
                  required: "Facility Name is required",
                })}
              />
              {errors.facility_name && (
                <p className="text-red-500">{errors.facility_name.message}</p>
              )}
            </div>
            <div className="mb-2">
              <label className="block mb-2">Description</label>
              <textarea
                rows={5}
                className="w-100 p-[0.725rem] rounded-[2px]"
                name={"description"}
                placeholder="Description"
                style={{
                  border: "1px solid #5BC4BF",
                  fontSize: "14px",
                }}
                {...register("description")}
              />
            </div>

            <div className="flex flex-row justify-between items-center mb-2">
              <div className="p-3 ps-0">
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleModal();
                  }}
                  className="px-3 py-1 border-1 sm:border-2 rounded-sm border-[#2F9384] text-[13px] font-medium leading-5 text-[#2F9384] hover:bg-[#2F9384] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#2F9384] focus:ring-opacity-50 transition-colors duration-300"
                >
                  Cancel
                </a>
              </div>
              <div className="p-3 pe-0">
                <button
                  type="submit"
                  className="px-3 py-1 text-[13px] font-medium leading-5 bg-[#5BC4BF] border-1 border-[#5BC4BF] text-white rounded-sm font-medium hover:bg-[#429e97] focus:outline-none focus:ring-2 focus:ring-[#429e97] focus:ring-opacity-50 transition-colors duration-300"
                >
                  {isUpdate ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </form>
          {isSubmitting && (
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
              <p className="text-base">
                {isUpdate ? "Updating..." : "Creating.."}
              </p>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

function TableActions({
  selectorList,
  selectedValue,
  handleSelectorValue,
  searchText,
  handleSearchText,
  showAddNew,
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
          <button
            className="px-3 py-2 text-[13px] font-medium leading-5 bg-[#5BC4BF] border-1 border-[#5BC4BF] text-white rounded-sm font-medium hover:bg-[#429e97] focus:outline-none focus:ring-2 focus:ring-[#429e97] focus:ring-opacity-50 transition-colors duration-300"
            onClick={() => {
              // navigate("/add-new-staff-directory/");

              showAddNew && showAddNew();
            }}
          >
            Add New
          </button>
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
