import React, { useCallback, useEffect, useMemo, useState } from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import InputElement from "../../components/dynamicform/FormElements/InputElement";
import ProfilePicture from "../../image/profile_picture.svg";
import TextAreaElement from "../../components/dynamicform/FormElements/TextAreaElement";
import DateInput from "../../components/common/DateInput";
import { protectedApi } from "../../services/api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { notifyError, notifySuccess } from "../../helper/toastNotication";
import { format } from "date-fns";
import BasicTable from "../../components/react-table/BasicTable";
import ThreeDotsIcon from "../../image/threedots.svg";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DropDown from "../../components/common/Dropdown";
import ApprovalSelection from "./ApprovalSelection/ApprovalSelection";
function FormWrapper({ children, label }) {
  return (
    <div className="rounded-[6px] bg-white">
      <div className="w-full px-3 py-2.5 border-b border-spacing-1 text-xl font-medium">
        {label}
      </div>
      <div className="px-4 py-3 grid grid-cols-11 gap-x-3">{children}</div>
    </div>
  );
}
function AddNewIntervention({
  label,
  button,
  className,
  onclick,
  disabled,
  children,
}) {
  return (
    <div className={`rounded-[5px] m-1 p-3 ${className}`}>
      <div className={`flex justify-between items-center`}>
        {label && <div className="text-xl font-medium">{label}</div>}
        <button
          className={`px-4 py-2 ${
            button === "Add new"
              ? "bg-[#5BC4BF] text-white"
              : "bg-[#FFCBCB] text-[#EC211F]"
          } text-sm rounded-[3px] disabled:cursor-not-allowed`}
          disabled={disabled}
          onClick={onclick}
        >
          {button}
        </button>
      </div>
      <hr className="my-3.5" />
      <div>{children}</div>
    </div>
  );
}

export function FormButtonWrapper({
  children,
  label,
  button,
  className,
  onclick,
  disabled,
  img,
}) {
  return (
    <div className={`rounded-[6px] bg-white shadow ${className}`}>
      <div className="w-full px-3 py-2.5 border-b border-spacing-1 text-xl font-medium flex justify-between">
        {label}
        {img ? (
          <img src={img} onClick={onclick} className="cursor-pointer" />
        ) : (
          ""
        )}
        {button ? (
          <button
            className="px-4 py-2 bg-[#5BC4BF] text-sm text-white rounded-[3px] disabled:cursor-not-allowed"
            disabled={disabled}
            onClick={onclick}
          >
            {button}
          </button>
        ) : (
          ""
        )}
      </div>
      <div className="px-4 py-3 grid grid-cols-12 gap-x-3 gap-y-2">
        {children}
      </div>
    </div>
  );
}

const TableMenu = ({
  index,
  onRemove,
  disabled,
  handleClickOpen,
  setInterventionUpdateIndex,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onEdit = () => {
    setInterventionUpdateIndex(index);
    handleClickOpen();
    handleClose();
  };

  return (
    <div>
      <Button
        id="basic-button"
        disabled={disabled}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <img
          src={ThreeDotsIcon}
          alt="Add Section"
          className={`mx-auto ${
            disabled ? "cursor-pointer" : "cursor-not-allowed"
          }`}
        />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={onEdit}>Edit</MenuItem>
        <MenuItem onClick={onRemove}>Remove</MenuItem>
      </Menu>
    </div>
  );
};

async function fetchClientDetails({ clientId }) {
  try {
    if (clientId === undefined) {
      notifyError("Client ID is required");
    }
    const respone = await protectedApi.get(
      `/encounter-note-client-details/?id=${clientId}`
    );

    if (respone.status === 200) {
      return respone.data;
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function fetchUsers() {
  try {
    const response = await protectedApi.get("/encounter-notes-users/");
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function fetchFacilities() {
  try {
    const response = await protectedApi.get("/api/resources/facilities");
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function fetchUserInfo() {
  try {
    const response = await protectedApi.get("/user-details/");
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function fetchProgramsInfo() {
  try {
    const response = await protectedApi.get("/api/resources/program");
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function fetchCarePlanOptions() {
  try {
    const response = await protectedApi.get(
      "/encounter-note-careplan-options/"
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function fetchCarePlanData({ carePlanId }) {
  try {
    const response = await protectedApi.get(`/client-care-plans/${carePlanId}`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
}

function AlertDialog({
  formData,
  setFormData,
  goalIndex,
  handleClose,
  interventionUpdateIndex,
  setInterventionUpdateIndex,
}) {
  const [interventionData, setInterventionData] = useState({});

  useEffect(() => {
    if (interventionUpdateIndex !== null) {
      setInterventionData(
        formData?.goals?.[goalIndex]?.interventions?.[interventionUpdateIndex]
      );
    }
  }, [interventionUpdateIndex]);

  const handleAddNewIntervention = useCallback(() => {
    setFormData((prevData) => {
      const goals = [...prevData.goals];
      goals[goalIndex].interventions.push(interventionData);
      return { ...prevData, goals };
    });
    handleClose();
    setInterventionData({});
  }, [interventionData]);

  const handleUpdateIntervention = useCallback(() => {
    setFormData((prevData) => {
      const goals = [...prevData.goals];
      goals[goalIndex].interventions[interventionUpdateIndex] =
        interventionData;
      return { ...prevData, goals };
    });

    setInterventionUpdateIndex(null);
    handleClose();
    setInterventionData({});
  }, [interventionData]);

  const handleInterventionDataChange = useCallback(
    (fieldName, value) =>
      setInterventionData((prevData) => ({ ...prevData, [fieldName]: value })),
    []
  );

  const handleReset = useCallback(() => {
    setInterventionData({});
    setInterventionUpdateIndex(null);
    handleClose();
  }, []);

  return (
    <>
      <div className="col-span-12">
        <TextAreaElement
          className="border-keppel"
          value={interventionData?.intervention || ""}
          onChange={(e) =>
            handleInterventionDataChange("intervention", e.target.value)
          }
          label="Interventions"
        />
      </div>
      <div className="col-span-6">
        <DateInput
          dateFormat="MM-dd-yyyy"
          className="m-1 h-[37.6px] border-keppel"
          height="37.6px"
          label={"Due Date"}
          value={
            interventionData?.due_date
              ? format(interventionData?.due_date, "MM-dd-yyyy")
              : ""
          }
          handleChange={(date) =>
            handleInterventionDataChange("due_date", date)
          }
        />
      </div>
      <div className="col-span-6">
        <DateInput
          dateFormat="MM-dd-yyyy"
          className="m-1 h-[37.6px] border-keppel"
          height="37.6px"
          label={"Completed Date"}
          value={
            interventionData?.completed_date
              ? format(interventionData?.completed_date, "MM-dd-yyyy")
              : ""
          }
          handleChange={(date) =>
            handleInterventionDataChange("completed_date", date)
          }
        />
      </div>
      <div className="col-span-12">
        <TextAreaElement
          className="border-keppel"
          value={interventionData?.notes || ""}
          onChange={(e) =>
            handleInterventionDataChange("notes", e.target.value)
          }
          label="Notes"
        />
      </div>
      <div className="flex items-center justify-center mt-4 gap-2">
        <button
          onClick={handleReset}
          className="border border-[#5BC4BF] w-[150px] font-normal text-base text-black rounded-[3px] p-2 mr-3"
        >
          Cancel
        </button>
        <button
          onClick={
            interventionUpdateIndex !== null
              ? handleUpdateIntervention
              : handleAddNewIntervention
          }
          className="bg-[#5BC4BF] text-white p-2 w-[150px] font-normal text-base rounded-[3px] "
        >
          {interventionUpdateIndex !== null ? "Update" : "Add"}
        </button>
      </div>
    </>
  );
}

const TheNewCarePlan = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const carePlanId = queryParams.get("carePlanId");
  const mode = queryParams.get("mode");

  const { clientId } = useParams();
  const [programPresent, setProgramPresent] = useState(false);
  const [clientDetails, setClientDetails] = useState({});
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [goalIndex, setGoalIndex] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const [userOptions, setUserOptions] = useState([]);
  const [faclityOptions, setFacilityOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [carePlanTemplateOptions, setCarePlanTemplateOptions] = useState([
    { label: "Care Plan Template 1", value: "Care Plan Template 1" },
    { label: "Care Plan Template 2", value: "Care Plan Template 2" },
    { label: "Care Plan Template 3", value: "Care Plan Template 3" },
    { label: "Care Plan Template 4", value: "Care Plan Template 4" },
  ]);
  const [openApprovalSelection, setApprovalSelection] = useState(false);
  const [interventionUpdateIndex, setInterventionUpdateIndex] = useState(null);
  const [previousApprover, setPreviousApprover] = useState(null);

  const goalPriorityOptions = useMemo(
    () => [
      { label: "High", value: "High" },
      { label: "Medium", value: "Medium" },
      { label: "Low", value: "Low" },
    ],
    []
  );

  const stageOfReadinessOptions = useMemo(
    () => [
      {
        label: "Precontemplation",
        value: "Precontemplation",
      },
      { label: "Contemplation", value: "Contemplation" },
      { label: "Preparation", value: "Preparation" },
      { label: "Action", value: "Action" },
      { label: "Maintenance", value: "Maintenance" },
    ],
    []
  );

  const goalStatusOptions = useMemo(
    () => [
      { label: "Not Started", value: "Not Started" },
      { label: "In Progress", value: "In Progress" },
      { label: "Completed (Closed)", value: "Completed (Closed)" },
      { label: "Not Completed (Closed)", value: "Not Completed (Closed)" },
    ],
    []
  );

  const [formData, setFormData] = useState({
    client_id: Number(clientId),
    system_id: "12345",
    goals: [{ interventions: [] }],
  });

  const disableSubmit = useMemo(() => {
    return (
      mode === "view" ||
      !formData.user_name ||
      !formData.facility ||
      !formData.program ||
      !formData?.care_plan_template ||
      !formData.created_date
    );
  }, [formData]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    if (mode && carePlanId) {
      fetchCarePlanData({ carePlanId: carePlanId })
        .then((carePlanDataResponse) => {
          const convertedGoals = carePlanDataResponse?.goals?.map((goal) => ({
            ...goal,
            interventions_deleted: [],
          }));
          setFormData({ ...carePlanDataResponse, goals: convertedGoals });
          setPreviousApprover(carePlanDataResponse?.approver_name);
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
    fetchCarePlans();
  }, []);

  useEffect(() => {
    fetchUserInfo()
      .then((userInfoResponse) => {
        console.log(userInfoResponse);
        setUserInfo(userInfoResponse);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  useEffect(() => {
    if (!mode) {
      setFormData((prevData) => ({
        ...prevData,
        user_name: userInfo?.user_id,
        id_user: userInfo?.user_id,
      }));
    }
  }, [userOptions, userInfo]);

  useEffect(() => {
    if (userOptions?.length && typeof formData?.approver_name === "number") {
      const user = userOptions.find(
        (user) => user.value === formData?.approver_name
      );
      if (user) {
        setFormData((prevData) => ({
          ...prevData,
          approver_name: {
            name: user?.label,
            id: user?.value,
          },
        }));
      }
    }
  }, [userOptions, formData]);

  const fetchCarePlans = async () => {
    try {
      const response = await protectedApi.get(
        `/client-careplan-list/${clientId}`
      );
      const { data } = response;
      setProgramPresent(data.length > 0 ? true : false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormDataChange = useCallback(
    (fieldName, value) => {
      setFormData((prevData) => ({ ...prevData, [fieldName]: value }));
    },
    [formData]
  );

  const handleAddNewGoal = useCallback(() => {
    setFormData((prevData) => ({
      ...prevData,
      goals: [...prevData.goals, { interventions: [] }],
    }));
  }, []);

  const createPayloadData = useCallback(() => {
    let invalidFields = [];

    if (!formData?.user_name) {
      invalidFields.push("User Name");
    }

    if (!formData?.facility) {
      invalidFields.push("Facility");
    }

    if (!formData?.program) {
      invalidFields.push("Program");
    }

    if (!formData?.care_plan_template) {
      invalidFields.push("Care Plan Template");
    }

    if (!formData?.created_date) {
      invalidFields.push("Created Date");
    }

    if (invalidFields.length) {
      let toastMessage = "";
      for (let i = 0; i < invalidFields.length; i++) {
        if (i == invalidFields.length - 1) {
          toastMessage =
            toastMessage +
            `${invalidFields.length === 1 ? "" : "and "}${invalidFields[i]} ${
              invalidFields.length === 1 ? "is" : "are"
            } required`;
        } else {
          toastMessage = toastMessage + `${invalidFields[i]}, `;
        }
      }
      notifyError(toastMessage);
      return false;
    }

    if (formData?.approver_name?.id) {
      formData.approver_name = formData.approver_name.id;
    }

    {
      /* This section is commented temporarily. DON'T REMOVE!!!! */
    }
    const updatedFormData = {
      ...formData,
      // approver_name: formData?.approver_name?.id,
      request_approval: false,
      // approval_status: formData?.approver_name?.approval_status
      //   ? "Pending"
      //   : "Pending",
      program_present: programPresent,
    };

    // if (!formData?.approver_name) {
    //   delete updatedFormData?.approver_name;
    //   delete updatedFormData?.approval_status;
    //   delete updatedFormData?.request_approval;
    // }
    return updatedFormData;
  }, [formData]);

  const handleCreateNewCarePlan = useCallback(async () => {
    try {
      const updatedFormData = createPayloadData();

      if (updatedFormData instanceof Boolean) {
        return;
      }

      const response = await protectedApi.post(
        "/api/careplan/",
        updatedFormData
      );

      if (response.status === 201) {
        notifySuccess("Care Plan created successfully");
        navigate(`/clientchart/${clientId}`);
      }
    } catch (err) {
      console.error("Error creating care plan", err);
    }
  }, [formData]);

  const handleUpdateCarePlan = useCallback(async () => {
    try {
      const updatedFormData = createPayloadData();

      if (updatedFormData instanceof Boolean) {
        return;
      }

      updatedFormData.approval_updated =
        updatedFormData?.approver_name === previousApprover ? false : true;

      // delete updatedFormData?.care_plan_history;
      // delete updatedFormData?.user_name;
      // delete updatedFormData?.facility;
      // delete updatedFormData?.program;
      // delete updatedFormData?.care_plan_template;
      // delete updatedFormData?.created_date;

      console.log(updatedFormData);

      const response = await protectedApi.put(
        `/care-plan_update/${carePlanId}/`,
        updatedFormData
      );

      if (response.status === 200) {
        notifySuccess("Care Plan updated successfully");
        navigate(`/clientchart/${clientId}`);
      }
    } catch (err) {
      console.error(err);
    }
  }, [formData, previousApprover, carePlanId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInterventionToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    fetchClientDetails({ clientId })
      .then((clientDetailsResponse) => {
        setClientDetails(clientDetailsResponse);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  useEffect(() => {
    fetchUsers()
      .then((fetchUsersResponse) => {
        const convertedUserOptions = fetchUsersResponse.map((user) => ({
          label: user.username,
          value: user.id,
        }));
        setUserOptions(convertedUserOptions);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  useEffect(() => {
    fetchFacilities()
      .then((fetchFaclitiesResponse) => {
        const convertedUserOptions = fetchFaclitiesResponse.map((facility) => ({
          label: facility.name,
          value: facility.id,
        }));
        setFacilityOptions(convertedUserOptions);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  useEffect(() => {
    fetchProgramsInfo()
      .then((fetchProgramsResponse) => {
        const convertedProgramOptions = fetchProgramsResponse.map(
          (program) => ({
            label: program.name,
            value: program.id,
          })
        );
        setProgramOptions(convertedProgramOptions);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  useEffect(() => {
    fetchCarePlanOptions()
      .then((fetchCarePlansResponse) => {
        const convertedCarePlanOptions = fetchCarePlansResponse.map(
          (carePlan) => ({
            label: carePlan.care_plan_name,
            value: carePlan.id,
          })
        );
        // setCarePlanTemplateOptions(convertedCarePlanOptions);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  const handleGoalDataUpdate = useCallback((index, fieldName, value) => {
    setFormData((prevData) => {
      const goals = [...prevData.goals];
      goals[index][fieldName] = value;
      return { ...prevData, goals };
    });
  }, []);

  const handleRemoveIntervention = useCallback(
    (goalIndex, interventionIndex) => {
      setFormData((prevData) => {
        const updatedInterventions = formData?.goals?.[
          goalIndex
        ]?.interventions?.filter((_, index) => index !== interventionIndex);
        let interventionsDeleted = [];
        const interventionObj =
          formData?.goals?.[goalIndex]?.interventions?.[interventionIndex];
        if (formData?.goals?.[goalIndex]?.interventions_deleted) {
          interventionsDeleted = [
            ...formData?.goals?.[goalIndex]?.interventions_deleted,
          ];
        }
        if (interventionObj?.id) {
          interventionsDeleted.push(
            formData?.goals?.[goalIndex]?.interventions?.[interventionIndex]?.id
          );
        }
        const updatedGoals = [...prevData.goals];
        updatedGoals[goalIndex].interventions = updatedInterventions;
        updatedGoals[goalIndex].interventions_deleted = interventionsDeleted;

        const updatedFormData = { ...prevData, goals: updatedGoals };

        return updatedFormData;
      });
    },
    [formData]
  );

  const carePlanStatusColumns = useMemo(
    () => [
      {
        Header: "User",
        accessor: "user_name",
        align: "left",
      },
      {
        Header: "Action",
        accessor: "action",
        align: "left",
      },
      {
        Header: "Date",
        accessor: "date",
        align: "left",
        Cell: ({ value }) =>
          value ? format(new Date(value), "MM-dd-yyyy") : "",
      },
      {
        Header: "Time",
        accessor: "time",
        align: "left",
      },
    ],
    []
  );

  const intervention_columns = useMemo(
    () => [
      { Header: "#", Cell: ({ row }) => row.index + 1 },
      { Header: "Intervention", accessor: "intervention" },
      {
        Header: "Completed Date",
        accessor: "completed_date",
        Cell: ({ value }) =>
          value ? format(new Date(value), "MM-dd-yyyy") : "",
      },
      {
        Header: "Due Date",
        accessor: "due_date",
        Cell: ({ value }) =>
          value ? format(new Date(value), "MM-dd-yyyy") : "",
      },
      { Header: "Notes", accessor: "notes" },
      {
        Header: "Add section",
        accessor: "addSection",
        Cell: ({ row }) => (
          <TableMenu
            index={row.index}
            handleClickOpen={handleInterventionToggle}
            disabled={mode === "view" || mode === "approve"}
            setInterventionUpdateIndex={setInterventionUpdateIndex}
            onRemove={() => {
              handleRemoveIntervention(goalIndex, row.index);
            }}
          />
        ),
      },
    ],
    [formData]
  );

  return (
    <div className="mx-1" style={{ fontFamily: "poppins" }}>
      <PageTitle
        title="Care Plan"
        clientId={clientId}
        editUrl={
          mode === "view"
            ? `/care-plan/add/${clientId}?carePlanId=${carePlanId}&mode=edit`
            : null
        }
        onClick={() => navigate(`/clientchart/${clientId}`)}
      />
      <div className="rounded-[5px] my-6">
        <div className="grid gap-y-8">
          <FormWrapper label="Client care plan details">
            <div className="col-span-3">
              <InputElement
                type="text"
                value={
                  (clientDetails?.first_name || "") +
                  " " +
                  (clientDetails?.last_name || "")
                }
                disabled
                className="rounded-[3px]"
                placeholder="Enter Client Name"
                label={"Client Name"}
              />
            </div>
            <div className="col-span-3">
              <InputElement
                type="text"
                value={clientDetails?.preferred_pronouns || ""}
                disabled
                className="rounded-[3px]"
                placeholder="Enter Preferred pronouns"
                label={"Preferred pronouns"}
              />
            </div>
            <div className="col-span-3">
              <DateInput
                value={
                  clientDetails?.date_of_birth
                    ? format(clientDetails?.date_of_birth, "MM-dd-yyyy")
                    : ""
                }
                dateFormat="MM-dd-yyyy"
                className=" h-[37.6px] rounded-[3px]"
                isEdittable
                height="37.6px"
                label="Date of birth"
              />
            </div>
            <div className="col-span-2 row-span-4 ml-8 flex justify-center items-center">
              <img
                src={ProfilePicture}
                className="w-full"
                alt="profile_picture"
              />
            </div>
            <div className="col-span-3">
              <InputElement
                type="text"
                value={clientDetails?.system_id || "12345"}
                disabled
                className="rounded-[3px]"
                placeholder="Enter System Id"
                label={"System Id"}
              />
            </div>
            <div className="col-span-3">
              <InputElement
                type="text"
                value={clientDetails?.primary_phone || ""}
                disabled
                className="rounded-[3px]"
                placeholder="Enter Primary phone"
                label={"Primary phone"}
              />
            </div>
            <div className="col-span-3">
              <InputElement
                type="text"
                value={clientDetails?.email_address || ""}
                disabled
                className="rounded-[3px]"
                placeholder="Enter Email"
                label={"Email"}
              />
            </div>
            <div className="col-span-3">
              <DropDown
                // placeholder="54321a"
                className="rounded-[3px]"
                height="39px"
                fontSize="14px"
                label={"User Name"}
                required={true}
                isEdittable={mode}
                selectedOption={
                  userOptions.find((user) => formData?.user_name === user.value)
                    ?.label || ""
                }
                options={userOptions}
                handleChange={(option) =>
                  handleFormDataChange("user_name", option.value)
                }
              />
            </div>
            <div className="col-span-3">
              <DropDown
                // placeholder="Facility"
                className="rounded-[3px]"
                height="39px"
                fontSize="14px"
                label={"Facility"}
                required={true}
                isEdittable={mode}
                selectedOption={
                  faclityOptions.find(
                    (facility) => formData?.facility === facility.value
                  )?.label || ""
                }
                options={faclityOptions}
                handleChange={(option) =>
                  handleFormDataChange("facility", option.value)
                }
              />
            </div>
            <div className="col-span-3">
              <DropDown
                height="37.6px"
                fontSize="14px"
                // placeholder="Program"
                className="rounded-[3px]"
                label={"Program"}
                required={true}
                isEdittable={mode}
                selectedOption={
                  programOptions.find(
                    (program) => formData?.program === program.value
                  )?.label || ""
                }
                options={programOptions}
                handleChange={(option) =>
                  handleFormDataChange("program", option.value)
                }
              />
            </div>
            <div className="col-span-6">
              <DropDown
                height="37.6px"
                fontSize="14px"
                // placeholder="Care Plan Template"
                className="rounded-[3px]"
                label={"Care Plan Template"}
                isEdittable={mode}
                required={true}
                selectedOption={
                  carePlanTemplateOptions.find(
                    (care_plan) =>
                      formData?.care_plan_template === care_plan.value
                  )?.label || ""
                }
                options={carePlanTemplateOptions}
                handleChange={(option) =>
                  handleFormDataChange("care_plan_template", option.value)
                }
              />
            </div>
            <div className="col-span-3">
              <DateInput
                dateFormat="MM-dd-yyyy"
                className=" h-[37.6px] rounded-[3px]"
                height="37.6px"
                label="Created Date"
                required={true}
                isEdittable={mode}
                value={
                  formData?.created_date
                    ? format(formData?.created_date, "MM-dd-yyyy")
                    : ""
                }
                handleChange={(date) =>
                  handleFormDataChange("created_date", date)
                }
              />
            </div>
          </FormWrapper>
        </div>
      </div>
      <div className="rounded-[5px] my-6 bg-white">
        <div className="flex gap-3 p-4 flex-wrap">
          {formData?.goals?.map((_, index) => (
            <button
              className={`p-2 w-[200px] font-normal text-base rounded-sm ${
                index === goalIndex
                  ? "bg-[#5BC4BF] text-white"
                  : "bg-white border border-[#5BC4BF]"
              }`}
              onClick={() => setGoalIndex(index)}
            >
              GOAL {index + 1}
            </button>
          ))}
          {mode && (
            <button
              className={` w-[200px] font-normal text-base rounded-sm ${
                goalIndex === null
                  ? "bg-[#5BC4BF] text-white"
                  : "bg-white border border-[#5BC4BF]"
              }`}
              onClick={() => setGoalIndex(null)}
            >
              CARE PLAN STATUS
            </button>
          )}
        </div>
        {goalIndex !== null ? (
          <>
            <div className="grid m-6">
              <FormButtonWrapper
                label={`Goal ${goalIndex + 1}`}
                button={"Add new"}
                disabled={mode === "view" || mode === "approve"}
                onclick={handleAddNewGoal}
              >
                <div className="col-span-6">
                  <DateInput
                    dateFormat="MM-dd-yyyy"
                    className="m-1 h-[37.6px] border-keppel rounded-[3px]"
                    height="37.6px"
                    label={"Start Date"}
                    isEdittable={mode === "view" || mode === "approve"}
                    value={
                      formData?.goals?.[goalIndex]?.start_date
                        ? format(
                            formData?.goals?.[goalIndex]?.start_date,
                            "MM-dd-yyyy"
                          )
                        : ""
                    }
                    handleChange={(value) => {
                      handleGoalDataUpdate(goalIndex, "start_date", value);
                    }}
                    // placeholder="DOB"
                  />
                </div>
                <div className="col-span-6 flex items-end">
                  <InputElement
                    type="text"
                    value={formData?.goals?.[goalIndex]?.problem || ""}
                    width={"w-full"}
                    className="border-keppel rounded-[3px] my-1"
                    placeholder="Problem"
                    disabled={mode === "view" || mode === "approve"}
                    onChange={(e) =>
                      handleGoalDataUpdate(goalIndex, "problem", e.target.value)
                    }
                  />
                </div>
                <div className="col-span-12">
                  <TextAreaElement
                    className="h-32 border-keppel rounded-[3px]"
                    disabled={mode === "view" || mode === "approve"}
                    value={
                      formData?.goals?.[goalIndex]?.smart_goal_summary || ""
                    }
                    onChange={(e) =>
                      handleGoalDataUpdate(
                        goalIndex,
                        "smart_goal_summary",
                        e.target.value
                      )
                    }
                    placeholder="SMART Goal Summary"
                  />
                </div>
                <div className="col-span-6 m-1">
                  <DropDown
                    height="37.6px"
                    fontSize="14px"
                    placeholder="Goal Priority"
                    isEdittable={mode === "view" || mode === "approve"}
                    className="border border-[#5BC4BF] border-keppel text-[#858585] rounded-[7px]"
                    selectedOption={
                      formData?.goals?.[goalIndex]?.goal_priority || ""
                    }
                    options={goalPriorityOptions}
                    handleChange={(option) =>
                      handleGoalDataUpdate(
                        goalIndex,
                        "goal_priority",
                        option.value
                      )
                    }
                  />
                </div>
                <div className="col-span-6 m-1">
                  <DropDown
                    height="37.6px"
                    fontSize="14px"
                    placeholder="Stage of Readiness"
                    isEdittable={mode === "view" || mode === "approve"}
                    className="border border-[#5BC4BF] border-keppel text-[#858585] rounded-[7px]"
                    selectedOption={
                      formData?.goals?.[goalIndex]?.stage_of_readiness || ""
                    }
                    options={stageOfReadinessOptions}
                    handleChange={(option) =>
                      handleGoalDataUpdate(
                        goalIndex,
                        "stage_of_readiness",
                        option.value
                      )
                    }
                  />
                </div>
                <div className="col-span-12">
                  <TextAreaElement
                    className="h-32 border-keppel rounded-[3px]"
                    value={formData?.goals?.[goalIndex]?.client_strengths || ""}
                    disabled={mode === "view" || mode === "approve"}
                    onChange={(e) =>
                      handleGoalDataUpdate(
                        goalIndex,
                        "client_strengths",
                        e.target.value
                      )
                    }
                    placeholder="Client Strengths"
                  />
                </div>
                <div className="col-span-12">
                  <TextAreaElement
                    className="h-32 border-keppel rounded-[3px]"
                    value={
                      formData?.goals?.[goalIndex]?.potential_barriers || ""
                    }
                    disabled={mode === "view" || mode === "approve"}
                    onChange={(e) =>
                      handleGoalDataUpdate(
                        goalIndex,
                        "potential_barriers",
                        e.target.value
                      )
                    }
                    placeholder="Potential Barriers"
                  />
                </div>
                <div className="col-span-12">
                  <AddNewIntervention
                    className="border border-keppel rounded-[3px]"
                    label="Interventions"
                    disabled={mode === "view" || mode === "approve"}
                    button={open ? "Cancel" : "Add new"}
                    onclick={handleInterventionToggle}
                  >
                    {open ? (
                      <AlertDialog
                        formData={formData}
                        setFormData={setFormData}
                        goalIndex={goalIndex}
                        handleClose={handleInterventionToggle}
                        interventionUpdateIndex={interventionUpdateIndex}
                        setInterventionUpdateIndex={setInterventionUpdateIndex}
                      />
                    ) : (
                      <BasicTable
                        type={"intervention"}
                        columns={intervention_columns}
                        data={formData?.goals?.[goalIndex]?.interventions || []}
                      />
                    )}
                  </AddNewIntervention>
                </div>
              </FormButtonWrapper>
            </div>
            <div className="grid m-6">
              <FormButtonWrapper label={`Goal ${goalIndex + 1} Outcome`}>
                <div className="col-span-6 mx-1">
                  <DropDown
                    height="37.6px"
                    fontSize="14px"
                    placeholder="Status"
                    isEdittable={mode === "view" || mode === "approve"}
                    className="border border-[#5BC4BF] border-keppel text-[#858585] mt-[3px] rounded-[7px]"
                    selectedOption={
                      formData?.goals?.[goalIndex]?.goal_status || ""
                    }
                    options={goalStatusOptions}
                    handleChange={(option) =>
                      handleGoalDataUpdate(
                        goalIndex,
                        "goal_status",
                        option.value
                      )
                    }
                  />
                </div>
                <div className="col-span-6 mx-1">
                  <DateInput
                    placeholder="Date"
                    dateFormat="MM-dd-yyyy"
                    className="m-1  h-[37.6px] border-keppel rounded-[3px]"
                    height="37.6px"
                    isEdittable={mode === "view" || mode === "approve"}
                    value={
                      formData?.goals?.[goalIndex]?.goal_date
                        ? format(
                            formData?.goals?.[goalIndex]?.goal_date,
                            "MM-dd-yyyy"
                          )
                        : ""
                    }
                    handleChange={(date) =>
                      handleGoalDataUpdate(goalIndex, "goal_date", date)
                    }
                  />
                </div>
                <div className="col-span-12">
                  <TextAreaElement
                    className="h-32 border-keppel rounded-[3px]"
                    value={""}
                    disabled={mode === "view" || mode === "approve"}
                    onChange={() => {}}
                    placeholder="Custom Sections / Fields"
                  />
                </div>
                <div className="col-span-12">
                  <TextAreaElement
                    className="h-32 border-keppel rounded-[3px]"
                    value={formData?.goals?.[goalIndex]?.comments || ""}
                    disabled={mode === "view" || mode === "approve"}
                    onChange={(e) =>
                      handleGoalDataUpdate(
                        goalIndex,
                        "comments",
                        e.target.value
                      )
                    }
                    placeholder="Comments"
                  />
                </div>
              </FormButtonWrapper>

              {/* This section is commented temporarily. DON'T REMOVE!!!! */}

              {/* <div className="flex items-center space-x-2 pt-9 pb-6">
                <input
                  type="checkbox"
                  id="approval"
                  className="w-4 h-4"
                  checked={formData?.approval_status}
                  disabled={
                    mode === "view" ||
                    mode === "approve" ||
                    (mode === "edit" && typeof previousApprover === "number")
                  }
                  onChange={(e) => {
                    setApprovalSelection(e.target.checked);
                    handleFormDataChange("approval_status", e.target.checked);
                    if (!e.target.checked) {
                      handleFormDataChange("approver_name", null);
                    }
                  }}
                />
                <label htmlFor="approval" className="text-lg">
                  Is approval Needed?
                </label>
              </div> */}
              {/* {formData?.approver_name && (
                <div
                  className={`w-full flex justify-between items-center border rounded-[6px]`}
                >
                  <div className="px-3 text-[#8C8C8C]">
                    {formData?.approver_name?.name}
                  </div>
                  <button
                    disabled={
                      mode === "view" ||
                      mode === "approve" ||
                      (mode === "edit" && typeof previousApprover === "number")
                    }
                    onClick={() => {
                      handleFormDataChange("approver_name", null);
                      setApprovalSelection(false);
                      handleFormDataChange("approval_status", false);
                    }}
                    className="bg-[#5BC4BF] text-white px-3 py-2 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                </div>
              )} */}
              <div className="text-center my-3">
                {mode === "approve" ? (
                  formData?.approver_name?.id &&
                  userInfo?.user_id === formData?.approver_name?.id && (
                    <>
                      <button
                        // onClick={}
                        className="border border-[#5BC4BF] w-[150px] font-normal text-base rounded-sm p-2 mr-3"
                      >
                        Reject
                      </button>
                      <button
                        // onClick={}
                        className="bg-[#5BC4BF] text-white p-2 w-[150px] font-normal text-base rounded-sm disabled:cursor-not-allowed"
                      >
                        Approve
                      </button>
                    </>
                  )
                ) : (
                  <>
                    <button
                      onClick={() => navigate(`/clientchart/${clientId}`)}
                      className="border border-[#5BC4BF] w-[150px] font-normal text-base rounded-sm p-2 mr-3"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={mode === "view"}
                      onClick={
                        !mode ? handleCreateNewCarePlan : handleUpdateCarePlan
                      }
                      className="bg-[#5BC4BF] text-white p-2 w-[150px] font-normal text-base rounded-sm disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                  </>
                )}
              </div>
              <ApprovalSelection
                userOptions={userOptions}
                open={openApprovalSelection}
                handleClose={() => {
                  setApprovalSelection(false);
                }}
                handleDiscard={() => {
                  handleFormDataChange("approver_name", null);
                  setApprovalSelection(false);
                  handleFormDataChange("approval_status", false);
                }}
                handleFormData={handleFormDataChange}
              />
            </div>
          </>
        ) : (
          <div className="m-6 pb-10">
            <FormButtonWrapper label="Care plan status" button={"View history"}>
              <div className="col-span-12">
                <BasicTable
                  type={"carePlanStatus"}
                  columns={carePlanStatusColumns}
                  data={formData?.care_plan_history}
                />
              </div>
              {/* <div className="col-span-12 m-auto">
                  <button className="border border-[#5BC4BF] w-[150px] font-normal text-base rounded-sm p-2 mr-3">
                    Cancel
                  </button>
                  <button className="bg-[#5BC4BF] text-white p-2 w-[150px] font-normal text-base rounded-sm ">
                    Save/edit
                  </button>
                </div> */}
            </FormButtonWrapper>
          </div>
        )}
      </div>
    </div>
  );
};

export default TheNewCarePlan;
