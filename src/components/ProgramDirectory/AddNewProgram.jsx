import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import BackArrowIcon from "../images/back-arrow.svg";
import Select, { components } from "react-select";

import CloseIcon from "../images/form_builder/close_x.svg";
import { Modal } from "react-bootstrap";

import axios from "../../helper/axiosInstance";
import {
  notify,
  notifyError,
  notifySuccess,
} from "../../helper/toastNotication";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";

export default function AddNewProgram() {
  const navigate = useNavigate();
  const location = useLocation();
  const { paramid } = useParams();

  const [formDetail, setFormDetail] = useState({
    teamMembers: [],
    DepartmentName: null,
    ProgramName: "",
    ProgramDescription: "",
    Activity: [],
    Eligibility: "",
    ManagementAdminContacts: [],
    ClientMattersContacts: [],
  });

  const [errFields, setErrFields] = useState({});
  const [departmentNameOptions, setDepartmentNameOptions] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [activityOptions, setActivityOptions] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchDepartment();
    fetchActivity();
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

  const isEdit = useMemo(() => {
    const { pathname } = location;
    const splittedPath = pathname.split("/");
    if (paramid && splittedPath.includes("update-program-directory")) {
      return true;
    }
    return false;
  }, [paramid, location]);

  const fetchData = () => {
    axios
      .get(`/api/resources/program/${paramid}`)
      .then((response) => {
        setLoadingData(true);
        const { data } = response;
        setFormDetail({
          teamMembers: data.team_members
            ? data.team_members.map((item) => {
                return {
                  ...item,
                  label: item.first_name + " " + item.last_name,
                  value: item.id,
                };
              })
            : [],
          DepartmentName: data.department_name
            ? {
                label: data.department_name,
                value: data.department_name,
              }
            : null,
          ProgramName: data.name || "",
          ProgramDescription: data.description || "",
          Eligibility: data.eligibility || "",
          Activity: data.activities
            ? data.activities.map((item) => {
                return {
                  ...item,
                  label: item.name,
                  value: item.id,
                };
              })
            : [],
          ManagementAdminContacts: data.primary_contact
            ? data.primary_contact.map((item) => {
                return {
                  ...item,
                  label: item.first_name + " " + item.last_name,
                  value: item.id,
                };
              })
            : [],
          ClientMattersContacts: data.client_matter_contact
            ? data.client_matter_contact.map((item) => {
                return {
                  ...item,
                  label: item.first_name + " " + item.last_name,
                  value: item.id,
                };
              })
            : [],
        });
      })
      .catch((error) => {
        console.error("Error fetching program details:", error);
      })
      .finally(() => {
        setLoadingData(false);
      });
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsersList(
        response.data.map((itm) => {
          return {
            ...itm,
            label: itm.first_name + " " + itm.last_name,
            value: itm.id,
          };
        })
      );
    } catch (error) {
      // Handle errors here
      console.error("Error fetching position titles:", error);
    }
  };

  const fetchDepartment = async () => {
    try {
      const response = await axios.get("/api/resources/department");
      setDepartmentNameOptions(
        response.data.map((itm) => {
          return {
            ...itm,
            label: itm.name,
            value: itm.name,
          };
        })
      );
    } catch (error) {
      // Handle errors here
      console.error("Error fetching department:", error);
    }
  };

  const fetchActivity = async () => {
    try {
      const response = await axios.get("/activities/");
      setActivityOptions(
        response.data.map((itm) => {
          return {
            ...itm,
            label: itm.name,
            value: itm.id,
          };
        })
      );
    } catch (error) {
      // Handle errors here
      console.error("Error fetching activities :", error);
    }
  };

  const fieldValidation = () => {
    let errorFields = {};

    if (!formDetail.ProgramName) {
      errorFields.ProgramName = "Please fill the program name";
    }

    // if (!formDetail.DepartmentName) {
    //   errorFields.DepartmentName = "Please select the department name";
    // }

    // if (!formDetail.ProgramDescription) {
    //   errorFields.ProgramDescription = "Please fill the program description";
    // }

    // if (!formDetail.Eligibility) {
    //   errorFields.Eligibility = "Please fill the eligibility";
    // }

    // if (formDetail.teamMembers.length === 0) {
    //   errorFields.teamMembers = "Please select minimum one team member";
    // }

    // if (formDetail.ManagementAdminContacts.length === 0) {
    //   errorFields.ManagementAdminContacts =
    //     "Please select minimum one Management Admin Contact";
    // }

    // if (formDetail.ClientMattersContacts.length === 0) {
    //   errorFields.ClientMattersContacts =
    //     "Please select minimum one Client Matters Contact";
    // }

    setErrFields(errorFields);

    if (JSON.stringify(errorFields) === "{}") {
      return true; // true when validation success
    }

    return false; // false when validation fails
  };

  const handleSubmit = async () => {
    if (fieldValidation()) {
      try {
        setIsSubmitting(true);
        let data = {
          name: formDetail.ProgramName,
          department_name: formDetail.DepartmentName?.value || "",
          description: formDetail.ProgramDescription,
          eligibility: formDetail.Eligibility,
          activities: formDetail.Activity.map((each) => each.id),
          primary_contact: formDetail.ManagementAdminContacts.map(
            (each) => each.id
          ),
          client_matter_contact: formDetail.ClientMattersContacts.map(
            (each) => each.id
          ),
          team_members: formDetail.teamMembers.map((each) => each.id),
        };

        let apiCall = axios.post;
        let endpoint = "/api/resources/program";

        if (isEdit) {
          apiCall = axios.put;
          endpoint = `${endpoint}/${paramid}`;
        }

        const response = await apiCall(endpoint, data);
        notifySuccess(`Program ${isEdit ? "updated" : "added"} successfully`);
        navigate(`/program-directory/${response.data.id}`, { replace: true });
      } catch (error) {
        console.error(
          `Error ${isEdit ? "updating" : "adding"} program:`,
          error
        );
        if (error.response.status === 400) {
          if (error?.response?.data) {
            if (typeof error?.response?.data === "object") {
              let errObj = Object.keys(error.response.data);
              Object.keys(errObj).map((itm) => {
                errObj[itm].map((errMsg) => notifyError(errMsg));
              });
            } else {
              notifyError(error?.response?.data);
            }
          }
        } else {
          notifyError(
            `Error ${
              isEdit ? "updating" : "adding"
            } program, try after sometime`
          );
        }
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

  const handleMultiSelectChange = (key, selectedOptions) => {
    setFormDetail((prevDetails) => ({
      ...prevDetails,
      [key]: selectedOptions,
    }));
  };

  const toggleActivity = () => {
    setShowActivity((prev) => !prev);
    fetchActivity();
  };

  return (
    <>
      <div className="flex flex-column gap-2 items-center">
        <PageHeader title={`${isEdit ? "Update" : "Add new"} program`} />
        <div className="flex flex-column gap-2 w-100 shadow-md rounded-md relative">
          <div className="flex flex-column gap-1 p-4">
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/3 p-4">
                <FormField
                  label="Department Name"
                  error={errFields.DepartmentName}
                  required
                >
                  <Select
                    isClearable={false}
                    name={"DepartmentName"}
                    options={departmentNameOptions}
                    placeholder="Department Name"
                    value={formDetail.DepartmentName}
                    onChange={(item) => {
                      handleInputChange("DepartmentName", item);
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        padding: "5px",

                        border: `1px solid ${
                          !errFields.DepartmentName ? "#5BC4BF" : "red"
                        }`,

                        fontSize: "14px",
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
                    menuPortalTarget={document.body}
                  />
                </FormField>
              </div>
              <div className="w-full md:w-1/3 p-4">
                <FormField
                  label="Program Name"
                  error={errFields.ProgramName}
                  required
                >
                  <input
                    className="w-100 p-[0.725rem] rounded-[2px]"
                    name={"ProgramName"}
                    placeholder="Program Name"
                    value={formDetail.ProgramName}
                    style={{
                      border: `1px solid ${
                        !errFields.ProgramName ? "#5BC4BF" : "red"
                      }`,
                      fontSize: "14px",
                    }}
                    onChange={(item) => {
                      handleInputChange("ProgramName", item.target.value);
                    }}
                  />
                </FormField>
              </div>
              <div className="w-full md:w-1/3 p-4">
                <FormField label="Activity" error={errFields.Activity} required>
                  <Select
                    isClearable={false}
                    name={"Activity"}
                    options={activityOptions}
                    changeOptionsData={() => {
                      setShowActivity(true);
                    }}
                    placeholder="Select Activity"
                    value={formDetail.Activity}
                    onChange={(item) => {
                      handleInputChange("Activity", item);
                    }}
                    isMulti
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        padding: "5px",

                        border: `1px solid ${
                          !errFields.Activity ? "#5BC4BF" : "red"
                        }`,

                        fontSize: "14px",
                      }),
                      menu: (styles) => ({
                        ...styles,
                        background: "white",
                        zIndex: 9999,
                      }),
                    }}
                    components={{
                      IndicatorSeparator: () => null,
                      Menu,
                      Option,
                    }}
                    menuPortalTarget={document.body}
                  />
                </FormField>
              </div>
            </div>
            <div className="mx-[25px] my-[15px]">
              <FormField
                label="Eligibility"
                error={errFields.Eligibility}
                // required
              >
                <textarea
                  rows={5}
                  className="w-100 rounded-[2px]"
                  name={"Eligibility"}
                  placeholder="Eligibility"
                  value={formDetail.Eligibility}
                  style={{
                    padding: "15px",
                    border: `1px solid ${
                      !errFields.Eligibility ? "#5BC4BF" : "red"
                    }`,
                    fontSize: "14px",
                  }}
                  onChange={(item) => {
                    handleInputChange("Eligibility", item.target.value);
                  }}
                />
              </FormField>
            </div>
            <div className="mx-[25px] my-[15px]">
              <FormField
                label="Program Description"
                error={errFields.ProgramDescription}
                // required
              >
                <textarea
                  rows={5}
                  name={"ProgramDescription"}
                  placeholder="Program Description"
                  value={formDetail.ProgramDescription}
                  className="w-100 rounded-[2px]"
                  style={{
                    padding: "15px",
                    border: `1px solid ${
                      !errFields.ProgramDescription ? "#5BC4BF" : "red"
                    }`,
                    fontSize: "14px",
                  }}
                  onChange={(item) => {
                    handleInputChange("ProgramDescription", item.target.value);
                  }}
                />
              </FormField>
            </div>

            <div className="flex flex-wrap">
              <div className="w-full md:w-1/3 p-4">
                <FormField
                  label="Team Members"
                  error={errFields.teamMembers}
                  // required
                >
                  <Select
                    isClearable={false}
                    name={"teamMembers"}
                    options={usersList}
                    placeholder="Team Members"
                    value={formDetail.teamMembers}
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
                    onChange={(item) => {
                      handleMultiSelectChange("teamMembers", item);
                    }}
                    isMulti
                    menuPortalTarget={document.body}
                  />
                </FormField>
              </div>

              <div className="w-full md:w-1/3 p-4">
                <FormField
                  label="Management / Admin Contacts"
                  error={errFields.ManagementAdminContacts}
                  // required
                >
                  <Select
                    isClearable={false}
                    name={"ManagementAdminContacts"}
                    options={usersList}
                    placeholder="Management / Admin Contacts"
                    value={formDetail.ManagementAdminContacts}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        padding: "5px",

                        border: `1px solid ${
                          !errFields.ManagementAdminContacts ? "#5BC4BF" : "red"
                        }`,

                        fontSize: "14px",
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
                    onChange={(item) => {
                      handleMultiSelectChange("ManagementAdminContacts", item);
                    }}
                    isMulti
                    menuPortalTarget={document.body}
                  />
                </FormField>
              </div>
              <div className="w-full md:w-1/3 p-4">
                <FormField
                  label="Client Matters Contacts"
                  error={errFields.ClientMattersContacts}
                  // required
                >
                  {" "}
                  <Select
                    isClearable={false}
                    name={"ClientMattersContacts"}
                    options={usersList}
                    placeholder="Client Matters Contacts"
                    value={formDetail.ClientMattersContacts}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        padding: "5px",

                        border: `1px solid ${
                          !errFields.ClientMattersContacts ? "#5BC4BF" : "red"
                        }`,

                        fontSize: "14px",
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
                    onChange={(item) => {
                      handleMultiSelectChange("ClientMattersContacts", item);
                    }}
                    isMulti
                    menuPortalTarget={document.body}
                  />
                </FormField>
              </div>
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
              {isEdit ? "Update" : "Save"}
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
        <AddNewActivity show={showActivity} toggleModal={toggleActivity} />
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

const Menu = (props) => {
  return (
    <>
      <components.Menu {...props}>
        <div>
          <div>{props.children}</div>
          <div className="flex justify-center items-center p-1">
            <button
              className={""}
              onClick={props.selectProps.changeOptionsData}
            >
              <span className="text-base text-teal-400 hover:text-teal-700">
                + Add New Activity
              </span>
            </button>
          </div>
        </div>
      </components.Menu>
    </>
  );
};

const Option = (props) => {
  return (
    <>
      <components.Option {...props}>{props.children}</components.Option>
    </>
  );
};

const AddNewActivity = ({
  show,
  toggleModal,
  isUpdate,
  refresh,
  activityID,
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    getValues,
    watch,
    resetField,
    formState: { errors },
  } = useForm();

  const subActivityValue = watch("sub_activity");

  const [mainActivityOptions, setMainActivityOptions] = useState([]);
  const [subActivityOptions, setSubActivityOptions] = useState([]);
  const [postingSubAct, setPostingSubAct] = useState(false);
  const [createConfirmSubAct, setCreateConfirmSubAct] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const disableEdit = false;

  useEffect(() => {
    // fetchActivity();
    fetchSubActivity();
  }, []);

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleKeyDown = (event) => {
    const isNoOptionFound = () => {
      let isAnyFound = subActivityOptions.filter((itm) =>
        itm.label.includes(inputValue)
      );

      return isAnyFound.length > 0 ? false : true;
    };

    if (!inputValue) return;

    switch (event.key) {
      case "Enter":
      case "Tab":
        {
          if (isNoOptionFound()) {
            Swal.fire({
              title: "Are you sure?",
              text: `Do you want to Create New Sub Activity "${inputValue}" ?`,
              icon: "info",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Create",
            }).then((result) => {
              if (result.isConfirmed) {
                postSubActivity();
              }
            });
            event.preventDefault();
          }
        }
        break;
      default:
        break;
    }
  };

  const fetchActivity = async () => {
    try {
      const response = await axios.get("/activities/");
      setMainActivityOptions(
        response.data.map((itm) => {
          return {
            ...itm,
            label: itm.name,
            value: itm.id,
          };
        })
      );
    } catch (error) {
      // Handle errors here
      console.error("Error fetching activities :", error);
    }
  };

  const fetchSubActivity = async () => {
    try {
      const response = await axios.get("/sub-activity/");
      setSubActivityOptions(
        response.data.map((itm) => {
          return {
            ...itm,
            label: itm.name,
            value: itm.id,
          };
        })
      );
    } catch (error) {
      // Handle errors here
      console.error("Error fetching activities :", error);
    }
  };

  console.log({ subActivityValue, inputValue });

  const postSubActivity = async () => {
    try {
      setPostingSubAct(true);
      const response = await axios.post("/sub-activity/", {
        name: inputValue,
      });
      if (response.status === 201) {
        let newSetOpt = [
          {
            ...response.data,
            value: response.data?.id,
            label: response.data?.name,
          },
        ];
        newSetOpt = subActivityValue
          ? [...subActivityValue, ...newSetOpt]
          : newSetOpt;

        setValue("sub_activity", [...newSetOpt]);
        setInputValue("");
        fetchSubActivity();
      }
    } catch (error) {
      // Handle errors here
      console.error("Error posting new sub_activity :", error);
    } finally {
      setPostingSubAct(false);
    }
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);

    let postData = {
      // description: data.description,
      name: data.main_activity,
      sub_activities: data.sub_activity?.map((each) => each.id) || [],
    };

    let endpoint = "/activities/";
    let axiosCall = axios.post;

    if (isUpdate) {
      endpoint = `/activities/${activityID}/`;
      axiosCall = isUpdate ? axios.put : axios.post;
    }

    axiosCall(`${endpoint}`, postData)
      .then((response) => {
        Swal.fire({
          title: "Success!",
          text: `Activtiy ${isUpdate ? "Updated" : "Created"}`,
          icon: "success",
          timer: 2000,
        });
        refresh && refresh();
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((error) => {
        console.error("Error", error);
        Swal.fire({
          title: "Error!",
          text: `Unable to ${isUpdate ? "Update" : "Create"} Activity`,
          icon: "error",
          timer: 2000,
        });
      })
      .finally(() => {
        reset();
        setIsSubmitting(false);
        toggleModal();
      });
  };

  return (
    <Modal
      show={show}
      onHide={() => toggleModal()}
      backdrop="static"
      keyboard={false}
      centered
      size="lg"
    >
      <Modal.Header className="m-0 p-2 w-100 text-white text-base bg-[#5BC4BF] font-medium">
        <Modal.Title className="m-0 p-0 w-100">
          <div className="flex justify-between items-center w-100">
            <span className="text-white text-base">
              {`${isUpdate ? "Update" : "Add New"} Activity`}
            </span>
            <button onClick={() => toggleModal()}>
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
        <div className="flex relative items-center justify-centerx">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 w-100">
            <div className="mb-4">
              <label className="block mb-2">Main Activity *</label>
              <input
                className="w-100 p-[0.725rem] rounded-[2px]"
                name={"ActivityName"}
                placeholder="Enter Activity Name"
                style={{
                  border: `1px solid ${
                    !errors.main_activity ? "#5BC4BF" : "red"
                  }`,
                  fontSize: "14px",
                }}
                {...register("main_activity", {
                  required: "Main Activity Name is required",
                })}
              />

              {/* <Controller
                name="main_activity"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={mainActivityOptions}
                    isDisabled={disableEdit}
                    placeholder="Seelct Main Activity"
                    className="w-100"
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        padding: "3px",
                        border: `1px solid ${
                          !errors.main_activity ? "#5BC4BF" : "red"
                        }`,
                        fontSize: "14px",
                      }),
                      menu: (styles) => ({
                        ...styles,
                        background: "white",
                        zIndex: 9999,
                      }),
                    }}
                  />
                )}
                rules={{ required: "Main Activity is required" }}
              /> */}
              {errors.main_activity && (
                <p className="text-red-500">{errors.main_activity.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">Description</label>
              <textarea
                disabled={disableEdit}
                rows={5}
                {...register("description")}
                className="form-control text-xs p-2.5 border-teal-500"
              />
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">Sub Activity</label>
              <Controller
                name="sub_activity"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isLoading={postingSubAct}
                    options={subActivityOptions}
                    isDisabled={disableEdit}
                    placeholder="Select Sub Activity"
                    className="w-100"
                    noOptionsMessage={() =>
                      inputValue === ""
                        ? "Start Typing..."
                        : `Press Enter/Tab to Create "${inputValue}"`
                    }
                    isMulti
                    onInputChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        padding: "3px",
                        border: `1px solid ${
                          !errors.sub_activity ? "#5BC4BF" : "red"
                        }`,
                        fontSize: "14px",
                      }),
                      menu: (styles) => ({
                        ...styles,
                        background: "white",
                        zIndex: 9999,
                      }),
                    }}
                  />
                )}
                rules={
                  {
                    //  required: "Sub Activity is required"
                  }
                }
              />
              {errors.sub_activity && (
                <p className="text-red-500">{errors.sub_activity.message}</p>
              )}
            </div>

            <div className="flex flex-row justify-between items-center mb-2">
              <div className="p-3 ps-0">
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleModal();
                  }}
                  className="text-gray-400 text-xs border-[1px] border-[#43B09C] p-2 px-4"
                >
                  Cancel
                </a>
              </div>
              {!disableEdit && (
                <div className="p-3 pe-0">
                  <button
                    type="submit"
                    className="w-54 h-10 bg-[#43B09C] text-xs text-white p-2 px-4"
                  >
                    {isUpdate ? "Update" : "Save"}
                  </button>
                </div>
              )}
            </div>
          </form>
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
                {isUpdate ? "Updating..." : "Creating.."}
              </p>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
