import React, { useState, useMemo, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import SearchIcon from "../images/search.svg";
import { useNavigate } from "react-router-dom";
import axios from "../../helper/axiosInstance";
import { styled } from "@mui/material/styles";

import MUIDataGridWrapper from "../HOC/MUIDataGridWrapper";

import EditPNG from "../images/edit.png";

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

export default function CareplanDirectoryTable() {
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
      .get(`/care-plan-directory/`)
      .then((response) => {
        setLoadingData(true);
        console.log(response.data);
        setRecordData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching careplan directory details :", error);
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

  const programs = ["ECM", "Diabetes", "STOMP"];

  const dates = [
    "2024-03-15",
    "2024-03-16",
    "2024-03-17",
    "2024-03-18",
    "2024-03-19",
    "2024-03-20",
    "2024-03-21",
    "2024-03-22",
    "2024-03-23",
    "2024-03-24",
  ];

  function getRandomDate(dates) {
    const randomIndex = Math.floor(Math.random() * dates.length);
    return dates[randomIndex];
  }

  function getRandomProgram(programs) {
    const randomIndex = Math.floor(Math.random() * programs.length);
    return programs[randomIndex];
  }

  let rowData = useMemo(
    () =>
      recordData.map((item) => {
        return {
          id: item.id,
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
          date_assigned: getRandomDate(dates),
          program: getRandomProgram(programs),
          ...item,
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
                navigate(`/careplan-directory/${e.id}`);
              }}
              rows={rows}
              columns={[
                {
                  field: "name",
                  headerName: "Name",
                  flex: 1,
                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 150,
                },
                {
                  field: "form_name",
                  headerName: "Form Name",
                  flex: 1,
                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 150,
                },
                {
                  field: "program",
                  headerName: "Program",
                  flex: 1,
                  headerClassName: "bg-[#5BC4BF] text-white font-medium",
                  minWidth: 150,
                  valueFormatter: ({name}) => {
                    return name;
                  },
                },
                {
                  field: "is_approval_needed",
                  headerName: "Approval Needed",
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
                              // navigate(
                              //   `/clientprofile/${params.row.id}?mode=edit`
                              // );
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
      <div className="col-end-5 col-span-2 flex gap-6 items-center justify-end">
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
            className="px-3 py-2 text-[13px] font-medium leading-5 bg-[#5BC4BF] border-1 border-[#5BC4BF] text-white rounded-sm hover:bg-[#429e97] focus:outline-none focus:ring-2 focus:ring-[#429e97] focus:ring-opacity-50 transition-colors duration-300"
            onClick={() => {
              navigate("/careplan-directory/add");
            }}
          >
            Add New
          </button>
        </div>
      </div>
    </div>
  );
}
