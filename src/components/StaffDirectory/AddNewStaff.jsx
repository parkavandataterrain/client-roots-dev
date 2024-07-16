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

export default function AddNewStaff() {
  const navigate = useNavigate();
  const location = useLocation();
  const { paramid } = useParams();

  const [formDetail, setFormDetail] = useState({
    LastName: "",
    FirstName: "",
    PhoneNumber: "",
    EmailId: "",
    AdditionalContactInformation: "",
    PositionTitle: null,
    PrimaryFacility: null,
    Supervisor: null,
    SupervisorEmail: "",
    Programs: [],
    NavigationClients: "",
    PermissionGroup: [],
    Navigator: false,
  });

  const [errFields, setErrFields] = useState({});

  const [usersData, setUsersData] = useState({});
  const [positionTitleOptions, setPositionTitleOptions] = useState([]);
  const [primaryFacilityOptions, setPrimaryFacilityOptions] = useState([]);
  const [supervisorOptions, setSupervisorOptions] = useState([]);
  const [programsOptions, setProgramsOptions] = useState([]);
  const [permissionsOptions, setPermissionsOption] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPositionTitles();
    fetchPrimaryFacility();
    fetchSupervisor();
    fetchPrograms();
    fetchPermissions();

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
      fetchUser();
    }
  }, [paramid]);

  useEffect(() => {
    if (paramid && JSON.stringify(usersData) !== "{}") {
      let PositionTitleData = usersData?.profile?.position
        ? {
            ...formDetail.PositionTitle,
            label: usersData.profile.position,
          }
        : {};
      let PrimaryFacilityData = usersData?.profile?.facility
        ? {
            ...formDetail.PrimaryFacility,
            label: usersData.profile.facility,
          }
        : {};
      let SupervisorData = {
        ...formDetail.Supervisor,
        label:
          usersData?.profile?.supervisor_first_name ||
          "" + " " + usersData?.profile?.supervisor_last_name ||
          "",
      };

      setFormDetail((prev) => {
        return {
          ...prev,
          PositionTitle: {
            ...formDetail.PositionTitle,
            ...PositionTitleData,
          },
          PrimaryFacility: {
            ...formDetail.PrimaryFacility,
            ...PrimaryFacilityData,
          },
          Supervisor: {
            ...formDetail.Supervisor,
            ...SupervisorData,
          },
          SupervisorEmail: usersData?.profile?.supervisor_email || "",
        };
      });
    }
  }, [usersData, paramid]);

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
    if (paramid && splittedPath.includes("update-staff-directory")) {
      return true;
    }
    return false;
  }, [paramid, location]);

  const fetchData = () => {
    axios
      .get(`/api/users/${paramid}`)
      .then((response) => {
        setLoadingData(true);
        const { data } = response;
        setFormDetail((prev) => {
          return {
            LastName: data.last_name || "",
            FirstName: data.first_name || "",
            PhoneNumber: data.profile.phone_no || "",
            EmailId: data.email || "",
            AdditionalContactInformation: "",
            PositionTitle: data?.profile?.position
              ? {
                  id: data.profile.position,
                  value: data.profile.position,
                }
              : null,
            PrimaryFacility: data?.profile?.facility
              ? {
                  id: data.profile.facility,
                  value: data.profile.facility,
                }
              : null,
            Supervisor: data?.profile?.supervisor
              ? {
                  id: data.profile.supervisor,
                  value: data.profile.supervisor,
                }
              : null,
            SupervisorEmail: data?.profile?.supervisor_email || "",
            Programs: data?.profile?.program
              ? data.profile.program.map((item) => {
                  return {
                    ...item,
                    label: item.program,
                    value: item.program,
                  };
                })
              : [],
            NavigationClients: "",
            Navigator: data?.is_navigator || false,
            PermissionGroup: data?.groups
              ? data.groups.map((item) => {
                  return {
                    ...item,
                    label: item.name,
                    value: item.id,
                  };
                })
              : [],
          };
        });
      })
      .catch((error) => {
        console.error("Error fetching program details:", error);
      })
      .finally(() => {
        setLoadingData(false);
      });
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/users");
      const foundUser = data.find((user) => +user.id === +paramid);
      if (foundUser) {
        setUsersData(foundUser);
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      // Handle errors here
      console.error("Error fetching users list:", error);
    }
  };

  const fetchPositionTitles = async () => {
    try {
      const response = await axios.get("/api/resources/position");
      setPositionTitleOptions(
        response.data.map((itm) => {
          return { ...itm, label: itm.name, value: itm.id };
        })
      );
    } catch (error) {
      // Handle errors here
      console.error("Error fetching position titles:", error);
    }
  };
  const fetchPrimaryFacility = async () => {
    try {
      const response = await axios.get("/api/resources/facilities");
      setPrimaryFacilityOptions(
        response.data.map((itm) => {
          return { ...itm, label: itm.name, value: itm.id };
        })
      );
    } catch (error) {
      // Handle errors here
      console.error("Error fetching position titles:", error);
    }
  };
  const fetchSupervisor = async () => {
    try {
      const response = await axios.get("/api/users");
      setSupervisorOptions(
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
  const fetchPrograms = async () => {
    try {
      const response = await axios.get("/api/resources/program");
      setProgramsOptions(
        response.data.map((itm) => {
          return {
            ...itm,
            program: itm.name,
            label: itm.name,
            value: itm.name,
          };
        })
      );
    } catch (error) {
      // Handle errors here
      console.error("Error fetching position titles:", error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const { data } = await axios.get("/api/groups");
      let options = data.map((item) => {
        return {
          label: item.name,
          value: item.id,
          ...item,
        };
      });
      setPermissionsOption(options);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching permission category :", error);
    }
  };

  const fieldValidation = () => {
    let errorFields = {};

    if (!formDetail.FirstName) {
      errorFields.FirstName = "Please fill the first name";
    }

    if (!formDetail.LastName) {
      errorFields.LastName = "Please fill the last name";
    }

    // if (!formDetail.PhoneNumber) {
    //   errorFields.PhoneNumber = "Please fill the phone number";
    // }

    if (!formDetail.EmailId) {
      errorFields.EmailId = "Please fill the email id";
    }

    var emailPattern = /^[A-Z0-9._%+-]+@rootscommunityhealth\.org$/i;

    if (formDetail.EmailId && !emailPattern.test(formDetail.EmailId)) {
      errorFields.EmailId =
        "Please use an email ending with @rootscommunityhealth.org";
      // Proceed with form submission or further processing
    }

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
        // Concatenate first name and last name, remove spaces, and keep alphanumeric characters

        // const username = `${formDetail.FirstName}${formDetail.LastName}`
        //   .replace(/\s+/g, "") // Remove spaces
        //   .replace(/[^\w]+/g, "");

        let username = "";

        if (formDetail.EmailId) {
          let splittedEmail = formDetail.EmailId.split("@");
          username = splittedEmail[0];
        }

        let data = {
          first_name: formDetail.FirstName,
          last_name: formDetail.LastName,
          email: formDetail.EmailId,
          username: username,
          groups: formDetail.PermissionGroup.map((each) => {
            return each.id;
          }),
          is_navigator: formDetail.Navigator,
        };

        let phone_no = formDetail.PhoneNumber || "";
        let position = formDetail.PositionTitle?.id || "";

        let facility = formDetail.PrimaryFacility?.id || "";
        // let supervisor = formDetail.Supervisor?.id || "";

        let program = formDetail.Programs.map((each) => {
          return isEdit ? { id: each.id, program: each.program } : each.id;
        });

        let profile = {};

        if (phone_no !== "") {
          profile.phone_no = phone_no;
        }

        if (position !== "") {
          profile.position = position;
        }

        if (facility !== "") {
          profile.facility = facility;
        }

        // if (supervisor !== "") {
        //   profile.supervisor = supervisor;
        // }

        if (program.length > 0) {
          profile.program = program;
        } else {
          if (JSON.stringify(profile) !== "{}") {
            profile.program = [];
          }
        }

        if (JSON.stringify(profile) !== "{}") {
          data.profile = profile;
        }

        // const data = {
        //   first_name: formDetail.FirstName,
        //   last_name: formDetail.LastName,
        //   email: formDetail.EmailId,
        //   username: username,
        //   profile: {
        //     phone_no: formDetail.PhoneNumber || "",
        //     position: formDetail.PositionTitle?.id || "",
        //     facility: formDetail.PrimaryFacility?.id || "",
        //     supervisor: formDetail.Supervisor?.id || "",
        //     program: formDetail.Programs.map((each) => {
        //       return isEdit ? { id: each.id, program: each.program } : each.id;
        //     }),
        //   },
        // };

        console.log({ data });

        let apiCall = axios.post;
        let endpoint = "/api/users";

        if (isEdit) {
          apiCall = axios.put;
          endpoint = `${endpoint}/${paramid}`;
        }

        const response = await apiCall(endpoint, data);
        notifySuccess(`Staff ${isEdit ? "Updated" : "Added"} successfully`);
        navigate(`/staff-directory/${response.data.id}`, { replace: true });
      } catch (error) {
        if (error?.response?.status === 400) {
          if (error?.response?.data) {
            Object.keys(error.response.data).map((itm) => {
              error.response.data[itm].map((errMsg) => notifyError(errMsg));
            });
          }
        } else {
          notifyError(
            `Error ${isEdit ? "Updating" : "Adding"} staff, try after sometime`
          );
        }

        console.error(`Error ${isEdit ? "Updating" : "Adding"} staff:`, error);
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

  const handleMultiSelectChange = (selectedOptions, key) => {
    setFormDetail((prevDetails) => ({
      ...prevDetails,
      [key]: selectedOptions,
    }));
  };

  const handleCheckboxChange = () => {
    setFormDetail((prev) => {
      return {
        ...prev,
        Navigator: !prev.Navigator,
      };
    });
  };

  const [inputValue, setInputValue] = useState("");
  const [postingPositionTitle, setPostingPositionTitle] = useState(false);

  const handlePositionInputChange = (value) => {
    setInputValue(value);
  };

  const handleKeyDown = (event) => {
    const isNoOptionFound = () => {
      let isAnyFound = positionTitleOptions.filter((itm) =>
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
              text: `Do you want to Create New Position "${inputValue}" ?`,
              icon: "info",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Create",
            }).then((result) => {
              if (result.isConfirmed) {
                postPositionTitle();
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

  const postPositionTitle = async () => {
    try {
      setPostingPositionTitle(true);
      const response = await axios.post("/api/resources/position", {
        name: inputValue,
      });
      if (response.status === 201) {
        let newSetOpt = {
          ...response.data,
          value: response.data?.id,
          label: response.data?.name,
        };
        handleInputChange("PositionTitle", newSetOpt);
        setInputValue("");
        fetchPositionTitles();
      }
    } catch (error) {
      // Handle errors here
      console.error("Error posting new sub_activity :", error);
    } finally {
      setPostingPositionTitle(false);
    }
  };

  return (
    <>
      <div className="flex flex-column gap-2 items-center">
        <PageHeader title={`${isEdit ? "Update" : "Add New"} Staff`} />
        <div className="flex flex-column gap-2 w-100 shadow-md rounded-md relative">
          <div className="flex flex-column gap-1 p-4">
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 p-4">
                <FormField
                  label="Last Name"
                  error={errFields.LastName}
                  required
                >
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
                  />
                </FormField>
              </div>
              <div className="w-full md:w-1/2 p-4">
                <FormField
                  label="First Name"
                  error={errFields.FirstName}
                  required
                >
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
                  />
                </FormField>
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 p-4">
                <FormField label="Phone Number" error={errFields.PhoneNumber}>
                  <input
                    className="w-100 p-[0.725rem] rounded-[2px] border-[#5BC4BF] text-base"
                    style={{
                      border: `1px solid ${
                        !errFields.PhoneNumber ? "#5BC4BF" : "red"
                      }`,
                      fontSize: "14px",
                    }}
                    name={"PhoneNumber"}
                    placeholder="Phone Number"
                    value={formDetail.PhoneNumber}
                    onChange={(e) =>
                      handleInputChange("PhoneNumber", e.target.value)
                    }
                  />
                </FormField>
              </div>
              <div className="w-full md:w-1/2 p-4">
                <FormField label="Email Id" error={errFields.EmailId} required>
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
                  />
                </FormField>
              </div>
            </div>
            <div className="mx-[25px] my-[15px]">
              <FormField
                label="Additional Contact Information"
                error={errFields.AdditionalContactInformation}
              >
                <textarea
                  rows={5}
                  name={"AdditionalContactInformation"}
                  placeholder="Additional Contact Information"
                  value={formDetail.AdditionalContactInformation}
                  onChange={(e) =>
                    handleInputChange(
                      "AdditionalContactInformation",
                      e.target.value
                    )
                  }
                  className="w-100 rounded-[2px]"
                  style={{
                    padding: "15px",
                    border: `1px solid ${
                      !errFields.AdditionalContactInformation
                        ? "#5BC4BF"
                        : "red"
                    }`,
                    fontSize: "14px",
                  }}
                />
              </FormField>
            </div>
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 p-4">
                <FormField
                  label="Position Title"
                  error={errFields.PositionTitle}
                >
                  <Select
                    name={"PositionTitle"}
                    isLoading={postingPositionTitle}
                    options={positionTitleOptions}
                    placeholder="Position Title"
                    value={formDetail.PositionTitle}
                    noOptionsMessage={() =>
                      inputValue === ""
                        ? "Start Typing..."
                        : `Press Enter/Tab to Create "${inputValue}"`
                    }
                    onInputChange={handlePositionInputChange}
                    onKeyDown={handleKeyDown}
                    onChange={(selectedOption) =>
                      handleInputChange("PositionTitle", selectedOption)
                    }
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        padding: "5px",

                        border: `1px solid ${
                          !errFields.PositionTitle ? "#5BC4BF" : "red"
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
              <div className="w-full md:w-1/2 p-4">
                <FormField
                  label="Primary Facility"
                  error={errFields.PrimaryFacility}
                >
                  <Select
                    name={"PrimaryFacility"}
                    options={primaryFacilityOptions}
                    placeholder="Primary Facility"
                    value={formDetail.PrimaryFacility}
                    onChange={(selectedOption) =>
                      handleInputChange("PrimaryFacility", selectedOption)
                    }
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        padding: "5px",

                        border: `1px solid ${
                          !errFields.PrimaryFacility ? "#5BC4BF" : "red"
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
            </div>

            {/* -------- Supervisor Input ---------- */}
            {/* <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 p-4">
                <FormField label="Supervisor" error={errFields.Supervisor}>
                  <Select
                    name={"Supervisor"}
                    options={supervisorOptions}
                    placeholder="Supervisor"
                    value={formDetail.Supervisor}
                    onChange={(selectedOption) => {
                      handleInputChange("Supervisor", selectedOption);
                      handleInputChange(
                        "SupervisorEmail",
                        selectedOption?.email
                      );
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        padding: "5px",

                        border: `1px solid ${
                          !errFields.Supervisor ? "#5BC4BF" : "red"
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
              <div className="w-full md:w-1/2 p-4">
                <FormField
                  label="Supervisor Email"
                  error={errFields.SupervisorEmail}
                >
                  <input
                    className="w-100 p-[0.725rem] rounded-[2px] border-[#5BC4BF] text-base"
                    style={{
                      border: `1px solid ${
                        !errFields.SupervisorEmail ? "#5BC4BF" : "red"
                      }`,
                      fontSize: "14px",
                    }}
                    disabled
                    name={"SupervisorEmail"}
                    placeholder="Supervisor Email"
                    value={formDetail.SupervisorEmail}
                    onChange={(e) =>
                      handleInputChange("SupervisorEmail", e.target.value)
                    }
                  />
                </FormField>
              </div>
            </div> */}

            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 p-4">
                <FormField label="Programs" error={errFields.Programs}>
                  <Select
                    name={"Programs"}
                    options={
                      programsOptions /* You need to provide options for Programs */
                    }
                    placeholder="Programs"
                    value={formDetail.Programs}
                    onChange={(selectedOption) =>
                      handleMultiSelectChange(selectedOption, "Programs")
                    }
                    isMulti
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        padding: "5px",
                        border: `1px solid ${
                          !errFields.Programs ? "#5BC4BF" : "red"
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
              <div className="w-full md:w-1/2 p-4">
                <FormField
                  label="Navigation Clients"
                  error={errFields.NavigationClients}
                >
                  <input
                    className="w-100 p-[0.725rem] rounded-[2px] border-[#5BC4BF] text-base"
                    style={{
                      border: `1px solid ${
                        !errFields.NavigationClients ? "#5BC4BF" : "red"
                      }`,

                      fontSize: "14px",
                    }}
                    name={"NavigationClients"}
                    placeholder="Navigation Clients"
                    value={formDetail.NavigationClients}
                    onChange={(e) =>
                      handleInputChange("NavigationClients", e.target.value)
                    }
                  />
                </FormField>
              </div>
            </div>

            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 p-4">
                <FormField
                  label="Permission Group"
                  error={errFields.PermissionGroup}
                >
                  <Select
                    name={"PermissionGroup"}
                    options={permissionsOptions}
                    placeholder="Permission Group"
                    value={formDetail.PermissionGroup}
                    onChange={(selectedOption) =>
                      handleMultiSelectChange(selectedOption, "PermissionGroup")
                    }
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        padding: "5px",

                        border: `1px solid ${
                          !errFields.PositionTitle ? "#5BC4BF" : "red"
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
                    isMulti
                  />
                </FormField>
              </div>
              <div className="w-full md:w-1/2 p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formDetail.Navigator}
                    onChange={handleCheckboxChange}
                    class="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ml-2 text-base text-gray-700">
                    Set as Navigator
                  </label>
                </div>
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
              {`${isEdit ? "Update" : "Save"}`}
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
