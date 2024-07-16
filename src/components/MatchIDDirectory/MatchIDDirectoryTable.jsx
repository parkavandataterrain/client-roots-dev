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

import { notifySuccess, notifyError } from "../../helper/toastNotication";

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

export default function MatchIDDirectoryTable() {
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
      .get(`/api/match_id_directory/`)
      .then((response) => {
        setLoadingData(true);
        setRecordData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching match id :", error);
      })
      .finally(() => {
        setLoadingData(false);

        // let dummyData = [
        //   {
        //     id: 1,
        //     last_name: "raj",
        //     first_name: "rajk",
        //     email_address: "raj@db.ik",
        //     date_of_birth: "1998-05-10",
        //     match_id: "1234",
        //   },
        //   {
        //     id: 12,
        //     last_name: "raj3",
        //     first_name: "raj23k",
        //     email_address: "raj@d32b.ik",
        //     date_of_birth: "1992-05-10",
        //     match_id: "1234e",
        //   },
        // ];
        // setRecordData(dummyData);
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
          LastName: item.last_name || "",
          FirstName: item.first_name || "",
          EmailID: item.email_address || "",
          DOB: item.date_of_birth || "",
          MatchID: item.match_id || "",
          Action: "",
          ...item,
        };
      }),
    [recordData]
  );
  console.log({ rowData });

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
                // navigate(`/clientprofile/${e.id}`);
              }}
              rows={rows}
              columns={[
                {
                  field: "FirstName",
                  headerName: "First Name",
                  flex: 1,
                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 150,
                  renderCell: ({ row }) => `${row.FirstName}`,
                },
                {
                  field: "LastName",
                  headerName: "Last Name",
                  flex: 1,
                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 150,
                  renderCell: ({ row }) => `${row.LastName}`,
                },
                {
                  field: "DOB",
                  headerName: "D.O.B",
                  flex: 1,
                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 150,
                  renderCell: ({ value }) => {
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
                  field: "EmailID",
                  headerName: "Email ID",
                  flex: 1,
                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 150,
                },
                {
                  field: "MatchID",
                  headerName: "Match ID",
                  flex: 1,
                  filterable: true,
                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 150,
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
                              navigate(
                                `/update-match-id-directory/${params.row.id}`
                              );
                            }}
                          >
                            <img
                              src={EditPNG}
                              className="w-4 h-4"
                              style={{ display: "block", margin: "0 auto" }}
                            />
                          </button>
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
      <div className="col-end-5 col-span-2 flex gap-6 items-center justify-end">
        <button // Hidden since it dont have add new
          className="hidden bg-[#32c5bf] text-white p-2 rounded-md hover:bg-[#195a58]"
          onClick={() => navigate("/clientprofilenew")}
        >
          Add New client
        </button>
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
        {/* <div className="ms-3">
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
        </div> */}
      </div>
    </div>
  );
}
