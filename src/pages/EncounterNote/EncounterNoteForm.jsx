import React, { useCallback, useEffect, useMemo, useState } from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import InputElement from "../../components/dynamicform/FormElements/InputElement";
import DateInput from "../../components/common/DateInput";
import SelectElement from "../../components/dynamicform/FormElements/SelectElement";
import TimeInput from "../../components/common/TimeInput";
import TextAreaElement from "../../components/dynamicform/FormElements/TextAreaElement";
import MultiSelectElement from "../../components/dynamicform/FormElements/MultiSelectElement";
import FileInput from "../../components/dynamicform/FormElements/FileInput";
import SignInput from "../../components/dynamicform/FormElements/SignInput";
import { protectedApi } from "../../services/api";
import { notifyError, notifySuccess } from "../../helper/toastNotication";
import DropDown from "../../components/common/Dropdown";
import BasicTable from "../../components/react-table/BasicTable";
import DnDCustomFields from "../../components/DnDCustomFields";
import axios, { all } from "axios";
import CollapseOpenSvg from "../../components/images/collpase-open.svg";
import CollapseCloseSvg from "../../components/images/collapse-close.svg";
import apiURL from "../../apiConfig";
import { format } from "date-fns";
import "./EncounterNoteFormStyles.css";
import CustomFieldEncounter from "../../components/dynamicform/CustomFieldEncounter";
import CustomFieldsForEncounter from "../../components/ClientProfileForm/CustomFieldsForEncounter";

import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  FormControlLabel,
} from "@mui/material";
import PrivateComponent from "../../components/PrivateComponent";

function FormWrapper({
  isTemplate,
  children,
  label,
  isCollapsable,
  gridClass = "grid-cols-12",
  initialState = true,
}) {
  const [show, setShow] = useState(initialState);

  useEffect(() => {
    if (!show) {
      setShow(initialState);
    }
  }, [initialState]);

  return (
    <div className="rounded-[6px] border border-keppel">
      <div
        onClick={() => {
          isCollapsable && setShow((prev) => !prev);
        }}
        className="w-full px-3 py-2.5 border-b border-keppel text-xl font-medium flex justify-between items-center gap-2 cursor-pointer"
      >
        <span>{label}</span>
        {isCollapsable && (
          <img
            src={show ? CollapseCloseSvg : CollapseOpenSvg}
            alt="collapse-icon"
          />
        )}
      </div>
      {show && (
        <div className={`px-4 py-3 grid ${gridClass} gap-x-3 gap-y-3`}>
          {children}
        </div>
      )}
    </div>
  );
}

function convertToTimeString(date) {
  return (
    date?.getHours() +
    ":" +
    date?.getMinutes() +
    ":" +
    (date?.getSeconds() < 9 ? date?.getSeconds() : "0" + date?.getSeconds())
  );
}

async function fetchClientDetails({ clientId, isTemplate }) {
  if (isTemplate) {
    return;
  }
  try {
    if (clientId === undefined) {
      notifyError("Client ID is required");
      return;
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

async function fetchFormOptions() {
  try {
    // const response = await protectedApi.get("/encounter-note-form-options/");
    const response = await protectedApi.get("/get_matching_tables/");
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

async function fetchClientOptions() {
  try {
    const response = await protectedApi.get("/get_matching_tables/  ");
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

async function fetchCarePlanOptions() {
  try {
    const response = await protectedApi.get(
      "/encounter-note-careplan-options/"
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

async function fetchFacilityOptions() {
  try {
    const response = await protectedApi.get("/api/resources/facilities");
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

async function fetchProgramOptions() {
  try {
    const response = await protectedApi.get("/api/resources/program");
    return response.data;
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

async function fetchUserInfo({ isTemplate }) {
  try {
    if (isTemplate) return;
    const response = await protectedApi.get("/user-details/");
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function fetchTemplateOptions() {
  try {
    const response = await protectedApi.get("/encounter-summary/");
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

function convertTimeToISOString(data, timeString) {
  // Get the current date in 'YYYY-MM-DD' format
  var timeParts = timeString.split(":");
  var hours = parseInt(timeParts?.[0], 10);
  var minutes = parseInt(timeParts?.[1], 10);
  var seconds = parseInt(timeParts?.[2], 10);

  // Create a new Date object and set the time
  var convertedDate = new Date();
  convertedDate.setHours(hours);
  convertedDate.setMinutes(minutes);
  convertedDate.setSeconds(seconds);
  // Convert to ISO string
  return convertedDate;
}

function BillingStatus({
  mode,
  handleFormDataChange,
  formData,
  userInfo,
  isTemplate,
}) {
  const [billingStatus, setBillingStatus] = useState({});

  const handleAddBillingStatus = useCallback(() => {
    if (!userInfo?.user_id) {
      notifyError("Can't find logged in user information");
      return;
    }
    const data = {
      status: billingStatus?.status,
      user_name: { ...userInfo },
      date_time: new Date().getTime(),
    };
    handleFormDataChange("billing_status", [...formData?.billing_status, data]);
    setBillingStatus({});
  }, [billingStatus, formData]);

  const columnDefinition = useMemo(() => {
    return [
      {
        Header: "Billing Status",
        accessor: "status",
        align: "left",
      },
      {
        Header: "User name",
        accessor: "user_name",
        align: "left",
        Cell: ({ value }) => value?.user_name || value || "NaN",
      },
      {
        Header: "Date & Time",
        accessor: "date_time",
        align: "left",
        Cell: ({ value }) =>
          value ? format(new Date(Number(value)), "MM-dd-yyyy hh:mm a") : "NaN",
      },
    ];
  }, []);

  return (
    <>
      <div className="col-span-11">
        <DropDown
          name="status"
          placeholder="Billing Status"
          handleChange={(data) =>
            setBillingStatus((prev) => ({
              ...prev,
              status: data.value,
            }))
          }
          isEdittable={mode !== "edit" || isTemplate}
          className="border-keppel m-1 h-[37.6px]"
          height="37.6px"
          fontSize="14px"
          borderColor="#5bc4bf"
          options={[
            {
              label: "ECM Enabling Service",
              value: "ECM Enabling Service",
            },
            { label: "Submitted via AMD*", value: "Submitted via AMD*" },
            {
              label: "Submitted via invoice",
              value: "Submitted via invoice",
            },
            { label: "Missing Insurance", value: "Missing Insurance" },
            {
              label: "Missing/Insufficient Notes",
              value: "Missing/Insufficient Notes",
            },
          ]}
          selectedOption={billingStatus?.status || ""}
        />
      </div>
      <div className="col-span-1 m-1">
        <button
          onClick={handleAddBillingStatus}
          disabled={!billingStatus?.status || isTemplate}
          className="w-full h-100 bg-[#5BC4BF] rounded-md text-white font-semibold text-lg disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>

      <div className="col-span-12 mx-1">
        {!isTemplate && (
          <BasicTable
            type={"billing"}
            noMargin
            defaultPageSize={5}
            columns={[]}
            data={formData?.billing_status || []}
          />
        )}
      </div>
    </>
  );
}

function BillingComments({
  mode,
  handleFormDataChange,
  formData,
  userInfo,
  isTemplate,
}) {
  const [billingComments, setBillingComments] = useState({});

  const handleAddBillingComment = useCallback(() => {
    if (!userInfo?.user_id) {
      notifyError("Can't find logged in user information");
      return;
    }
    const data = {
      comment: billingComments?.comment,
      user_name: { ...userInfo },
      date_time: new Date().getTime(),
    };
    handleFormDataChange("billing_comments", [
      ...formData?.billing_comments,
      data,
    ]);
    setBillingComments({});
  }, [billingComments, formData]);

  const columnDefinition = useMemo(() => {
    return [
      {
        Header: "Billing status Comments",
        accessor: "comment",
        align: "left",
      },
      {
        Header: "User name",
        accessor: "user_name",
        align: "left",
        Cell: ({ value }) => value?.user_name || value || "NaN",
      },
      {
        Header: "Date & Time",
        accessor: "date_time",
        align: "left",
        Cell: ({ value }) =>
          value ? format(new Date(Number(value)), "MM-dd-yyyy hh:mm a") : "NaN",
      },
    ];
  }, []);

  return (
    <>
      <div className="col-span-11">
        <InputElement
          type="text"
          name="comment"
          disabled={mode !== "edit" || isTemplate}
          placeholder="Billing Status Comment"
          value={billingComments?.comment || ""}
          onChange={(e) =>
            setBillingComments((prev) => ({
              ...prev,
              comment: e.target.value,
            }))
          }
          isEdittable={mode !== "edit"}
          className="border-keppel my-1"
        />
      </div>
      <div className="col-span-1 m-1">
        <button
          onClick={handleAddBillingComment}
          disabled={!billingComments?.comment || isTemplate}
          className="w-full h-100 bg-[#5BC4BF] rounded-md text-white font-semibold text-lg disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>

      <div className="col-span-12 mx-1">
        {!isTemplate && (
          <BasicTable
            type={"billing"}
            noMargin
            defaultPageSize={5}
            columns={columnDefinition}
            data={formData?.billing_comments || []}
          />
        )}
      </div>
    </>
  );
}

function EncounterSummaryPopup({
  selectedTemplate,
  setSelectedTemplate,
  selectedTemplates,
  setSelectedTemplates,
  formData,
  setFormData,
}) {
  const [questionsBackup, setQuestionsBackup] = useState([]);
  const [questions, setQuestions] = useState([]);

  const selectedQuestions = useMemo(() => {
    let encounterSummary = {};
    encounterSummary = {};
    if (formData.encounter_summary !== undefined) {
      formData.encounter_summary.split("\n").forEach((line) => {
        const [key, value] = line.split(":");
        if (key !== undefined && typeof key === "string" && key.trim() !== "") {
          encounterSummary[key.trim()] = (value || "").trim() + "\n";
        }
      });
    }
    // }
    return encounterSummary;
  }, [formData]);

  useEffect(() => {
    setQuestionsBackup(
      selectedTemplate?.questions?.filter(
        (q) => selectedQuestions[q] !== undefined
      ) || []
    );
  }, []);

  const handleUpdateQuestions = useCallback(
    ({ addedQuestions, removedQuestions }) => {
      setFormData((prev) => {
        const encounterSummary = { ...selectedQuestions };
        addedQuestions.forEach((q) => {
          encounterSummary[q] = "\n";
        });
        removedQuestions.forEach((q) => {
          delete encounterSummary[q];
        });
        let formattedTemplates = "";
        Object.keys(encounterSummary).forEach((key) => {
          formattedTemplates += `${key}: ${encounterSummary[key]}`;
        });

        return {
          ...prev,
          encounter_summary: formattedTemplates,
        };
      });
    },
    [selectedQuestions]
  );

  const allSelected = useMemo(() => {
    const allChecked = questions.every((q) => q.checked);
    return allChecked;
  }, [questions]);

  const allUnselected = useMemo(() => {
    const allUnchecked = questions.every((q) => !q.checked);
    return allUnchecked;
  }, [questions]);

  useEffect(() => {
    if (selectedTemplate) {
      const notSelected = !selectedTemplates?.find(
        (t) => t.value.id === selectedTemplate.id
      );
      const allQuestionsNotPresent = selectedTemplate?.questions?.every(
        (q) => selectedQuestions[q] === undefined
      );
      setQuestions(
        selectedTemplate?.questions?.map((q) => ({
          label: q,
          checked:
            selectedQuestions?.[q] !== undefined ||
            // keep this commented for now
            // notSelected ||
            allQuestionsNotPresent,
        })) || []
      );
    }
  }, [selectedTemplate]);

  const handleDiscard = useCallback(() => {
    setSelectedTemplate(null);
  }, []);

  const handleCheckUncheck = useCallback(({ index, value }) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      if (selectedQuestions[newQuestions[index].label] === undefined) {
        newQuestions[index].checked = !newQuestions[index].checked;
      }
      return newQuestions;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const selectedQuestions = questions
      .filter((q) => q.checked)
      .map((q) => q.label);

    const removedQuestions = questionsBackup.filter(
      (q) => !selectedQuestions.includes(q)
    );
    const addedQuestions = selectedQuestions.filter(
      (q) => !questionsBackup.includes(q)
    );

    handleUpdateQuestions({ addedQuestions, removedQuestions });

    if (allUnselected) {
      setSelectedTemplates((prev) =>
        prev.filter((t) => t.value.id !== selectedTemplate.id)
      );
    } else if (
      !selectedTemplates.find((t) => t.value.id === selectedTemplate.id)
    ) {
      setSelectedTemplates((prev) => [
        ...prev,
        { label: selectedTemplate.text_template, value: selectedTemplate },
      ]);
    }
    setSelectedTemplate(null);
  }, [questions]);

  const toggleAllQuestions = useCallback((e, checked) => {
    if (checked) {
      setQuestions((prev) => prev.map((q) => ({ ...q, checked: true })));
    } else {
      setQuestions((prev) =>
        prev.map((q) => {
          return {
            ...q,
            checked: selectedQuestions[q.label] !== undefined,
          };
        })
      );
    }
  }, []);

  return (
    <Dialog
      open={selectedTemplate !== null}
      // onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <div className="flex justify-between items-center mx-4 my-2">
        <div>
          <FormControlLabel
            control={
              <Checkbox
                color="default"
                checked={allSelected ? true : false}
                onChange={toggleAllQuestions}
              />
            }
            label={selectedTemplate?.text_template}
          />
        </div>

        <button onClick={handleDiscard}>
          <img src="/close.svg" className="size-6" alt="" />
        </button>
      </div>

      <hr className="text-[#d8d8d8]" />

      <div className="mx-4 my-2 grid">
        {questions.map((q, index) => (
          <FormControlLabel
            control={<Checkbox color="default" />}
            checked={q.checked}
            label={q.label}
            onChange={(e) =>
              handleCheckUncheck({ index, value: e.target.value })
            }
          />
        ))}
      </div>

      <div className="mx-auto flex justify-center items-center gap-x-4 my-8">
        <button
          onClick={handleDiscard}
          className="border border-keppel rounded-[3px] text-[#5BC4BF] w-32 py-2"
        >
          Discard
        </button>
        <button
          onClick={handleSubmit}
          className="border border-keppel rounded-[3px] disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-[#6cd8d3] bg-[#5BC4BF] text-white w-32 py-2"
        >
          Confirm
        </button>
      </div>
    </Dialog>
  );
}

function TemplateCreatePopup({ handleCreateTemplate, setShowTemplateForm }) {
  const [templateName, setTemplateName] = useState("");

  const handleDiscard = useCallback(() => {
    setShowTemplateForm(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    await handleCreateTemplate(templateName);
    handleDiscard();
  }, [templateName]);

  return (
    <Dialog
      open={true}
      // onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xs"
      fullWidth
    >
      <div className="mx-4 my-6 grid gap-y-8">
        <div className="flex justify-between items-center">
          <div className="text-lg">Encounter Note Template</div>
          <button onClick={handleDiscard}>
            <img src="/close.svg" className="size-6" alt="" />
          </button>
        </div>
        <div>
          <InputElement
            type="text"
            name="Template Name"
            addMargin={false}
            placeholder="Template Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="border-keppel"
          />
        </div>
        <button
          disabled={!templateName}
          onClick={handleSubmit}
          className="border border-keppel rounded-[3px] disabled:cursor-not-allowed disabled:bg-[#6cd8d3] bg-[#5BC4BF] text-white py-2"
        >
          Create Template
        </button>
      </div>
    </Dialog>
  );
}

function EncounterNoteForm({ isTemplate }) {
  const [mode, setMode] = useState("new");
  const [buttonMode, setButtonMode] = useState("");

  const { clientId } = useParams();
  const [clientDetails, setClientDetails] = useState({});
  const [formOptions, setFormOptions] = useState([]);
  const [carePlanOptions, setCarePlanOptions] = useState([]);
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [Client_Type, setClient_Type] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [approvalOptions, setApprovalOptions] = useState([
    { label: "Yes", value: true },
    { label: "No", value: false },
  ]);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [forms, setForms] = useState([]);
  const [formsBackup, setFormsBackup] = useState([]);
  const [carePlans, setCarePlans] = useState([]);
  const [carePlansBackup, setCarePlansBackup] = useState([]);
  const [signedByBackup, setSignedByBackup] = useState([]);
  const [formData, setFormData] = useState({
    client_id: clientId,
  });

  const [customFields, setCustomFields] = useState([]);
  const [dndItems, setDndItems] = useState([]);
  const [encounterViewItems, setEncounterViewItems] = useState(false);
  const [deletedCustomFields, setDeletedCustomFields] = useState([]);
  // encounter summary
  const [selectedTemplate, setSelectedTemplate] = useState(null); // when user selects a template from the dropdown this state handles the popup logic

  // template form
  const [showTemplateForm, setShowTemplateForm] = useState(false);

  const handleShowTemplatePopup = useCallback(() => {
    setShowTemplateForm(true);
  }, []);

  let customFieldsTags = useMemo(() => {
    return customFields.map((field) => {
      let cf = {
        datatype: field?.type,
        question: field?.props?.label,
        answer: field?.props?.value,
      };

      // if (field.type === "imageupload" || field.type === "fileupload") {
      //   cf.answer = field.props.base64;
      // } else {
      //   cf.answer = field.props.value;
      // }

      if (mode === "edit") {
        if (field.id) {
          cf.id = field.id;
        }
      }

      return cf;
    });
  }, [customFields]);

  let deletedcustomFieldsID = useMemo(() => {
    return deletedCustomFields
      .map((field) => {
        if (field.id) {
          return field.id;
        }
        return null;
      })
      .filter(Boolean);
  }, [deletedCustomFields]);

  const parseToDnDCustomFields = (items) => {
    return items.map((itm) => {
      let constructField = {
        type: itm.datatype,
        props: {
          label: itm.question,
          value: itm.answer,
          width: "w-full",
        },
        ...itm,
      };

      if (itm.datatype === "text" || itm.datatype === "textarea") {
        constructField.props = {
          ...constructField.props,
          type: "text",
        };
      }

      if (itm.datatype === "datetime") {
        constructField.props = {
          ...constructField.props,
          type: "date",
          width: "w-1/4",
        };
      }

      if (itm.datatype === "imageupload") {
        constructField.props = {
          ...constructField.props,
          type: "file",
          accept: "image/*",
          base64: itm.answer,
        };
      }

      if (itm.datatype === "imageupload") {
        constructField.props = {
          ...constructField.props,
          type: "file",
          accept:
            ".png, .jpg, .jpeg, .pdf, .doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          type: "file",
          isFile: true,
          base64: itm.answer,
        };
      }

      return constructField;
    });
  };

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [prevFormData, setPrevFormData] = useState(null);

  const encounterId = queryParams.get("encounterId");
  useEffect(() => {
    const mode = queryParams.get("mode");
    if (mode) {
      setMode(mode);
      setButtonMode(mode);
    } else {
      setMode("add");
      setButtonMode("add");
    }
    if (
      (mode === "edit" || mode === "view") &&
      queryParams.get("encounterId")
    ) {
      const fetchClientEncounterDetails = async () => {
        try {
          const response = await protectedApi.get(
            `/encounter-notes/${encounterId}`
          );
          const data = await response.data;
          console.log(data?.custom_fields);
          setPrevFormData(data);
          setEncounterViewItems(true);
          setDndItems(data?.custom_fields);
          data.custom_fields = JSON.stringify(data.custom_fields);
          setStartTime(
            convertTimeToISOString(data.encounter_date, data.start_time)
          );
          setEndTime(
            convertTimeToISOString(data.encounter_date, data.end_time)
          );
          const convertedForms = data.forms.map((form) => {
            return { label: form.form_name, value: form.form_id };
          });
          setForms(convertedForms);
          setFormsBackup(data.forms.map((form) => form.form_id));
          data.forms = data.forms.map((form) => form.form_id);
          const convertedCarePlans = data.care_plans.map((carePlan) => {
            return {
              label: carePlan.care_plan_name,
              value: carePlan.care_plan_id,
            };
          });
          setCarePlans(convertedCarePlans);
          setCarePlansBackup(
            data.care_plans.map((carePlan) => carePlan.care_plan_id)
          );
          data.forms_deleted = [];
          data.care_plans_deleted = [];
          data.uploaded_documents_deleted = [];
          data.signed_by_deleted = [];

          let formattedEncounterSummary = "";

          Object.keys(data.encounter_summary).forEach((key) => {
            formattedEncounterSummary += `${key}: ${data.encounter_summary[key]}`;
          });

          data.encounter_summary = formattedEncounterSummary;

          data.care_plans = data.care_plans.map(
            (carePlan) => carePlan.care_plan_id
          );
          if (!data?.billing_status) {
            data.billing_status = [];
          }
          if (!data?.billing_comments) {
            data.billing_comments = [];
          }

          setFormData(data);

          // CustomFields
          setCustomFields(parseToDnDCustomFields(data.tags || []));
        } catch (error) {
          console.error(error.message);
        }
      };
      fetchClientEncounterDetails();
    }
  }, []);

  const [tableNames, setTableName] = useState(null);
  const [tableColumns, setTableColumn] = useState(null);
  const fetchDropdownOptions = async (tableName, tableColumns) => {
    setTableName(tableName);
    const newDroplist = {};
    for (const column of tableColumns) {
      if (
        column.type === "USER-DEFINED" ||
        ((column.type === "USER-DEFINED" || column.type === "ARRAY") &&
          (column.name.endsWith("_multiple") ||
            column.name.endsWith("_checkbox")))
      ) {
        const enumType = `enum_type_${tableName}_${column.name}_enum_type`;

        try {
          const response = await axios.get(`${apiURL}/get_enum_labels/`, {
            params: {
              enum_type: enumType,
            },
          });
          const dropdownOptions = response.data.enum_labels;
          newDroplist[enumType] = dropdownOptions;
        } catch (error) {
          console.error(
            "Error fetching dropdown options for",
            enumType,
            ":",
            error
          );
        }
      }
    }
  };
  const fetchTableHeaders = async (value) => {
    const access_token = localStorage.getItem("access_token");
    try {
      // Create an array of promises for the API calls
      const promises = [
        axios.get(`${apiURL}/get_table_structure/${value}/`),

        fetch(`${apiURL}/profile-type/`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }).then((response) => response.json()),
      ];

      // Use Promise.all to fetch all data simultaneously
      const [header_response, profile_type_Response] = await Promise.all(
        promises
      );

      // Log the responses
      console.log(
        "from promise all",

        header_response,
        profile_type_Response
      );
      fetchDropdownOptions(
        header_response?.data?.table_name,
        header_response?.data?.columns
      );
      setDndItems(header_response?.data?.columns);
      console.log(header_response?.data?.columns);
      setTableColumn(header_response?.data?.columns);
    } catch (error) {
      console.error("Error fetching table headers:", error);
    }
  };

  const handleFormDataChange = useCallback(
    (fieldName, value) => {
      console.log({ fieldName, value });
      if (fieldName === "Client_Type") {
        setEncounterViewItems(false);
      }
      fieldName === "Client_Type" && fetchTableHeaders(value);

      setFormData((prevData) => ({ ...prevData, [fieldName]: value }));
    },

    [formData]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   console.log(formData);
  // }, [formData]);

  useEffect(() => {
    if (mode === "add") {
      setFormData((prev) => ({
        ...prev,
        staff_name: userOptions?.find(
          (user) => user.value === userInfo?.user_id
        )?.value,
      }));
    }
  }, [userOptions, userInfo]);

  useEffect(() => {
    fetchClientDetails({ clientId, isTemplate })
      .then((clientDetailsResponse) => {
        if (clientDetails?.date_of_birth) {
          const splitDate = clientDetailsResponse.date_of_birth.split("-");
          if (splitDate.length === 3) {
            clientDetailsResponse.date_of_birth = `${splitDate?.[1]}/${splitDate?.[2]}/${splitDate?.[0]}`;
          }
        }
        setClientDetails(clientDetailsResponse);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  useEffect(() => {
    fetchFormOptions()
      .then((formOptionsResponse) => {
        console.log(formOptionsResponse);
        const matchingTables = formOptionsResponse.matching_tables; // Extract the array
        const convertedFormOptions = matchingTables.map((table) => ({
          label: table,
          value: table,
        }));

        setFormOptions(convertedFormOptions);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  useEffect(() => {
    fetchClientOptions()
      .then((fetchClientOptions) => {
        const convertedFormOptions = fetchClientOptions.matching_tables.map(
          (formName) => ({
            label: formName,
            value: formName,
          })
        );

        setClient_Type(convertedFormOptions);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  useEffect(() => {
    fetchCarePlanOptions()
      .then((carePlanOptionsResponse) => {
        const convertedCarePlanOptions = carePlanOptionsResponse.map(
          (carePlan) => ({ label: carePlan.care_plan_name, value: carePlan.id })
        );
        setCarePlanOptions(convertedCarePlanOptions);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  useEffect(() => {
    fetchFacilityOptions()
      .then((facilityOptionsResponse) => {
        const convertedFacilityOptions = facilityOptionsResponse.map(
          (facility) => ({ label: facility.name, value: facility.id })
        );
        setFacilityOptions(convertedFacilityOptions);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  useEffect(() => {
    fetchProgramOptions()
      .then((programOptionsResponse) => {
        const convertedProgramOptions = programOptionsResponse?.map(
          (program) => ({ label: program.name, value: program.id })
        );
        setProgramOptions(convertedProgramOptions);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  useEffect(() => {
    fetchTemplateOptions()
      .then((response) => {
        const convertedResponse = response
          ?.filter(
            (data) =>
              data?.text_template !== null && data?.questions?.length > 0
          )
          .map((data) => ({
            label: data.text_template,
            value: data,
          }));
        setTemplateOptions(convertedResponse);
      })
      .catch((error) => console.error(error));
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
    fetchUserInfo({ isTemplate })
      .then((userInfoResponse) => {
        setUserInfo(userInfoResponse);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  useEffect(() => {
    fetchEncounterDirectory();
  }, []);

  const disableSubmit = useMemo(() => {
    return (
      !formData?.staff_name ||
      !formData?.encounter_date ||
      !formData?.facility ||
      !formData?.start_time ||
      !formData?.encounter_type ||
      !formData?.end_time ||
      !formData?.encounter_status ||
      !formData?.program ||
      (mode !== "edit" && !formData?.Client_Type)
    );
  }, [formData, mode]);

  const handleCreatePayload = () => {
    const {
      staff_name,
      facility,
      encounter_date,
      start_time,
      end_time,
      encounter_status,
      encounter_type,
      program,
      note_template,
      Client_Type,
      custom_fields,
      encounter_summary_text_template,
      encounter_summary,
      forms,
      forms_deleted,
      care_plans,
      care_plans_deleted,
      uploaded_documents_deleted,
      signed_by_deleted,
      signed_by,
      uploaded_documents,
      billing_status,
      billing_comments,
      form_completion_date,
    } = formData;
    const formDataPayload = new FormData();
    clientId && formDataPayload.append("client_id", Number(clientId));
    formDataPayload.append("system_id", 12345);
    staff_name && formDataPayload.append("staff_name", staff_name);
    facility && formDataPayload.append("facility", facility);
    encounter_date && formDataPayload.append("encounter_date", encounter_date);

    start_time && formDataPayload.append("start_time", start_time);
    end_time && formDataPayload.append("end_time", end_time);

    encounter_status &&
      formDataPayload.append("encounter_status", encounter_status);
    encounter_type && formDataPayload.append("encounter_type", encounter_type);
    program && formDataPayload.append("program", program);
    note_template && formDataPayload.append("note_template", note_template);
    Client_Type && formDataPayload.append("Client_Type", Client_Type);
    form_completion_date &&
      formDataPayload.append("form_completion_date", form_completion_date);
    // custom_fields !== undefined &&
    //   formDataPayload.append(
    //     "custom_fields",
    //     JSON.stringify(custom_fields || [])
    //   );
    encounter_summary_text_template &&
      formDataPayload.append(
        "encounter_summary_text_template",
        encounter_summary_text_template
      );

    if (encounter_summary) {
      const newEncounterSummary = {};
      encounter_summary.split("\n").forEach((line) => {
        const [key, value] = line.split(":");
        if (
          key !== undefined &&
          typeof key === "string" &&
          key.trim() !== "" &&
          typeof value === "string"
        ) {
          newEncounterSummary[key.trim()] = (value || "").trim() + "\n";
        }
      });
      formDataPayload.append(
        "encounter_summary",
        JSON.stringify(newEncounterSummary)
      );
    } else {
      formDataPayload.append("encounter_summary", JSON.stringify({}));
    }

    forms &&
      formDataPayload.append(
        "forms",
        JSON.stringify(
          forms?.filter((formId) => !formsBackup.includes(formId)) || []
        )
      );
    forms_deleted &&
      formDataPayload.append(
        "forms_deleted",
        JSON.stringify([...new Set(forms_deleted)] || [])
      );
    care_plans &&
      formDataPayload.append(
        "care_plans",
        JSON.stringify(
          care_plans?.filter(
            (carePlanId) => !carePlansBackup?.includes(carePlanId)
          ) || []
        )
      );
    care_plans_deleted &&
      formDataPayload.append(
        "care_plans_deleted",
        JSON.stringify([...new Set(care_plans_deleted)] || [])
      );
    uploaded_documents_deleted &&
      formDataPayload.append(
        "uploaded_documents_deleted",
        JSON.stringify(uploaded_documents_deleted)
      );
    signed_by_deleted &&
      formDataPayload.append(
        "signed_by_deleted",
        JSON.stringify(signed_by_deleted)
      );
    signed_by &&
      formDataPayload.append(
        "signed_by",
        JSON.stringify(
          signed_by.filter(
            (sign) =>
              !signedByBackup.find(
                (signBackup) =>
                  signBackup?.id === sign?.id &&
                  signBackup?.timestamp === sign?.timestamp
              )
          ) || []
        )
      );

    billing_status?.length
      ? formDataPayload.append(
          "billing_status",
          JSON.stringify(
            billing_status?.map((bs) => ({
              ...bs,
              user_name:
                bs?.user_id !== undefined
                  ? bs?.user_id
                  : bs?.user_name?.user_id || bs?.user_name,
            }))
          )
        )
      : formDataPayload.append("billing_status", JSON.stringify([]));
    billing_comments?.length
      ? formDataPayload.append(
          "billing_comments",
          JSON.stringify(
            billing_comments?.map((bc) => ({
              ...bc,
              user_name:
                bc?.user_id !== undefined
                  ? bc?.user_id
                  : bc?.user_name?.user_id || bc?.user_name,
            }))
          )
        )
      : formDataPayload.append("billing_comments", JSON.stringify([]));
    for (let i = 0; i < uploaded_documents?.length; i++) {
      if (uploaded_documents[i] instanceof File) {
        formDataPayload.append("uploaded_documents", uploaded_documents[i]);
      }
    }

    // DND Custom Fields

    // let tags = customFields.map((field) => {
    //   console.log({ xx_field: field });
    //   let answer = "";
    //   if (field.type === "imageupload" || field.type === "fileupload") {
    //     answer = field.props.base64;
    //   } else {
    //     answer = field.props.value;
    //   }

    //   console.log({
    //     xx_rEle: {
    //       datatype: field.type,
    //       question: field.props.label,
    //       answer: answer,
    //     },
    //   });
    //   return {
    //     datatype: field.type,
    //     question: field.props.label,
    //     answer: answer,
    //   };
    // });

    console.log("--- Payload Start ----");
    console.log({ customFieldsTags, deletedcustomFieldsID });
    console.log("--- Payload End ----");

    formDataPayload.append("tags", JSON.stringify([]));
    formDataPayload.append(
      "custom_fields",
      JSON.stringify(customFieldsTags || custom_fields || [])
    );
    formDataPayload.append("tags_deleted", JSON.stringify([]));
    return formDataPayload;
  };

  const handleCreate = async () => {
    try {
      const formDataPayload = await handleCreatePayload();

      const response = await protectedApi.post(
        "/encounter-notes/",
        formDataPayload
      );
      if (response.status === 201) {
        notifySuccess("Encounter Note created successfully");
        navigate(`/clientchart/${clientId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTemplate = async (templateName) => {
    try {
      if (!templateName) {
        notifyError("Please enter a template name");
        return;
      }
      const templatePayload = {
        name: templateName,
        form_name: formData?.Client_Type,
        program: formData.program,
        is_approval_needed: formData?.approval_required,
      };
      const response = await protectedApi.post(
        "/encounter-directory/",
        templatePayload
      );
      if (response.status === 200) {
        notifySuccess("Encounter template created successfully");
        navigate("/encounter-directory");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const formDataPayload = handleCreatePayload();
      console.log(formData);
      console.log(prevFormData);
      const response = await protectedApi.put(
        `/encounter-notes-update/${encounterId}/`,
        formDataPayload
      );
      if (response.status === 200) {
        notifySuccess("Encounter Note updated successfully");
        navigate(`/clientchart/${clientId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEncounterDirectory = () => {
    protectedApi
      .get(`/encounter-directory/`)
      .then((response) => {
        const { data } = response;

        if (data && data.length > 0) {
          setFormData((prev) => {
            return {
              ...prev,
              Client_Type: data[0].form_name,
              program: data[0].program,
              approval_required: data[0].is_approval_needed || false,
            };
          });
          if (data[0]?.form_name) {
            setEncounterViewItems(false);
            fetchTableHeaders(data[0].form_name);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching  encounter directory details :", error);
      })
      .finally(() => {});
  };

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const query = useQuery();

  // Combine conditions
  const isDisabled = useMemo(() => {
    if (isTemplate) {
      if (
        formData?.program &&
        formData?.Client_Type &&
        formData?.approval_required !== undefined
      ) {
        return false;
      }
      return true;
    }
    if (mode === "edit") {
      // Additional check for formData === prevFormData when mode is edit
      return (
        disableSubmit ||
        mode === "view" ||
        JSON.stringify(formData) === JSON.stringify(prevFormData)
      );
    } else {
      // For other modes, use the default disableSubmit condition
      return disableSubmit || mode === "view";
    }
  }, [disableSubmit, mode, formData, prevFormData, isTemplate]);

  return (
    <div className="mx-1" style={{ fontFamily: "poppins" }}>
      <PageTitle
        clientId={clientId}
        title="Encounter"
        onClick={() =>
          clientId
            ? navigate(`/clientchart/${clientId}`)
            : navigate("/encounter-directory")
        }
      />
      <div className="border border-keppel rounded-[5px] my-6 bg-white !important">
        {/* Component Header */}
        <div className="flex justify-between items-center px-6 font-medium text-xl text-white bg-[#5bc4bf] py-3">
          <div>Encounter Client Profile</div>
          <div>System ID:1234568</div>
        </div>

        {/* Component Body */}
        <div className="px-4 py-4 grid gap-y-8">
          <FormWrapper label="Client Details" isTemplate={isTemplate}>
            <div className="col-span-6">
              <InputElement
                type="text"
                value={
                  clientDetails?.first_name || clientDetails?.last_name
                    ? clientDetails?.first_name + " " + clientDetails?.last_name
                    : ""
                }
                disabled
                className="border-keppel"
                placeholder="Enter Client Name"
              />
            </div>
            <div className="col-span-6">
              <DateInput
                value={
                  clientDetails?.date_of_birth
                    ? format(clientDetails?.date_of_birth, "MM-dd-yyyy")
                    : ""
                }
                placeholder="DOB"
                dateFormat="MM-dd-yyyy"
                isEdittable
                className="m-1 border-keppel h-[37.6px]"
                height="37.6px"
              />
            </div>
            <div className="col-span-6">
              <SelectElement
                placeholder="Preferred Pronouns"
                className="border-keppel"
                disabled
                value={clientDetails?.preferred_pronouns || ""}
                options={[clientDetails?.preferred_pronouns || ""]}
              />
            </div>
            <div className="col-span-6">
              <InputElement
                type="text"
                value={clientDetails?.primary_phone || ""}
                disabled
                className="border-keppel w-full my-1"
                placeholder="Enter a phone number"
              />
            </div>
            <div className="col-span-6">
              <InputElement
                type="text"
                value={clientDetails?.email_address || ""}
                disabled
                className="border-keppel"
                placeholder="Enter Email"
              />
            </div>
          </FormWrapper>

          <FormWrapper label="Encounter Details">
            <div className="col-span-6">
              <DropDown
                name="staff_name"
                placeholder="User Name *"
                handleChange={(data) =>
                  handleFormDataChange("staff_name", data.value)
                }
                className="border-keppel m-1 h-[37.6px]"
                height="37.6px"
                isEdittable={mode === "view" || isTemplate}
                fontSize="14px"
                borderColor="#5bc4bf"
                options={userOptions}
                selectedOption={
                  userOptions.find(
                    (user) => formData?.staff_name === user.value
                  )?.label || ""
                }
              />
            </div>
            <div className="col-span-6">
              <DateInput
                placeholder="Encounter Date *"
                className="m-1 border-keppel"
                dateFormat="MM-dd-yyyy"
                isEdittable={mode === "view" || isTemplate}
                value={
                  formData?.encounter_date
                    ? format(formData?.encounter_date, "MM-dd-yyyy")
                    : ""
                }
                handleChange={(date) =>
                  handleFormDataChange("encounter_date", date)
                }
                height="37.6px"
              />
            </div>
            <div className="col-span-6">
              <DropDown
                name="facility"
                placeholder="Facility *"
                handleChange={(data) =>
                  handleFormDataChange("facility", data.value)
                }
                className="border-keppel m-1 h-[37.6px]"
                height="37.6px"
                isEdittable={mode === "view" || isTemplate}
                fontSize="14px"
                borderColor="#5bc4bf"
                options={facilityOptions}
                selectedOption={
                  facilityOptions?.find(
                    (option) => option.value === formData?.facility
                  )?.label || ""
                }
              />
            </div>
            <div className="col-span-6">
              <TimeInput
                width="100%"
                height="37.6px"
                placeholder="Start Time *"
                value={startTime}
                isEdittable={mode === "view" || isTemplate}
                selectedDate={formData?.encounter_date || null}
                handleChange={(value) => {
                  setStartTime(value);
                  handleFormDataChange(
                    "start_time",
                    convertToTimeString(value)
                  );
                }}
                className="m-1 w-full border-keppel"
              />
            </div>
            <div className="col-span-6">
              <DropDown
                name="encounter_type"
                placeholder="Encounter Mode *"
                handleChange={(data) =>
                  handleFormDataChange("encounter_type", data.value)
                }
                className="border-keppel m-1 h-[37.6px]"
                height="37.6px"
                isEdittable={mode === "view" || isTemplate}
                fontSize="14px"
                borderColor="#5bc4bf"
                options={[
                  { label: "Office Encounter", value: "Office Encounter" },
                  { label: "Video Encounter", value: "Video Encounter" },
                  { label: "Phone Encounter", value: "Phone Encounter" },
                  {
                    label: "Street Visit for Unhoused Client",
                    value: "Street Visit for Unhoused Client",
                  },
                  {
                    label: "Street Visit for Housed Client",
                    value: "Street Visit for Housed Client",
                  },
                  { label: "Home Visit", value: "Home Visit" },
                  {
                    label: "Hospital/Shelter/Other Facility Visit",
                    value: "Hospital/Shelter/Other Facility Visit",
                  },
                  {
                    label: "Care Coordination (client not involved)",
                    value: "Care Coordination (client not involved)",
                  },
                  {
                    label: "Case Conference/Review (client not involved)",
                    value: "Case Conference/Review (client not involved)",
                  },
                  { label: "E-mail", value: "E-mail" },
                  { label: "Letter", value: "Letter" },
                ]}
                selectedOption={formData?.encounter_type || ""}
              />
            </div>
            <div className="col-span-6">
              <TimeInput
                width="100%"
                height="37.6px"
                placeholder="End Time *"
                value={endTime}
                isEdittable={mode === "view" || isTemplate}
                selectedDate={formData?.encounter_date || null}
                handleChange={(value) => {
                  setEndTime(value);
                  handleFormDataChange("end_time", convertToTimeString(value));
                }}
                className="m-1 w-full border-keppel"
              />
            </div>
            <div className="col-span-6">
              <DropDown
                name="encounter_status"
                placeholder="Encounter Status *"
                handleChange={(data) =>
                  handleFormDataChange("encounter_status", data.value)
                }
                isEdittable={mode === "view" || isTemplate}
                className="border-keppel m-1 h-[37.6px]"
                height="37.6px"
                fontSize="14px"
                borderColor="#5bc4bf"
                options={[
                  { label: "Complete", value: "Complete" },
                  {
                    label: "Partial or Interrupted",
                    value: "Partial or Interrupted",
                  },
                  {
                    label: "No answer or bad number",
                    value: "No answer or bad number",
                  },
                  {
                    label: "No-Show or did not find client",
                    value: "No-Show or did not find client",
                  },
                ]}
                selectedOption={formData?.encounter_status || ""}
              />
            </div>
            <div className="col-span-6">
              <DropDown
                name="program"
                placeholder="Program *"
                handleChange={(data) =>
                  handleFormDataChange("program", data.value)
                }
                isEdittable={!isTemplate}
                className="border-keppel m-1 h-[37.6px]"
                height="37.6px"
                fontSize="14px"
                borderColor="#5bc4bf"
                options={programOptions}
                selectedOption={
                  programOptions?.find(
                    (option) => option.value === formData?.program
                  )?.label || ""
                }
              />
            </div>
            <div className="col-span-6">
              <DropDown
                name="Client_Type"
                placeholder="Form Template *"
                handleChange={(data) =>
                  handleFormDataChange("Client_Type", data.value)
                }
                isEdittable={!isTemplate}
                className="border-keppel m-1 h-[37.6px]"
                height="37.6px"
                fontSize="14px"
                borderColor="#5bc4bf"
                options={Client_Type}
                selectedOption={formData?.Client_Type || ""}
              />
            </div>
            <div className="col-span-6">
              <DropDown
                name="approval_required"
                placeholder="Approval Required"
                className="border-keppel m-1 h-[37.6px]"
                height="37.6px"
                fontSize="14px"
                borderColor="#5bc4bf"
                isEdittable={!isTemplate}
                handleChange={(data) =>
                  handleFormDataChange("approval_required", data.value)
                }
                selectedOption={
                  approvalOptions.find(
                    (option) => option.value === formData?.approval_required
                  )?.label || ""
                }
                options={approvalOptions}
              />
            </div>
          </FormWrapper>
          {tableColumns || encounterId ? (
            <>
              <CustomFieldsForEncounter
                id={10}
                onChange={(dndItms) => {
                  console.log(dndItms, "inside change");
                  setCustomFields(dndItms);
                }}
                dndItems={dndItems}
                encounterViewItems={encounterViewItems}
                viewMode={mode === "encounterView"}
                mode={"edit"}
                setMode={setMode}
                tableColumns={tableColumns}
              />
            </>
          ) : (
            <>
              {/*
            <FormWrapper
              label="Custom Fields"
              isCollapsable={true}
              initialState={customFields.length > 0}
            >
              <div className="col-span-12">
                <DnDCustomFields
                  onChange={(dndItms) => {
                    setCustomFields(dndItms);
                  }}
                  onDelete={(dndItms) => {
                    console.log({ onDelItm: dndItms });
                    setDeletedCustomFields(dndItms);
                  }}
                  deletedItems={deletedCustomFields}
                  dndItems={customFields}
                  viewMode={mode === "view"}
                />
              </div>
            </FormWrapper>*/}
            </>
          )}

          <FormWrapper label="Encounter Summary">
            <div className="col-span-12">
              <MultiSelectElement
                name={"encounter_summary_text_template"}
                className="border border-keppel rounded-[5px]"
                placeholder="encounter_summary_text_template"
                value={[]}
                disabled={mode === "view" || isTemplate}
                onChange={useCallback((data) => {
                  setSelectedTemplate(data?.[0]?.value);
                }, [])}
                options={templateOptions}
              />
            </div>
            <div className="col-span-12">
              <TextAreaElement
                className="h-32 border-keppel"
                value={formData?.encounter_summary || ""}
                onChange={(e) =>
                  handleFormDataChange("encounter_summary", e.target.value)
                }
                disabled={mode === "view" || isTemplate}
                placeholder="Enter Encounter Summary"
              />
            </div>
          </FormWrapper>

          <FormWrapper label="Forms and Authority">
            <div className="col-span-6 space-y-3">
              <MultiSelectElement
                name={"forms"}
                className="border border-keppel rounded-[5px]"
                placeholder="Select forms"
                value={forms || []}
                disabled={mode === "view" || isTemplate}
                onChange={(data) => {
                  setForms(data);
                  const updatedData = [];
                  if (mode === "edit") {
                    let forms_deleted = [
                      ...formData?.forms_deleted,
                      ...formData?.forms,
                    ];
                    data.forEach((d) => {
                      const old_length = formData?.forms_deleted?.length;
                      forms_deleted = forms_deleted.filter(
                        (formId) => formId !== d.value
                      );
                      if (forms_deleted.length !== old_length) {
                        updatedData.push(d.value);
                      } else {
                        updatedData.push(d.value);
                      }
                    });
                    handleFormDataChange("forms_deleted", forms_deleted);
                    handleFormDataChange("forms", updatedData);
                  } else {
                    handleFormDataChange(
                      "forms",
                      data.map((d) => d.value)
                    );
                  }
                }}
                options={formOptions}
              />

              <div className="flex items-center justify-start gap-2 flex-wrap">
                {forms?.map((item, index) => (
                  <button
                    onClick={() =>
                      navigate(
                        `/createtableform/${
                          item.value
                        }/?encounterId=${query.get(
                          "encounterId"
                        )}&encounter=select_forms`
                      )
                    }
                    key={item.value}
                    className="p-2 bg-[#d0edec] rounded-lg"
                  >
                    <div>{item.value}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="col-span-6">
              <MultiSelectElement
                name={"care_plans"}
                className="border border-keppel rounded-[5px]"
                placeholder="Care Plans"
                value={carePlans || []}
                disabled={mode === "view" || isTemplate}
                onChange={(data) => {
                  setCarePlans(data);
                  const updatedData = [];
                  if (mode === "edit") {
                    let care_plans_deleted = [
                      ...formData?.care_plans_deleted,
                      ...formData?.care_plans,
                    ];
                    data.forEach((d) => {
                      const old_length = formData?.care_plans_deleted?.length;
                      care_plans_deleted = care_plans_deleted.filter(
                        (carePlanId) => carePlanId !== d.value
                      );
                      if (care_plans_deleted.length !== old_length) {
                        updatedData.push(d.value);
                      } else {
                        updatedData.push(d.value);
                      }
                    });
                    handleFormDataChange(
                      "care_plans_deleted",
                      care_plans_deleted
                    );
                    handleFormDataChange("care_plans", updatedData);
                  } else {
                    handleFormDataChange(
                      "care_plans",
                      data.map((d) => d.value)
                    );
                  }
                }}
                options={carePlanOptions}
              />
            </div>
            <div className="col-span-12">
              <DateInput
                placeholder="Form Completion Date"
                className="m-1 border-keppel"
                dateFormat="MM-dd-yyyy"
                isEdittable={mode === "view" || isTemplate}
                value={
                  formData?.form_completion_date
                    ? format(formData?.form_completion_date, "MM-dd-yyyy")
                    : ""
                }
                handleChange={(date) =>
                  handleFormDataChange("form_completion_date", date)
                }
                height="37.6px"
              />
            </div>
            <div className="col-span-12">
              <FileInput
                title="Upload Documents"
                className="border-keppel m-1 w-full"
                formData={formData}
                setFormData={setFormData}
                disabled={mode === "view" || isTemplate}
                mode={mode}
                deletedFilesKey="uploaded_documents_deleted"
                files={formData?.uploaded_documents || []}
                setFiles={useCallback(
                  (files) => {
                    setFormData({ ...formData, uploaded_documents: files });
                  },
                  [formData]
                )}
              />
            </div>
            <PrivateComponent permission="sign_encounter_notes_in_my_program">
              <PrivateComponent permission="sign_encounter_notes_in_my_program">
                <div className="col-span-12">
                  <SignInput
                    signs={formData?.signed_by || []}
                    user={userInfo}
                    disabled={mode === "view" || isTemplate}
                    mode={mode}
                    setSigns={(signs) => {
                      handleFormDataChange("signed_by", signs);
                    }}
                    setFormData={setFormData}
                    className="border-keppel m-1"
                  />
                </div>
              </PrivateComponent>
            </PrivateComponent>
          </FormWrapper>

          <FormWrapper label="Billing Details">
            <BillingStatus
              mode={mode}
              handleFormDataChange={handleFormDataChange}
              formData={formData}
              userInfo={userInfo}
              isTemplate={isTemplate}
            />
            <BillingComments
              mode={mode}
              handleFormDataChange={handleFormDataChange}
              formData={formData}
              userInfo={userInfo}
              isTemplate={isTemplate}
            />
          </FormWrapper>
        </div>
        <div className="mx-auto flex justify-center items-center gap-x-4 my-8">
          <button
            onClick={() =>
              clientId
                ? navigate(`/clientchart/${clientId}`)
                : navigate("/encounter-directory")
            }
            className="border border-keppel rounded-[3px] text-[#5BC4BF] w-32 py-2"
          >
            Cancel
          </button>
          {buttonMode === "edit" || buttonMode === "add" ? (
            <button
              disabled={isDisabled}
              onClick={
                mode === "edit"
                  ? handleUpdate
                  : isTemplate
                  ? handleShowTemplatePopup
                  : handleCreate
              }
              className="border border-keppel rounded-[3px] disabled:cursor-not-allowed disabled:bg-[#6cd8d3] bg-[#5BC4BF] text-white w-36 py-2"
            >
              {isTemplate ? "Save Template" : "Save"}
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>

      {selectedTemplate !== null && (
        <EncounterSummaryPopup
          formData={formData}
          setFormData={setFormData}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          selectedTemplates={selectedTemplates}
          setSelectedTemplates={setSelectedTemplates}
        />
      )}
      {showTemplateForm && (
        <TemplateCreatePopup
          handleCreateTemplate={handleCreateTemplate}
          setShowTemplateForm={setShowTemplateForm}
        />
      )}
    </div>
  );
}

export default EncounterNoteForm;
