import React, { useMemo } from "react";
import axios from "axios";
import apiURL from "../.././apiConfig";
// import {state,setState} from "../PriorityListNew/PriorityListNew";
// material-ui
import {
  Box,
  Chip,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

// third-party
import {
  useTable,
  useFilters,
  usePagination,
  Column,
  HeaderGroup,
  Row,
  Cell,
} from "react-table";

// project import
import { CSVExport, TablePagination } from "./ReactTable";
import { useWindowSize } from "../Utils/windowResize";
import { useState } from 'react';
import { components } from "react-select";

const styles = {
  myPanel: {
    header: {
      classes: "bg-[#D9F0EF] border border-[#D9F0EF]",
      styles: {
        color: "#2F9384",
      },
    },
  },
  clientGoal: {
    header: {
      classes: "bg-[#7397B5] border border-[#7397B5]",
      styles: {
        color: "white",
      },
    },
  },
  priorityList: {
    header: {
      classes: "bg-[#D9F0EF] border border-[#D9F0EF]",
      styles: {
        color: "#2F9384",
      },
    },
  },
  priorityListPrograms: {
    header: {
      classes: "bg-[#7397B5] border border-[#7397B5]",
      styles: {
        color: "white",
      },
    },
  },
  referralPrograms: {
    header: {
      classes: "bg-[#5BC4BF] border border-[#5BC4BF]",
      styles: {
        color: "white",
      },
    },
  },
  appointmentCalendar: {
    header: {
      classes: "bg-[#FFEDE2] border border-[#FFEDE2]",
      styles: {
        color: "#CB6A69",
      },
    },
  },
  encounters: {
    header: {
      classes: "bg-[#C7CED4] border border-[#C7CED4]",
      styles: {
        color: "#313B44",
      },
    },
  },
  socialVitalSigns: {
    // client chart page
    header: {
      classes: "bg-[#89D6DE] border border-[#89D6DE]",
      styles: {
        color: "white",
      },
    },
  },
  encounterNotes: {
    // client chart page
    header: {
      classes: "bg-[#5BC4BF] border border-[#5BC4BF]",
      styles: {
        color: "white",
      },
    },
  },
  priorityLists: {
    // client chart page
    header: {
      classes: "bg-[#76818E] border border-[#76818E]",
      styles: {
        color: "white",
      },
    },
  },
  medicalVitalSigns: {
    // client chart page
    header: {
      classes: "bg-[#89D6DE80] border border-[#89D6DE80]",
      styles: {
        color: "#1A1F25",
      },
    },
  },
  carePlan: {
    // client chart page
    header: {
      classes: "bg-[#FFF2E9] border border-[#FFF2E9]",
      styles: {
        color: "#1A1F25",
      },
    },
  },
  documents: {
    // client chart page
    header: {
      classes: "bg-[#8AD0F5] border border-[#8AD0F5]",
      styles: {
        color: "#1A1F25",
      },
    },
  },
  forms: {
    // client chart page
    header: {
      classes: "bg-[#FFF6C4] border border-[#FFF6C4]",
      styles: {
        color: "#1A1F25",
      },
    },
  },
  appointments: {
    // client chart page
    header: {
      classes: "bg-[#78C3B8] border border-[#78C3B8]",
      styles: {
        color: "#1A1F25",
      },
    },
  },
  referrals: {
    // client chart page
    header: {
      classes: "bg-[#FFD9EB] border border-[#FFD9EB]",
      styles: {
        color: "#1A1F25",
      },
    },
  },
  diagnoses: {
    // client chart page
    header: {
      classes: "bg-[#D9F1FF] border border-[#D9F1FF]",
      styles: {
        color: "#1A1F25",
      },
    },
  },
  medications: {
    // client chart page
    header: {
      classes: "bg-[#E4C3B1] border border-[#E4C3B1]",
      styles: {
        color: "white",
      },
    },
  },
  labResults: {
    // client chart page
    header: {
      classes: "",
      styles: {
        color: "white",
        background:
          "linear-gradient(90deg, #2F9384 0%, #5BC4BF 52.4%, #43B09C 100%)",
      },
    },
  },
};

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, striped, type, top, defaultPageSize }) {
  const token = localStorage.getItem("access_token");

  const [sortConfigs, setSortConfigs] = useState([]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: defaultPageSize || 5 },
    },
    useFilters,
    usePagination
  );
  const handleEdit = (row, header) => {
    console.log("HANDLE EDIT");
   console.log("Row", row);
    console.log("Header", header);
      
}
const handleDoubleClick = (rowId, columnId, value) => {
  console.log("RowId", rowId);
  console.log("ColumnId", columnId);
  console.log("Value", value);
  // setEditingCell({ rowId, columnId });
  // setCellValue(value);
};
  const { width } = useWindowSize();
  const requestSort = (key) => {
    const foundConfigIndex = sortConfigs.findIndex(config => config.key === key);
    let newConfigs = [...sortConfigs];

    if (foundConfigIndex !== -1) {
      // If the key is already in sortConfigs, toggle its direction
      const direction = newConfigs[foundConfigIndex].direction === 'ascending' ? 'descending' : 'ascending';
      newConfigs[foundConfigIndex] = { key, direction };
    } else {
      // If the key is not in sortConfigs, add it with default direction
      newConfigs = [...sortConfigs, { key, direction: 'ascending' }];
    }
    
    setSortConfigs(newConfigs);
    console.log("newConfigs", newConfigs);
    const requestBody = {
      "dataview": "Admin",
      "sortby": newConfigs,
    }
      axios
        .post(`${apiURL}/priority_list/mapping/`,requestBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // console.log("/priority_list/mapping/");
          // console.log(",response.data['columns']",response.data['columns'])
          // console.log("Data",response.data['data'])
          columns = response.data['columns'];
          data = response.data['data'];
            
          
        })
        .catch((error) => {
          console.error("Error fetching Client Medication Data:", error);
        });

  };

  return (
    <Stack className="flex-grow flex flex-col m-3">
      {top && (
        <Box sx={{ p: 2 }}>
          <TablePagination
            gotoPage={gotoPage}
            rows={page}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            pageSize={pageSize}
          />
        </Box>
      )}
      <div
        className="overflow-x-auto flex-grow-0"
        style={{
          maxWidth: "100%",
          border: "1px solid #EAECEB",
          borderRadius: "5px",
        }}
      >
        <Table style={{ fontSize: "10px !important" }} {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow
                className={`${styles[type].header.classes}`}
                style={{ ...styles[type].header.styles }}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column) => (
                  <TableCell
                    style={{
                      paddingTop: "8px",
                      paddingBottom: "8px",
                      fontWeight: "600",
                      textAlign: column.align || "center",
                      fontSize: column.fontSize || 15,
                      whiteSpace: "nowrap",
                      color: "inherit",
                      fontFamily: "Roboto Mono",
                    }}
                    {...column.getHeaderProps([
                      { className: column.className },
                    ])}
                  >
                    <span onClick={() => requestSort(column.id)}>
                      {column.render("Header")}
                      {sortConfigs.map(config => {
                        if (config.key === column.id) {
                          return (
                            <span key={config.key}>
                              {config.direction === 'ascending' ? ' 🔼' : ' 🔽'}
                            </span>
                          );
                        }
                        return null;
                      })}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody
            style={{ border: "1px solid #EAECEB", borderRadius: "16px" }}
            {...getTableBodyProps()}
            {...(striped && { className: "striped" })}
          >
            {page.map((row, i) => {
              prepareRow(row);

              return (
                <TableRow
                  key={row.id}
                  style={{ borderColor: "#EAECEB" }}
                  {...row.getRowProps()}
                >
                  
                  {row.cells.map((cell) => (
                     
                    //  console.log("Column", cell.column),
                    //  console.log("Row", cell.row),
                    <TableCell
                      style={{
                        paddingTop: "8px",
                        paddingBottom: "8px",
                        textAlign: cell.column.align || "center",
                        fontSize: cell.column.fontSize || 14,
                        whiteSpace: "nowrap",
                        fontFamily: "Roboto Mono",
                      }}
                      {...cell.getCellProps([
                        { className: cell.column.className },
                      ])}

                      
                      onDoubleClick={() => handleDoubleClick(cell.row.id, cell.column.id, cell.value)}
                      >
                    
                      {cell.render("Cell")}
                      
                    </TableCell>
                    
                  )
                  
                  )
                 
                  }
                   
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {!top && (
        <TablePagination
          gotoPage={gotoPage}
          rows={rows}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      )}
    </Stack>
  );
}

// ==============================|| REACT TABLE - BASIC ||============================== //

const BasicTable = React.memo(
  ({ data, striped, title, columns, type, defaultPageSize }) => {
    console.log(columns)
    return (
      <ReactTable
        className=""
        type={type}
        columns={columns}
        data={data}
        striped={striped}
        defaultPageSize={defaultPageSize}
      />
    );
  }
);

export default BasicTable;
