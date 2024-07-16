import React, { useMemo } from "react";

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
  carePlanStatus: {
    // client chart page
    header: {
      classes: "bg-[#41CEBA] border border-[#41CEBA]",
      styles: {
        color: "white",
      },
    },
  },
  intervention: {
    // client chart page
    header: {
      classes: "bg-[#5BC4BF] border border-[#41CEBA]",
      styles: {
        color: "white",
      },
    },
  },
  billing: {
    // Add document page
    header: {
      classes: "bg-[#76818E] border border-[#76818E]",
      styles: {
        color: "white",
      },
    },
  },
  referralsPage: {
    // referrals page
    header: {
      classes: "bg-[#5BC4BF] border border-[#41CEBA]",
      styles: {
        color: "white",
      },
    },
  },
};

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, striped, type, top, defaultPageSize, noMargin }) {
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

  const { width } = useWindowSize();

  return (
    <Stack className={`flex-grow flex flex-col ${!noMargin ? "m-3" : ""}`}>
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
                    {column.render("Header")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody
            style={{ border: "1px solid #EAECEB" }}
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
                    >
                      {cell.render("Cell")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {!top && (
        // <TableRow>
        //   <TableCell sx={{ p: 2 }} colSpan={columns.length}>
        <TablePagination
          gotoPage={gotoPage}
          rows={rows}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
        //   </TableCell>
        // </TableRow>
      )}
    </Stack>
  );
}


// ==============================|| REACT TABLE - BASIC ||============================== //

const EditableTable = React.memo(
  ({ 
    data, 
    striped, 
    title, 
    columns, 
    type, 
    defaultPageSize, 
    noMargin, 
    editingCell, 
    editValue, 
    onEditStart, 
    onEditConfirm, 
    onEditCancel, 
    onEditChange 
  }) => {
    console.log(columns)
    const editableColumns = columns.map(column => ({
      ...column,
      Cell: ({ row, value, column }) => {
        if (column.options) {
          return (
            <div className="bg-yellow-100 w-full">
              <select
                value={value}
                onChange={(e) => onEditConfirm(row.index, column.id, e.target.value)}
                className="w-full bg-transparent outline-none"
              >
                {column.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          );
        } else if (column.editable) {
          const isEditing = editingCell && editingCell.rowIndex === row.index && editingCell.columnId === column.id;
          
          const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
              onEditConfirm(editingCell.rowIndex, editingCell.columnId, editValue);
            } else if (e.key === 'Escape') {
              onEditCancel();
            }
          };

          if (isEditing) {
            return (
              <div className="bg-yellow-100">
                <input
                  value={editValue}
                  onChange={(e) => onEditChange(e.target.value)}
                  onBlur={() => onEditConfirm(editingCell.rowIndex, editingCell.columnId, editValue)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="w-full bg-transparent"
                />
              </div>
            );
          } else {
            return (  
              <div 
                className="bg-yellow-100 cursor-pointer" 
                onClick={() => onEditStart(row.index, column.id, value)}
              >
                {value}
              </div>
            );
          }
        }
        return <div>{value}</div>;
      }
    }));

    return (
      <ReactTable
        className=""
        type={type}
        columns={editableColumns}
        data={data}
        striped={striped}
        defaultPageSize={defaultPageSize}
        noMargin={noMargin}
      />
    );
  }
);

export default EditableTable;