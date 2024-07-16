import React, { useState, useEffect } from "react";
import { Modal, Dropdown } from "react-bootstrap";
import axios from "axios";
import apiURL from "../../apiConfig";
import CloseIcon from "../images/form_builder/close_x.svg";
import LinkIcon from "../images/form_builder/link_icon.svg";
import DownloadIcon from "../images/form_builder/download_icon.svg";
import { useDropzone } from "react-dropzone";
import { notifyError } from "../../helper/toastNotication";
import { Tooltip } from "react-tooltip";
import { FaFileDownload, FaFile } from "react-icons/fa";

function BulkUploadComponent() {
  const [tableNames, setTableNames] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [errorReport, setErrorReport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTableNames = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/get_upload_matching_tables/`
        );
        setTableNames(response.data.matching_tables);
      } catch (error) {
        console.error("Error fetching table names:", error);
      }
    };

    fetchTableNames();
  }, []);

  // Function to clean up table name
  const cleanedTableName = (tableName) => {
    let cleanedName = tableName;
    if (cleanedName.startsWith("roots")) {
      cleanedName = cleanedName.replace(/^roots/i, ""); // Replace "roots" at the start of the string
    }
    cleanedName = cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1);
    return cleanedName;
  };

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop: (acceptedFiles) => {
        setFile(acceptedFiles[0]);
      },
      accept: [".xlsx"],
    });

  const handleUpload = () => {
    if (!selectedTable || !file) {
      setMessage("Table name and file are required");
      setErrorReport(null);
      return;
    }
    setIsSubmitting(true);

    setMessage("Uploading file...");
    setErrorReport(null);

    const formData = new FormData();
    formData.append("table_name", selectedTable);
    formData.append("xls_file", file); // Use "xls_file" instead of "file"

    axios
      .post(`${apiURL}/upload_csv_to_table/`, formData, {
        responseType: "blob",
      })
      .then((response) => {
        if (response.status === 201) {
          setMessage(response.data.message || "Upload successful");
          setErrorReport(null);
        } else if (response.status === 400) {
          const errorMessage = response.data.message;
          setMessage(errorMessage);
          setErrorReport(null);
        } else if (
          response.headers["content-type"] === "application/vnd.ms-excel" ||
          response.headers["content-type"] ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          const blob = new Blob([response.data], {
            type: response.headers["content-type"],
          });
          const url = window.URL.createObjectURL(blob);
          setErrorReport(url);
          setMessage("Error in uploading. Please download report.");
        } else {
          setMessage("An unexpected error occurred");
          setErrorReport(null);
        }
      })
      .catch((error) => {
        if (error.response) {
          notifyError("Something Went Wrong !");
          const errorMessage = error.response.data.message;
          setMessage(errorMessage);
          setErrorReport(null);
        } else {
          setMessage("Error occurred during upload");
          setErrorReport(null);
          console.error(error);
        }
      })
      .finally(() => {
        setIsSubmitting(false);
        setFile(null);
      });
  };

  const downloadFile = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/download_table_data/${selectedTable}/`,
        {
          responseType: "blob",
        }
      );

      if (!response.data) {
        throw new Error("File download failed");
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${selectedTable}.xlsx`); // Assuming download as XLSX
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      notifyError("Failed to download file. Please try again later.");
    }
  };

  const handleFormDownload = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/download_table_column_data/${selectedTable}/`,
        {
          responseType: "blob",
        }
      );

      if (!response.data) {
        throw new Error("Form download failed");
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${selectedTable}_form.xlsx`); // Assuming download as XLSX
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading form:", error);
      notifyError("Failed to download form. Please try again later.");
    }
  };

  const handleInstructionsDownload = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/download_instructions/${selectedTable}/`,
        {
          responseType: "blob",
        }
      );

      if (!response.data) {
        throw new Error("Instructions download failed");
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${selectedTable}_instructions.xlsx`); // Assuming download as XLSX
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading instructions:", error);
      notifyError("Failed to download instructions. Please try again later.");
    }
  };

  const downloadErrorReport = () => {
    if (errorReport) {
      const link = document.createElement("a");
      link.href = errorReport;
      link.setAttribute("download", "error_report.xlsx"); // Assuming download as XLSX
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(errorReport);
      setErrorReport(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-[#5BC4BF]">
        Bulk Data Upload
      </h1>

      <div className="flex flex-col gap-6">
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="w-full p-2 bg-[#5BC4BF] text-white rounded-md hover:bg-[#4AA39F] transition-colors duration-300 shadow-md appearance-none"
        >
          <option value="">Select a Table</option>
          {tableNames.map((table) => (
            <option key={table} value={table} className="bg-white text-black">
              {cleanedTableName(table)} {/* Clean up table name here */}
            </option>
          ))}
        </select>

        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center border-2 border-dashed border-[#5BC4BF] ${
            isDragActive ? "bg-[#E6F7F6]" : "bg-white"
          } h-[170px] w-full p-4 rounded-md transition-colors duration-300`}
        >
          <input {...getInputProps()} accept=".xlsx" />
          {file ? (
            <div className="flex items-center">
              <FaFile className="text-[#5BC4BF] mr-2" />
              <span className="text-[#333333]">
                {file.name} - {formatFileSize(file.size)}
              </span>
            </div>
          ) : (
            <p className="text-[#333333]">
              {isDragActive ? "Drop here..." : "Drop your file"}
            </p>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            className="px-4 py-2 bg-gray-200 text-[#5BC4BF] rounded-md hover:bg-gray-300 transition-colors duration-300 shadow-md"
            onClick={() => {
              /* Handle cancel */
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-[#5BC4BF] text-white rounded-md hover:bg-[#4AA39F] transition-colors duration-300 shadow-md"
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleFormDownload}
            className="flex items-center gap-2 px-4 py-2 bg-[#E6F7F6] text-[#5BC4BF] rounded-md hover:bg-[#5BC4BF] hover:text-white transition-colors duration-300 shadow-md"
            data-tooltip-id="form-tooltip"
            data-tooltip-content="Download the form structure to see required fields"
          >
            <FaFileDownload />
            <span>Download Form Structure</span>
          </button>
          <Tooltip id="form-tooltip" />

          <button
            onClick={handleInstructionsDownload}
            className="flex items-center gap-2 px-4 py-2 bg-[#E6F7F6] text-[#5BC4BF] rounded-md hover:bg-[#5BC4BF] hover:text-white transition-colors duration-300 shadow-md"
            data-tooltip-id="instructions-tooltip"
            data-tooltip-content="Download instructions for filling out the form"
          >
            <FaFileDownload />
            <span>Download Instructions</span>
          </button>
          <Tooltip id="instructions-tooltip" />
        </div>

        {message && (
          <div className="mt-4 text-center">
            <p className="text-[#333333] mb-2">{message}</p>
            {errorReport && (
              <button
                onClick={downloadErrorReport}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FFEBEE] text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-300 shadow-md text-base font-medium w-64 h-12 mx-auto"
              >
                <FaFileDownload />
                <span>Download Error Report</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BulkUploadComponent;
