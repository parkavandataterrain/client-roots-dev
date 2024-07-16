import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import apiURL from "../../apiConfig";

import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import axiosInstance from "../../helper/axiosInstance";
import { notify, notifyError } from "../../helper/toastNotication";
import CloseIcon from "../images/form_builder/close_x.svg";
import LinkIcon from "../images/form_builder/link_icon.svg";
import DownloadIcon from "../images/form_builder/download_icon.svg";

import { useDropzone } from "react-dropzone";

function BulkUploadComponent() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [errorReport, setErrorReport] = useState(null);
  const { tableName } = useParams();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!tableName || !file) {
      setMessage("Table name and XLSX file are required");
      setErrorReport(null);
      return;
    }

    setMessage("Uploading XLSX file...");
    setErrorReport(null);

    const formData = new FormData();
    formData.append("table_name", tableName);

    // Determine correct key based on file type
    const fileType = file.name.split(".").pop().toLowerCase();
    if (fileType === "csv") {
      formData.append("csv_file", file);
    } else if (fileType === "xlsx" || fileType === "xls") {
      formData.append("xls_file", file);
    } else {
      setMessage("Unsupported file type. Please upload an xlsx or Excel file.");
      setErrorReport(null);
      return;
    }

    axios
      .post(`${apiURL}/upload_csv_to_table/`, formData, {
        responseType: "blob",
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          const contentType = response.headers["content-type"];

          if (
            contentType === "text/plain" ||
            contentType === "application/json"
          ) {
            const responseData = response.data;
            setMessage(responseData.message); // Display success message to user
            setErrorReport(null); // Clear any previous error report
          } else if (
            contentType ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ) {
            const blob = new Blob([response.data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            setErrorReport(url); // Set error report for download
            setMessage(
              "Errors occurred during upload. Click the button below to download the error report."
            );
          } else {
            setMessage("An unexpected error occurred");
            setErrorReport(null);
          }
        } else if (response.status === 400) {
          const errorMessage = response.data.message;
          setMessage(errorMessage);
          setErrorReport(null);
        } else {
          setMessage("An unexpected error occurred");
          setErrorReport(null);
        }
      })
      .catch((error) => {
        if (error.response) {
          const errorMessage = error.response.data.message;
          setMessage(errorMessage);
          setErrorReport(null);
        } else {
          setMessage("Error occurred during upload");
          setErrorReport(null);
          console.error(error);
        }
      });
  };
  const downloadErrorReport = () => {
    if (errorReport) {
      const link = document.createElement("a");
      link.href = errorReport;
      link.setAttribute("download", "error_report.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(errorReport);
      setErrorReport(null);
    }
  };

  const handleformdownload = async () => {
    try {
      const response = await fetch(
        `${apiURL}/download_table_column_data/${tableName}/`
      );

      if (!response.ok) {
        throw new Error("Failed to download table data");
      }
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${tableName}.xlsx`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading table data:", error);
      alert("Failed to download table data. Please try again later.");
    }
  };

  const cleanedTableName = tableName.replace("roots", "");
  const cleanedTableName1 =
    cleanedTableName.charAt(0).toUpperCase() + cleanedTableName.slice(1);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      {/* Header */}
      <header className="bg-94cfcf text-white py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-semibold">XLSX Bulk Upload</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-f6f6f6">
        <div className="container mx-auto py-8">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
            {/* cleanedTableName = matchedTableName.replace("roots", ""); */}
            <h2
              className="text-3xl font-semibold mb-6 text-center"
              style={{ color: "#5ac2be" }}
            >
              Bulk Upload XLSX for {cleanedTableName1}
            </h2>
            <div className="mb-6">
              <label
                htmlFor="file"
                className="block mb-2 text-lg text-gray-700 font-semibold"
              >
                Select XLSX File:
              </label>
              <div className="relative border border-gray-300 rounded-lg px-4 py-2 w-full flex items-center justify-between focus-within:border-blue-500">
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  accept=".csv, .xlsx"
                />
                <span className="text-gray-600 mr-2">Upload your file</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-center mb-6">
              <button
                onClick={handleUpload}
                className="bg-Teal-500 hover:bg-Teal-700 text-block font-bold py-2 px-4 rounded mb-4 mr-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-Teal-500"
                style={{ borderRadius: "3px", background: "#9CDADA" }}
              >
                Upload
              </button>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleformdownload}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:bg-green-600"
              >
                Download Form Structure
              </button>
            </div>
            {message && (
              <div className="mt-6 text-lg text-red-500">{message}</div>
            )}
            {errorReport && (
              <div className="mt-6">
                <button
                  onClick={downloadErrorReport}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Download Error Report
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-94cfcf text-white py-4 text-center">
        <div className="container mx-auto">
          <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export function BulkUploadModal({
  tableName = "",
  show = false,
  toggleModal = () => {},
}) {
  const onDrop = (acceptedFiles) => {
    try {
      setFile(acceptedFiles[0]);
      console.log(acceptedFiles);
    } catch (e) {
      console.log({ e });
    }
    // Process the accepted files
  };

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [errorReport, setErrorReport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      accept: {
        "text/csv": [".csv"],
      },
    });

  useEffect(() => {
    if (show) {
      // Clear files on mount
      setFile(null);
    }
  }, [show]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!tableName || !file) {
      setMessage("Table name and CSV file are required");
      setErrorReport(null);
      return;
    }
    setIsSubmitting(true);

    setMessage("Uploading CSV file...");
    setErrorReport(null);

    const formData = new FormData();
    formData.append("table_name", tableName);
    formData.append("csv_file", file);

    axios
      .post(`${apiURL}/upload_csv_to_table/`, formData, {
        responseType: "blob",
      })
      .then((response) => {
        if (response.status === 201) {
          setMessage(response.data.message);
          setErrorReport(null);
        } else if (response.status === 400) {
          const errorMessage = response.data.message;
          setMessage(errorMessage);
          setErrorReport(null);
        } else if (response.headers["content-type"] === "text/csv") {
          const blob = new Blob([response.data], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          setErrorReport(url);
          setMessage(
            "Errors occurred during upload. Click the button below to download the error report."
          );
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

  const downloadErrorReport = () => {
    if (errorReport) {
      const link = document.createElement("a");
      link.href = errorReport;
      link.setAttribute("download", "error_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(errorReport);
      setErrorReport(null);
    }
  };

  const handleformdownload = async () => {
    try {
      const response = await fetch(
        `${apiURL}/download_table_column_data/${tableName}/`
      );

      if (!response.ok) {
        throw new Error("Failed to download table data");
      }
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${tableName}.csv`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading table data:", error);
      alert("Failed to download table data. Please try again later.");
    }
  };

  const cleanedTableName1 = useMemo(() => {
    if (show && tableName !== "") {
      const cleanedTableName = tableName?.replace("roots", "");
      return (
        cleanedTableName.charAt(0).toUpperCase() + cleanedTableName.slice(1)
      );
    }

    return "";
  }, [show, tableName]);

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <Modal
      show={show}
      onHide={() => toggleModal(false, "")}
      backdrop="static"
      keyboard={false}
      centered
      size="lg"
    >
      <Modal.Header className="m-0 p-2 w-100 text-white text-base bg-[#5BC4BF] font-medium">
        <Modal.Title className="m-0 p-0 w-100">
          <div className="flex justify-between items-center w-100">
            <span className="text-white text-base">
              {/* {isView
                ? "Appointment"
                : isUpdate
                ? "Update Appointment"
                : "Add New Appointment"} */}
              Bulk Upload CSV for {cleanedTableName1}
            </span>
            <button onClick={() => toggleModal(false, "")}>
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
        {/* New UI */}

        <div className="flex flex-column gap-4 relative">
          <div className="w-full px-4">
            <FormField
              label="Select Table"
              // error={errFields.ProgramName}
              required
            >
              <input
                className="w-100 p-[0.725rem] rounded-[2px]"
                name={"tableName"}
                placeholder="Table Name"
                value={cleanedTableName1}
                style={{
                  border: `1px solid ${
                    "!errFields.ProgramName" ? "#5BC4BF" : "red"
                  }`,
                  fontSize: "14px",
                }}
                disabled
                // onChange={(item) => {
                //   handleInputChange("ProgramName", item.target.value);
                // }}
              />
            </FormField>
          </div>

          <div className="w-full px-4">
            <div
              {...getRootProps({
                className: `flex flex-column items-center justify-center border-[1px] border-dashed border-teal-400 ${
                  isDragActive ? "bg-teal-100" : "bg-gray-100"
                } h-[170px] w-100 p-4`,
              })}
            >
              <input {...getInputProps()} accept=".csv" />
              <div className="flex flex-column gap-2">
                <img
                  src={LinkIcon}
                  style={{
                    height: "20px",
                    width: "100%",
                  }}
                />
                <p>{isDragActive ? "Drop here..." : "Drop your XLS file"}</p>
              </div>
            </div>
          </div>

          {file && (
            <div className="w-full px-4">
              <aside>
                <h4>Files</h4>
                {/* <ul>{files}</ul> */}
                <ul>
                  <li>
                    {file.path} - {file.size} bytes
                  </li>
                </ul>
              </aside>
            </div>
          )}

          <div className="flex gap-2 items-center justify-center">
            <button
              onClick={() => toggleModal(false, "")}
              className="px-3 py-1 border-1 sm:border-2 rounded-sm border-[#2F9384] text-[13px] font-medium leading-5 text-[#2F9384] hover:bg-[#2F9384] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#2F9384] focus:ring-opacity-50 transition-colors duration-300"
            >
              Cancel
            </button>

            <button
              className="px-3 py-1 text-[13px] font-medium leading-5 bg-[#5BC4BF] border-1 border-[#5BC4BF] text-white rounded-sm font-medium hover:bg-[#429e97] focus:outline-none focus:ring-2 focus:ring-[#429e97] focus:ring-opacity-50 transition-colors duration-300"
              onClick={handleUpload}
            >
              Upload
            </button>
          </div>
          <div className="mb-[30px] border-[1px] border-[#DBE0E5] mx-4 p-2">
            <div className="flex justify-between items-center">
              <button
                onClick={handleformdownload}
                className="text-black p-2 px-2.5 text-xs flex gap-3 items-center"
              >
                <span>Download Form Structure</span>
                <img
                  src={DownloadIcon}
                  style={{
                    height: "13px",
                    width: "auto",
                  }}
                />
              </button>
              <button
                onClick={() => {}}
                className="text-black p-2 px-2.5 text-xs flex gap-3 items-center"
              >
                <span>Download Instructions</span>
                <img
                  src={DownloadIcon}
                  style={{
                    height: "13px",
                    width: "auto",
                  }}
                />
              </button>
            </div>
            {message && (
              <div className="mt-6 text-lg text-red-500">{message}</div>
            )}
            {errorReport && (
              <div className="mt-6">
                <button
                  onClick={downloadErrorReport}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Download Error Report
                </button>
              </div>
            )}
          </div>

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
              <p className="text-base">Uploading...</p>
            </div>
          )}
        </div>

        {/* Main Content */}
        {/* <main className="flex-grow bg-f6f6f6">
          <div className="container mx-auto py-8">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
              <div className="mb-6">
                <label
                  htmlFor="file"
                  className="block mb-2 text-lg text-gray-700 font-semibold"
                >
                  Select CSV File:
                </label>
                <div className="relative border border-gray-300 rounded-lg px-4 py-2 w-full flex items-center justify-between focus-within:border-blue-500">
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    accept=".csv"
                  />
                  <span className="text-gray-600 mr-2">Upload your file</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleUpload}
                  className="bg-Teal-500 hover:bg-Teal-700 text-block font-bold py-2 px-4 rounded mb-4 mr-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-Teal-500"
                  style={{ borderRadius: "3px", background: "#9CDADA" }}
                >
                  Upload
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleformdownload}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:bg-green-600"
                >
                  Download Form Structure
                </button>
              </div>
              {message && (
                <div className="mt-6 text-lg text-red-500">{message}</div>
              )}
              {errorReport && (
                <div className="mt-6">
                  <button
                    onClick={downloadErrorReport}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Download Error Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </main> */}
      </Modal.Body>
    </Modal>
  );
}

export default BulkUploadComponent;

function FormField({ required = false, label = "", error, children }) {
  return (
    <>
      <div className="flex flex-column gap-1 w-100">
        {label && (
          <p className="mb-1 ms-1 text-base flex gap-2 items-center font-medium">
            <span>{label}</span>
            {required && <span className="text-red-400">*</span>}
          </p>
        )}
        {children}
        {error && <p className="mt-1 ms-1 text-xs text-red-400">{error}</p>}
      </div>
    </>
  );
}
