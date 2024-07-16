import React, { useState, useMemo, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import apiURL from "../../apiConfig";

import MUIDataGridWrapper from "../HOC/MUIDataGridWrapper";
import BasicTable from "../react-table/BasicTable";
import EditableTable from "../react-table/EditTable";
import { notifySuccess } from "../../helper/toastNotication";

export default function DataViewTable({ saveSuccess, setSaveSuccess }) {
  const token = localStorage.getItem("access_token");

  const [state, setState] = useState({
    columns: [],
    data: [],
  });
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  const requestBody = {
    dataview: "Admin",
  };

  useEffect(() => {
    axios
      .post(`${apiURL}/priority_list/mapping/`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        
        const modifiedColumns = response.data.columns.map((column, index) => ({
          ...column,
        }));
  
        // Add a hardcoded client_id to each row if it doesn't exist
        const modifiedData = response.data.data.map((row, index) => ({
          ...row,
          client_id: Number(row.id)
        }));
        setState({
          columns: modifiedColumns,
          data: modifiedData,
        });
      })
      .catch((error) => {
        console.error("Error fetching Client Medication Data:", error);
      });
  }, [saveSuccess]);

  const updatedDataApi = async (payload) => {
    console.log(payload)
    try {
      const response = await axios.patch(
        `${apiURL}/priority_list/mapping/`,
        payload, // Send updateData as the request payload
      );
      notifySuccess("Changes updated");
      console.log(response);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleCellEdit = (rowIndex, columnId, newValue) => {
    setState((prevState) => {
      const newData = [...prevState.data];
      const oldValue = newData[rowIndex][columnId];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [columnId]: newValue,
      };
  
      const data = {
        dataview: "Admin",
        id: newData[rowIndex].client_id, // Use the client_id from the row data
        column_id: columnId,
        old_value: oldValue,
        new_value: newValue
      }
      // Log the edit information
      console.log(data);
      updatedDataApi(data)
  
      return {
        ...prevState,
        data: newData,
      };
    });
    setEditingCell(null);
  };

  const handleEditStart = (rowIndex, columnId, value) => {
    setEditingCell({ rowIndex, columnId });
    setEditValue(value);
  };

  const handleEditCancel = () => {
    setEditingCell(null);
  };

  return (
    <div className="container mx-auto sm:grid-cols-12 md:grid-cols-7 rounded shadow p-0">
      <div className="border-b-2">
        <div className="flex justify-between items-center w-100 bg-[#ffffff] text-black p-2.5 px-4">
          <div className="font-bold">Data View Table</div>
          <div>
            <button
              onClick={() => setSaveSuccess((prev) => !prev)}
              className="m-auto px-3 py-1 border-1 sm:border-2 rounded-sm border-[#2F9384] text-[#2F9384] text-[13px] font-medium leading-5 hover:bg-[#5BC4BF] hover:text-white"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
      <div className="w-full flex-grow flex flex-col">
        <EditableTable
          type={"priorityList"}
          columns={state.columns}
          data={state.data}
          editingCell={editingCell}
          editValue={editValue}
          onEditStart={handleEditStart}
          onEditConfirm={handleCellEdit}
          onEditCancel={handleEditCancel}
          onEditChange={setEditValue}
        />
      </div>
    </div>
  );
}
