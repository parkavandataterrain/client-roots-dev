import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShare,
  faDownload,
  faUpload,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

import { Input, Ripple, initMDB } from "mdb-ui-kit";
import deleteImage from "../../image/delete.jpg";
import edit from "../../image/dataview.png";
import bulk from "../../image/blk.png";
import share from "../../image/share.jpg";
import down from "../../image/Download.png";
import file from "../../image/file.jpg";
import file1 from "../../image/file1.png";
import date from "../../image/clock.png";
import apiURL from "../../apiConfig";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import { BulkUploadModal } from "./BulkUploadComponent";

initMDB({ Input, Ripple });

function CreateTableForm() {
  const [tableName, setTableName] = useState("");
  const [tableColumns, setTableColumns] = useState([]);
  const [formData, setFormData] = useState({});
  const [matchingTables, setMatchingTables] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiURL}/get_matching_tables/`);
        setMatchingTables(response.data.matching_tables);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTables = matchingTables.filter((tableName) =>
    tableName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentURL = window.location.href;

  const staticurl = `${currentURL}`;

  const handleShare = async (tableName) => {
    const url = `${staticurl}/${tableName}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Share Table Form",
          text: "Check out this table form",
          url: url,
        });
        console.log("Shared successfully");
      } else {
        throw new Error("Web Share API is not supported in this browser");
      }
    } catch (error) {
      console.error("Error sharing:", error);

      Swal.fire({
        title: "Copy to Clipboard",
        text: "Click below to copy the URL to clipboard:",
        input: "text",
        inputValue: url,
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Copy",
        cancelButtonText: "Cancel",
        inputReadOnly: true,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigator.clipboard
            .writeText(url)
            .then(() => {
              Swal.fire("Copied!", "URL copied to clipboard.", "success");
            })
            .catch((err) => {
              console.error("Unable to copy URL to clipboard: ", err);
              Swal.fire("Error", "Failed to copy URL to clipboard.", "error");
            });
        }
      });
    }
  };

  const handledownload = async (tableName) => {
    try {
      const response = await axios.get(
        `${apiURL}/download_table_data/${tableName}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${tableName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading table data:", error);
      alert("Failed to download table data. Please try again later.");
    }
  };

  // Bulk Upload Modal

  const [showBulkUpload, setShowBulkUpload] = useState({
    state: false,
    tableName: "",
  });

  const toggleBulkUpload = (state, tableName = "") => {
    let newState = {
      state: false,
      table: "",
    };

    if (state && tableName === "") {
      alert("No Table has been selected");
      return false;
    }

    if (state) {
      newState = {
        state: true,
        tableName: tableName,
      };
    }

    setShowBulkUpload(newState);
  };

  return (
    <div className="container">
      <div className="row">
        <div
          className="row justify-content-center align-items-center"
          style={{
            minHeight: "200px",
            backgroundColor: "#f8f9fa",
            padding: "20px",
          }}
        >
          <div className="col text-center">
 
            <h1 className="display-3" style={{ fontFamily: 'Arial, sans-serif', color: 'rgb(51, 51, 51)' }}>Form Directories</h1>
            <p className="lead" style={{ fontFamily: 'Arial, sans-serif', color: 'rgb(102, 102, 102)' }}>Explore and manage all forms here</p>

            <div className="input-group mb-3 justify-content-center" style={{ width: '50%', margin: 'auto' }}>
 
              <input
                type="text"
                className="form-control"
                placeholder="Search forms..."
                aria-label="Search forms"
                aria-describedby="basic-addon2"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <div className="input-group-append">
                <button className="btn btn-outline-secondary" type="button">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          {filteredTables.map((matchedTableName, index) => {
            const cleanedTableName = matchedTableName.replace("roots", "");
            return (
              <div
                key={index}
                className="card border-success row col-2"
                style={{ maxWidth: "18rem", margin: "20px" }}
              >
                <div className="card-header bg-transparent border-success">
                  <div className="row justify-content-center">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="disabled-tooltip">view</Tooltip>}
                    >
                      <div className="col-4 text-center">
                        <a href={`/createtableform/${matchedTableName}`}>
                          <img
                            src={edit}
                            alt="Edit"
                            className="img-fluid"
                            style={{ width: "40px", height: "40px" }}
                          />
                        </a>
                      </div>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="disabled-tooltip">Share</Tooltip>}
                    >
                      <div className="col-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleShare(matchedTableName)}
                        >
                          <img
                            src={share}
                            alt="Share"
                            className="img-fluid"
                            style={{ width: "40px", height: "40px" }}
                          />
                        </button>
                      </div>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="disabled-tooltip">Bulk Upload</Tooltip>
                      }
                    >
                      <div className="col-4 text-center">
                        <a
                          // href={`/BulkUploadComponent/${matchedTableName}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleBulkUpload(true, matchedTableName);
                          }}
                        >
                          <img
                            src={bulk}
                            alt="Bulk"
                            className="img-fluid"
                            style={{ width: "40px", height: "40px" }}
                          />
                        </a>
                      </div>
                    </OverlayTrigger>
                  </div>
                </div>

                <div className="card-body text-success">
                  <div style={{ textAlign: "center" }}>
                    <h5 className="card-title" style={{ fontWeight: "bold" }}>
                      {cleanedTableName.charAt(0).toUpperCase() +
                        cleanedTableName.slice(1)}
                    </h5>

                    <a href={`/createtableform/${matchedTableName}`}>
                      <img
                        src={file1}
                        alt="File1"
                        className="img-fluid"
                        style={{
                          width: "60px",
                          height: "60px",
                          flexShrink: 0,
                          margin: "auto",
                        }}
                      />
                    </a>
                  </div>
                </div>

                <div className="card-footer bg-transparent border-success">
                  <div className="row justify-content-center">
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="disabled-tooltip">
                          Form created date 25-04-2024
                        </Tooltip>
                      }
                    >
                      <div className="col-6 text-center">
                        <img
                          src={date}
                          alt="Date"
                          style={{ width: "40px", height: "40px" }}
                        />
                      </div>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="disabled-tooltip">
                          Form Data Download
                        </Tooltip>
                      }
                    >
                      <div className="col-6 text-center">
                        <button
                          type="button"
                          onClick={() => handledownload(matchedTableName)}
                        >
                          <img
                            src={down}
                            alt="Download"
                            style={{ width: "40px", height: "40px" }}
                          />
                        </button>
                      </div>
                    </OverlayTrigger>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BulkUploadModal
        show={showBulkUpload.state}
        tableName={showBulkUpload.tableName}
        toggleModal={toggleBulkUpload}
      />
    </div>
  );
}

export default CreateTableForm;
