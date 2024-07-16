import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import BackArrowIcon from "../images/back-arrow.svg";
import Select from "react-select";
import axios from "../../helper/axiosInstance";
import {
  notify,
  notifyError,
  notifySuccess,
} from "../../helper/toastNotication";
import Swal from "sweetalert2";

export default function ModifyMatchID() {
  const navigate = useNavigate();
  const location = useLocation();
  const { paramid } = useParams();

  const [formDetail, setFormDetail] = useState({
    LastName: "",
    FirstName: "",
    DOB: "",
    EmailId: "",
    MatchID: "",
  });

  const [errFields, setErrFields] = useState({});
  const [usersData, setUsersData] = useState({});
  const [loadingData, setLoadingData] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Clean up effect
    return () => {
      // Optionally do any cleanup here
    };
  }, []); // Empty dependency array means this effect runs only once after the component mounts

  useEffect(() => {
    if (JSON.stringify(errFields) !== "{}") {
      fieldValidation();
    }
  }, [formDetail]);

  useEffect(() => {
    if (paramid) {
      fetchData();
    }
  }, [paramid]);

  // useEffect(() => {
  //   if (paramid) {
  //     if (!formDetail.Supervisor) {
  //       if (formDetail.SupervisorEmail) {
  //         let supervisorData = supervisorOptions.find(
  //           (item) => item.email === formDetail.SupervisorEmail
  //         );
  //         if (supervisorData) {
  //           setFormDetail((prev) => {
  //             return {
  //               ...prev,
  //               Supervisor: {
  //                 ...supervisorData,
  //                 label:
  //                   supervisorData.first_name + " " + supervisorData.last_name,
  //                 value: supervisorData.id,
  //               },
  //             };
  //           });
  //         }
  //       }
  //     }
  //   }
  // }, [supervisorOptions, formDetail, paramid]);

  const isEdit = useMemo(() => {
    const { pathname } = location;
    const splittedPath = pathname.split("/");
    if (paramid && splittedPath.includes("update-match-id-directory")) {
      return true;
    }
    return false;
  }, [paramid, location]);

  const fetchData = () => {
    axios
      .get(`updateview_match_id/${paramid}`)
      .then((response) => {
        setLoadingData(true);
        const { data } = response;
        setFormDetail((prev) => {
          return {
            FirstName: data.first_name || "",
            LastName: data.last_name || "",
            EmailId: data.emai_address || "",
            MatchID: data.match_id || "",
            DOB: data.date_of_birth || "",
          };
        });
      })
      .catch((error) => {
        console.error("Error fetching match id details:", error);
      })
      .finally(() => {
        setLoadingData(false);
      });
  };

  const fieldValidation = () => {
    let errorFields = {};

    if (!formDetail.MatchID) {
      errorFields.MatchID = "Please enter Match ID";
    }

    // if (!formDetail.FirstName) {
    //   errorFields.FirstName = "Please fill the first name";
    // }

    // if (!formDetail.LastName) {
    //   errorFields.LastName = "Please fill the last name";
    // }

    // if (!formDetail.PhoneNumber) {
    //   errorFields.PhoneNumber = "Please fill the phone number";
    // }

    // if (!formDetail.EmailId) {
    //   errorFields.EmailId = "Please fill the email id";
    // }

    // var emailPattern = /^[A-Z0-9._%+-]+@rootscommunityhealth\.org$/i;

    // if (formDetail.EmailId && !emailPattern.test(formDetail.EmailId)) {
    //   errorFields.EmailId =
    //     "Please use an email ending with @rootscommunityhealth.org";
    //   // Proceed with form submission or further processing
    // }

    // if (!formDetail.PositionTitle) {
    //   errorFields.PositionTitle = "Please select the position";
    // }

    // if (!formDetail.PrimaryFacility) {
    //   errorFields.PrimaryFacility = "Please select the faculty";
    // }
    // if (!formDetail.Supervisor) {
    //   errorFields.Supervisor = "Please select the supervisor";
    // }

    // if (formDetail.Programs.length === 0) {
    //   errorFields.Programs = "Please select minimum one Programs";
    // }
    setErrFields(errorFields);

    if (JSON.stringify(errorFields) === "{}") {
      return true; // true when validation success
    }

    return false; // false when validation fails
  };

  const handleSubmit = async () => {
    if (fieldValidation()) {
      setIsSubmitting(true);
      try {
        console.log({ formDetail });
        let data = {
          first_name: formDetail.FirstName,
          last_name: formDetail.LastName,
          email_address: formDetail.EmailId,
          date_of_birth: formDetail.DOB,
          match_id: formDetail.MatchID.toUpperCase(),
          id: paramid,
        };

        console.log({ data });

        let apiCall = axios.post;
        let endpoint = "/updateview_match_id";

        if (isEdit) {
          apiCall = axios.put;
          endpoint = `${endpoint}/${paramid}/`;
        }

        const response = await apiCall(endpoint, data);
        notifySuccess(`Match ID ${isEdit ? "Updated" : "Added"} successfully`);
        // navigate(`/match-id-directory/${response.data.id}`, { replace: true });
        navigate(`/match-id-directory/`, { replace: true });
      } catch (error) {
        if (error?.response?.status === 400) {
          if (error?.response?.data) {
            Object.keys(error.response.data).map((itm) => {
              error.response.data[itm].map((errMsg) => notifyError(errMsg));
            });
          }
        } else {
          notifyError(
            `Error ${
              isEdit ? "Updating" : "Adding"
            } Match ID, try after sometime`
          );
        }

        console.error(
          `Error ${isEdit ? "Updating" : "Adding"} Match ID:`,
          error
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      notifyError("Please check all required fields are filled");
    }
  };

  const handleInputChange = (key, value) => {
    if (value !== " ") {
      setFormDetail((prevDetails) => ({
        ...prevDetails,
        [key]: value,
      }));
    }
  };

  return (
    <>
      <div className="flex flex-column gap-2 items-center">
        <PageHeader title={`${isEdit ? "Update" : "Add New"} Match ID`} />
        <div className="flex flex-column gap-2 w-100 shadow-md rounded-md relative">
          <div className="flex flex-column gap-1 p-4">
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 p-4">
                <FormField label="First Name" error={errFields.FirstName}>
                  <input
                    className="w-100 p-[0.725rem] rounded-[2px] border-[#5BC4BF] text-base"
                    style={{
                      border: `1px solid ${
                        !errFields.FirstName ? "#5BC4BF" : "red"
                      }`,
                      fontSize: "14px",
                    }}
                    name={"FirstName"}
                    placeholder="First Name"
                    value={formDetail.FirstName}
                    onChange={(e) =>
                      handleInputChange("FirstName", e.target.value)
                    }
                    disabled
                  />
                </FormField>
              </div>
              <div className="w-full md:w-1/2 p-4">
                <FormField label="Last Name" error={errFields.LastName}>
                  <input
                    className="w-100 p-[0.725rem] rounded-[2px] border-[#5BC4BF] text-base"
                    style={{
                      border: `1px solid ${
                        !errFields.LastName ? "#5BC4BF" : "red"
                      }`,
                      fontSize: "14px",
                    }}
                    name={"LastName"}
                    placeholder="Last Name"
                    value={formDetail.LastName}
                    onChange={(e) =>
                      handleInputChange("LastName", e.target.value)
                    }
                    disabled
                  />
                </FormField>
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 p-4">
                <FormField label="Date of Birth" error={errFields.DOB}>
                  <input
                    className="w-100 p-[0.725rem] rounded-[2px] border-[#5BC4BF] text-base"
                    style={{
                      border: `1px solid ${!errFields.DOB ? "#5BC4BF" : "red"}`,
                      fontSize: "14px",
                    }}
                    name={"DOB"}
                    placeholder="DOB"
                    value={formDetail.DOB}
                    onChange={(e) => handleInputChange("DOB", e.target.value)}
                    disabled
                  />
                </FormField>
              </div>
              <div className="w-full md:w-1/2 p-4">
                <FormField label="Email Id" error={errFields.EmailId}>
                  <input
                    className="w-100 p-[0.725rem] rounded-[2px] border-[#5BC4BF] text-base"
                    style={{
                      border: `1px solid ${
                        !errFields.EmailId ? "#5BC4BF" : "red"
                      }`,
                      fontSize: "14px",
                    }}
                    name={"EmailId"}
                    placeholder="Email Id"
                    value={formDetail.EmailId}
                    onChange={(e) =>
                      handleInputChange("EmailId", e.target.value)
                    }
                    disabled
                  />
                </FormField>
              </div>
            </div>
            <div className="mx-[25px] my-[15px]">
              <FormField label="Match ID" error={errFields.MatchID} required>
                <input
                  className="w-100 p-[0.725rem] uppercase rounded-[2px] border-[#5BC4BF] text-base"
                  style={{
                    border: `1px solid ${
                      !errFields.MatchID ? "#5BC4BF" : "red"
                    }`,
                    fontSize: "14px",
                  }}
                  name={"MatchID"}
                  placeholder="Match ID"
                  value={formDetail.MatchID}
                  onChange={(e) => handleInputChange("MatchID", e.target.value)}
                />
              </FormField>
            </div>
          </div>
          <div className="flex gap-2 items-center justify-center mb-[35px]">
            <button
              onClick={() => {
                navigate(-1);
              }}
              className="px-3 py-1 border-1 sm:border-2 rounded-sm border-[#2F9384] text-[13px] font-medium leading-5 text-[#2F9384] hover:bg-[#2F9384] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#2F9384] focus:ring-opacity-50 transition-colors duration-300"
            >
              Cancel
            </button>

            <button
              className="px-3 py-1 text-[13px] font-medium leading-5 bg-[#5BC4BF] border-1 border-[#5BC4BF] text-white rounded-sm font-medium hover:bg-[#429e97] focus:outline-none focus:ring-2 focus:ring-[#429e97] focus:ring-opacity-50 transition-colors duration-300"
              onClick={handleSubmit}
            >
              {`${isEdit ? "Edit" : "Save"}`}
            </button>
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
              <p className="text-base">
                {isEdit ? "Updating..." : "Creating.."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function PageHeader({ title }) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center w-100 mb-4">
      <p className="m-0 p-0 text-[20px] font-medium">{title}</p>
      <Link
        className="p-2 bg-[#EAECEB]"
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
      >
        <img
          src={BackArrowIcon}
          alt="back arrow"
          className="h-[15px] w-[100%]"
        />
      </Link>
    </div>
  );
}

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
