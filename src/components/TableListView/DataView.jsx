import React, { useState, useMemo, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import apiURL from "../../apiConfig";

import MUIDataGridWrapper from "../HOC/MUIDataGridWrapper";

export default function DataView() {
  const { dataviewid } = useParams();
  const token = localStorage.getItem("access_token");

  const [recordData, setRecordData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchData();
  }, [dataviewid]);

  const fetchData = () => {
    axios
      .get(`${apiURL}/api/dataview/data/${dataviewid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoadingData(true);
        setRecordData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Records : ", error);
      })
      .finally(() => {
        setLoadingData(false);
      });
  };

  const tableRows = useMemo(() => {
    if (recordData.length === 0 || loadingData) {
      return [];
    }
    return recordData.map((item, idx) => {
      return {
        id: idx,
        ...item,
      };
    });
  }, [recordData, loadingData]);

  const tableColumns = useMemo(() => {
    if (recordData.length === 0 || loadingData) {
      return [];
    }

    const singleData = recordData[0] || {};
    const keysOfRecords = Object.keys(singleData);

    return keysOfRecords.map((item, idx) => {
      return {
        field: item,
        headerName: item,
        flex: 1,
        headerClassName: "bg-[#5BC4BF] text-white font-medium",
      };
    });
  }, [recordData, loadingData]);

  return (
    <div class="container mx-auto sm:grid-cols-12 md:grid-cols-7 shadow p-0">
      <div className="w-100 bg-[#5BC4BF] text-white p-2.5 px-4">Data View</div>
      <div className="flex flex-column gap-4 p-4">
        <Box sx={{ width: "100%", my: 1 }}>
          <div className="flex flex-column gap-2 w-100 ">
            <MUIDataGridWrapper>
              <DataGrid
                loading={loadingData}
                rows={tableRows}
                columns={tableColumns}
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
      </div>
    </div>
  );
}
