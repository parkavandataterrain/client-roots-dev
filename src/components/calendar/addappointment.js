import React, { useEffect, useRef, useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import axios from "axios";

import ClosePNG from "../images/close.png";
import CloseIcon from "../images/form_builder/close_x.svg";
import DropDown from "../common/Dropdown";
import TextBox from "../common/TextBox";
import DateInput from "../common/DateInput";
import TimeInput from "../common/TimeInput";
import apiURL from "../.././apiConfig";

import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Controller } from "react-hook-form";

import Swal from "sweetalert2";
import axiosInstance from "../../helper/axiosInstance";

import Select from "react-select";
import { notify } from "../../helper/toastNotication";
import dayjs from "dayjs";

const AddAppointment_ = ({
  toggleModal,
  fetchEvents,
  setShowAlert,
  show,
  appointmentDetail,
  isUpdate = false,
}) => {
  const options = [
    { value: "15 mins before time", label: "15 mins before time" },
    { value: "on time", label: "on time" },
  ];
  const [selectedTime, setSelectedTime] = useState(null);
  const [isExternal, setIsExternal] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateChange = (name, value) => {
    console.log({ name, value });
    if (name === "date") {
      const formattedDate = format(value, "MM-dd-yyyy");
      setDate(formattedDate);
    } else if (name === "start_time") {
      setStartTime(value);
    } else if (name === "end_time") {
      setEndTime(value);
    }
    setValue(name, value);
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);

    let start_datetime = new Date(data.date);
    start_datetime.setHours(data.start_time.getHours());
    start_datetime.setMinutes(data.start_time.getMinutes());
    start_datetime.setSeconds(data.start_time.getSeconds());

    let end_datetime = new Date(data.date);
    end_datetime.setHours(data.end_time.getHours());
    end_datetime.setMinutes(data.end_time.getMinutes());
    end_datetime.setSeconds(data.end_time.getSeconds());

    let endpoint = isExternal ? "/create_event/" : "/django/create_event/";
    let axiosCall = axios.post;

    if (isUpdate) {
      endpoint = `/update_event/${appointmentDetail.fullEvent.id}/`;
      axiosCall = isUpdate ? axios.put : axios.post;
    }

    let splittedAttendees = data.attendees.split(",").map((email) => {
      return {
        email,
      };
    });

    let event = {
      summary: data.appointement_title,
      start_datetime: start_datetime.toISOString(),
      end_datetime: end_datetime.toISOString(),
      attendees: splittedAttendees,
    };

    axiosCall(`${apiURL}${endpoint}`, event)
      .then((response) => {
        Swal.fire({
          title: "Success!",
          text: `Appointment ${isUpdate ? "Updated" : "Created"}`,
          icon: "success",
          timer: 2000,
        });
        setShowAlert && setShowAlert(true);
        fetchEvents && fetchEvents();
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((error) => {
        console.error("Error", error);
        Swal.fire({
          title: "Error!",
          text: `Unable to ${isUpdate ? "Update" : "Create"} Appointment`,
          icon: "error",
          timer: 2000,
        });
      })
      .finally(() => {
        resetAll();
        setIsSubmitting(false);
        toggleModal();
      });
  };

  const handleToggle = (value) => {
    setIsExternal(value === "external");
  };

  const resetAll = () => {
    reset();
    setDate(null);
    setStartTime(null);
    setEndTime(null);
  };

  useEffect(() => {
    if (isUpdate && show && appointmentDetail) {
      const { summary, start, end, fullEvent, isExternal } = appointmentDetail;
      setValue("appointement_title", summary);
      handleDateChange("date", start.dateTime); // Assuming start.dateTime contains date
      handleDateChange("start_time", new Date(start.dateTime));
      handleDateChange("end_time", new Date(end.dateTime));
      setValue(
        "attendees",
        fullEvent.attendees.map((attendee) => attendee.email).join(",")
      );
      setIsExternal(isExternal);
    } else {
      resetAll();
      setIsExternal(true);
    }
  }, [show, isUpdate, appointmentDetail]);

  return (
    <Modal
      show={show}
      onHide={() => toggleModal()}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header className="m-0 p-2 w-100 text-white text-base bg-[#5BC4BF] font-medium">
        <Modal.Title className="m-0 p-0 w-100">
          <div className="flex justify-between items-center w-100">
            <span className="text-white text-base">
              {isUpdate ? "Update Appointment" : "Add New Appointment"}
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
        <div className="flex relative items-center justify-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col bg-white">
              <div className="flex flex-col">
                <div className="p-3">
                  <TextBox
                    name="appointement_title"
                    placeholder="Appointment Title"
                    register={register}
                    registerProps={{ required: true }}
                  />
                  {errors.appointement_title && (
                    <span className="text-xs ms-1 text-red-500">
                      This field is required
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-row">
                <div className="p-3">
                  <TextBox
                    name="client_name"
                    placeholder="Client Name"
                    register={register}
                    registerProps={{ required: isUpdate ? false : true }}
                    isEdittable={isUpdate}
                  />
                  {errors.client_name && (
                    <span className="text-xs ms-1 text-red-500">
                      This field is required
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <DateInput
                    name="date"
                    placeholder="Date"
                    register={register}
                    registerProps={{ required: true }}
                    value={date}
                    handleChange={(date) => handleDateChange("date", date)}
                  />

                  {errors.date && (
                    <span className="text-xs ms-1 text-red-500">
                      This field is required
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-row">
                <div className="p-3">
                  <TimeInput
                    name="start_time"
                    placeholder="Start Time"
                    value={startTime}
                    handleChange={(value) =>
                      handleDateChange("start_time", value)
                    }
                    register={register}
                    selectedDate={date}
                    registerProps={{ required: true }}
                  />
                  {errors.start_time && (
                    <span className="text-xs ms-1 text-red-500">
                      This field is required
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <TimeInput
                    name="end_time"
                    placeholder="End Time"
                    value={endTime}
                    handleChange={(value) =>
                      handleDateChange("end_time", value)
                    }
                    register={register}
                    selectedDate={date}
                    registerProps={{ required: true }}
                  />
                  {errors.end_time && (
                    <span className="text-xs ms-1 text-red-500">
                      This field is required
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-row">
                <div className="p-3 w-full">
                  <TextBox
                    name="attendees"
                    placeholder="Attendees (comma separated)"
                    register={register}
                    registerProps={{
                      required: true,
                      validate: (value) => {
                        const emailPattern = /\S+@\S+\.\S+/;
                        const emails = value
                          .split(",")
                          .map((email) => email.trim());
                        return (
                          emails.every((email) => emailPattern.test(email)) ||
                          "Invalid email format"
                        );
                      },
                    }}
                  />
                  {errors.attendees && (
                    <span className="text-xs ms-1 text-red-500">
                      {errors.attendees.message}
                    </span>
                  )}
                  {errors.attendees && errors.attendees.type === "required" && (
                    <span className="text-xs ms-1 text-red-500">
                      This field is required
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-center items-center py-3 px-1 gap-3">
                <div className="">
                  <label className="inline-flex items-center text-xs">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-[#43B09C] accent-teal-600"
                      name="toggleType"
                      value="external"
                      checked={isExternal}
                      onChange={() => handleToggle("external")}
                      disabled={isUpdate}
                    />
                    <span className="ml-2 text-gray-700">
                      External (Google)
                    </span>
                  </label>
                </div>
                <div className="">
                  <label className="inline-flex items-center text-xs">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-[#43B09C] accent-teal-600"
                      name="toggleType"
                      value="internal"
                      checked={!isExternal}
                      onChange={() => handleToggle("internal")}
                      disabled={isUpdate}
                    />
                    <span className="ml-2 text-gray-700">Internal</span>
                  </label>
                </div>
              </div>
              <div className="flex flex-row justify-between items-center pb-4">
                <div className="p-3">
                  <div className="text-gray-400 text-xs">Save to Draft</div>
                </div>
                <div className="p-3">
                  <button
                    type="submit"
                    className="w-54 h-10 bg-[#43B09C] rounded text-xs text-white p-2"
                  >
                    {isUpdate
                      ? "Update Appointment"
                      : "Submit Your Appointment"}
                  </button>
                </div>
              </div>
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

const AddAppointment = ({
  toggleModal,
  fetchEvents,
  setShowAlert,
  show,
  appointmentDetail,
  isUpdate = false,
  isView = false,
  appointmentId = null,
}) => {
  const isFirefox = typeof InstallTrigger !== "undefined";

  const options = [
    { value: "15 mins before time", label: "15 mins before time" },
    { value: "on time", label: "on time" },
  ];
  const [selectedTime, setSelectedTime] = useState(null);

  const [isExternal, setIsExternal] = useState(true);

  // const {
  //   register,
  //   handleSubmit,
  //   setValue,
  //   formState: { errors },
  //   reset,
  // } = useForm({
  //   defaultValues: {
  //     type: "Group",
  //   },
  // });

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

  const stff = watch("staff");
  console.log({ stff });

  const encounterData = watch("linkedEncounterNotes");

  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [programsOptions, setProgramsOptions] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [activityOptions, setActivityOptions] = useState([]);
  const encounterOptionCache = useRef([]);
  const [encounterNotesOptions, setEncounterNotesOptions] = useState([]);
  const [encounterNotesList, setEncounterNotesList] = useState([]);
  const [clientsOption, setClientsOption] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);

  const [isTopicChecked, setIsTopicChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [appointmentData, setAppointmentData] = useState({});

  const [LastEncounterNote, setLastEncounterNote] = useState([]);

  const handleDateChange = (name, value) => {
    console.log({ name, value });
    if (name === "date") {
      const formattedDate = format(value, "MM-dd-yyyy");
      setDate(formattedDate);
    } else if (name === "start_time") {
      setStartTime(value);
    } else if (name === "end_time") {
      setEndTime(value);
    }
    setValue(name, value);
  };

  const handleDateTimeChange = (name, value) => {
    console.log({ name, value });
    setValue(name, value);
    setDate(value);
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);

    let postData = {
      // topic: data.topic,
      // type: data.type,
      meeting_title: data.meeting_title,
      start_time: date,
      duration: data.duration?.value || "0",
      description: data.description,
      // google_calendar_link: data.google_calendar_link,
      staff: data.staff?.value,
      facility: data.facility?.value,
      program: data.program?.value,
      activity: data.activity?.value,
      clients:
        selectedClients.length > 0
          ? selectedClients.map((itm) => itm.value)
          : [],
      linked_encounter_notes:
        data.linkedEncounterNotes?.map((itm) => itm.value) || [],
    };

    console.log({ postData, data });

    // let start_datetime = new Date(data.date);
    // start_datetime.setHours(data.start_time.getHours());
    // start_datetime.setMinutes(data.start_time.getMinutes());
    // start_datetime.setSeconds(data.start_time.getSeconds());

    // let end_datetime = new Date(data.date);
    // end_datetime.setHours(data.end_time.getHours());
    // end_datetime.setMinutes(data.end_time.getMinutes());
    // end_datetime.setSeconds(data.end_time.getSeconds());

    let endpoint = "/appointments/";
    let axiosCall = axios.post;

    console.log({ data });

    if (isUpdate) {
      endpoint = `/appointments/${appointmentId}/`;
      axiosCall = isUpdate ? axios.put : axios.post;
    }

    // let splittedAttendees = data.attendees.split(",").map((email) => {
    //   return {
    //     email,
    //   };
    // });

    // let event = {
    //   summary: data.appointement_title,
    //   start_datetime: start_datetime.toISOString(),
    //   end_datetime: end_datetime.toISOString(),
    //   attendees: splittedAttendees,
    // };

    axiosCall(`${apiURL}${endpoint}`, postData)
      .then((response) => {
        Swal.fire({
          title: "Success!",
          text: `Appointment ${isUpdate ? "Updated" : "Created"}`,
          icon: "success",
          timer: 2000,
        });
        setShowAlert && setShowAlert(true);
        setTimeout(() => {
          setShowAlert && setShowAlert(!true);
        }, [2500]);
        fetchEvents && fetchEvents();
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((error) => {
        console.error("Error", error);
        Swal.fire({
          title: "Error!",
          text: `Unable to ${isUpdate ? "Update" : "Create"} Appointment`,
          icon: "error",
          timer: 2000,
        });
      })
      .finally(() => {
        resetAll();
        setIsSubmitting(false);
        toggleModal();
      });
  };

  const handleToggle = (value) => {
    setIsExternal(value === "external");
  };

  const resetAll = () => {
    reset();
    setDate(null);
    setStartTime(null);
    setEndTime(null);
  };

  // useEffect(() => {
  //   if (isUpdate && show && appointmentDetail) {
  //     const { summary, start, end, fullEvent, isExternal } = appointmentDetail;
  //     setValue("appointement_title", summary);
  //     handleDateChange("date", start.dateTime); // Assuming start.dateTime contains date
  //     handleDateChange("start_time", new Date(start.dateTime));
  //     handleDateChange("end_time", new Date(end.dateTime));
  //     setValue(
  //       "attendees",
  //       fullEvent.attendees.map((attendee) => attendee.email).join(",")
  //     );
  //     setIsExternal(isExternal);
  //   } else {
  //     resetAll();
  //     setIsExternal(true);
  //   }
  // }, [show, isUpdate, appointmentDetail]);

  useEffect(() => {
    if (show) {
      fetchPrograms();
      fetchUsername();
      fetchClients();
      fetchFacilities();
      fetchActivity();
      fetchUsers();
    } else {
      resetAll();
    }
  }, [show]);

  useEffect(() => {
    if ((isView || isUpdate) && appointmentId) {
      fetchData();
    }
  }, [isView, isUpdate, appointmentId]);

  useEffect(() => {
    let cacheEncounterID = encounterOptionCache.current;
    const idsNeedToFetch = selectedClients.filter(
      (item) => !cacheEncounterID.includes(item.id)
    );

    idsNeedToFetch.map((itm) => fetchEncounterNotes(itm.id));
  }, [selectedClients]);

  function findObjectWithHighestID(arr) {
    let highestIDObject = null;
    let highestID = Number.NEGATIVE_INFINITY;

    for (const obj of arr) {
      let id = obj.id;

      // Convert the ID to a number if it is not already
      if (typeof id === "string") {
        id = parseFloat(id);
      }

      // Check if the id is a valid number
      if (!isNaN(id) && id > highestID) {
        highestID = id;
        highestIDObject = obj;
      }
    }

    // Return the object with the highest ID found
    // return highestIDObject;

    return highestID;
  }

  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/appointments/" + appointmentId
      );

      let setData = {
        topic: data.topic,
        type: data.type,
        meeting_title: data.meeting_title,
        start_time: data.start_time,
        duration: data.duration,
        description: data.description,
        google_calendar_link: data.google_calendar_link,
        staff: data.staff,
        facility: data.facility,
        program: data.program,
        activity: data.activity,
        clients: data.clients,
        linked_encounter_notes:
          data.linked_encounter_notes?.map((itm) => {
            return itm;
          }) || [],
      };
      handleDateTimeChange("date", data.start_time);
      setValue("duration", {
        label: 30,
        value: 30,
      });
      setValue("google_calendar_link", setData.google_calendar_link);
      setValue("topic", setData.topic);
      setIsTopicChecked(setData.topic);
      setValue("type", setData.type);
      setValue("meeting_title", setData.meeting_title);
      setValue("description", setData.description);
      console.log({ setData });
      setAppointmentData(setData);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching position titles:", error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await axiosInstance.get("/api/resources/program");
      setProgramsOptions(
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
      console.error("Error fetching position titles:", error);
    }
  };

  const fetchActivity = async () => {
    try {
      const response = await axiosInstance.get("/activities/");
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

  const fetchFacilities = async () => {
    try {
      const response = await axiosInstance.get("/api/resources/facilities");
      setFacilityOptions(
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
      console.error("Error fetching facilities :", error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get("/clientinfo-api");
      setClientsOption(
        response.data.map((itm) => {
          const label = `${itm?.first_name || ""} ${itm?.last_name || ""} ${
            itm?.date_of_birth ? "(" + itm?.date_of_birth + ")" : ""
          }`;

          console.log({ label });

          return {
            ...itm,
            label,
            value: itm?.id,
          };
        })
      );
    } catch (error) {
      // Handle errors here
      console.error("Error fetching client:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance("/encounter-notes-users/");
      const userListData = response.data.map((itm) => {
        return {
          ...itm,
          // label:
          // itm.first_name + " " + itm.last_name + " (" + itm.username + ")",
          label: itm.username,
          value: itm.id,
        };
      });
      setUsersList(userListData);

      return userListData;
    } catch (error) {
      // Handle errors here
      console.error("Error fetching User List:", error);
    }
  };

  const fetchEncounterNotes = async (id) => {
    try {
      encounterOptionCache.current = [...encounterOptionCache.current, id];
      const response = await axiosInstance.get(
        `/encounters-notes-client/${id}/`
      );

      let data = response.data.map((itm) => {
        return {
          ...itm,
          label: itm.encounter_summary_text_template || `ID : ${itm.id}`,
          value: itm.id,
        };
      });

      let highestID = findObjectWithHighestID(data);
      setLastEncounterNote((prev) => {
        return [...prev, highestID];
      });
      setEncounterNotesList((prev) => {
        let filtered = prev.filter((item) => item.id !== id);

        let newVal = [
          ...filtered,
          {
            id,
            data,
          },
        ];

        return newVal;
      });
      setEncounterNotesOptions((prev) => {
        return [...prev, ...data];
      });
    } catch (error) {
      // Handle errors here
      console.error("Error fetching client:", error);
    }
  };

  const fetchUsername = async () => {
    try {
      const response = await axiosInstance.get("/api/username");
      const users = await fetchUsers();

      const foundUser = users.find(
        (user) => user.username === response.data.username
      );
      console.log({ foundUser });
      if (foundUser) {
        setValue("staff", foundUser);
      }
    } catch (error) {
      // Handle errors here
      console.error("Error fetching all users:", error);
    }
  };

  useEffect(() => {
    if (appointmentData.program) {
      let found = programsOptions.find(
        (itm) => itm.id === appointmentData.program
      );
      if (found) {
        setValue("program", found);
      }
    }
  }, [programsOptions, isView, isUpdate, appointmentData]);

  useEffect(() => {
    if (appointmentData.facility) {
      let found = facilityOptions.find(
        (itm) => itm.id === appointmentData.facility
      );
      if (found) {
        setValue("facility", found);
      }
    }
  }, [facilityOptions, isView, isUpdate, appointmentData]);

  useEffect(() => {
    if (appointmentData.activity) {
      let found = activityOptions.find(
        (itm) => itm.id === appointmentData.activity
      );

      if (found) {
        setValue("activity", found);
      }
    }
  }, [activityOptions, isView, isUpdate, appointmentData]);

  useEffect(() => {
    if (appointmentData.clients) {
      let clients = clientsOption
        .filter((itm) => appointmentData.clients.includes(itm.id))
        .map((itm) => itm);

      console.log({ clients });
      setValue("clients", clients);
      setValue("client", clients);
      setSelectedClients(clients);
    }
  }, [clientsOption, isView, isUpdate, appointmentData]);

  useEffect(() => {
    if (appointmentData.linked_encounter_notes) {
      let item = encounterNotesOptions
        .filter((itm) =>
          appointmentData.linked_encounter_notes.includes(itm.id)
        )
        .map((itm) => itm);
      setValue("linkedEncounterNotes", item);
    }
  }, [encounterNotesOptions, isView, isUpdate, appointmentData]);

  useEffect(() => {
    if (appointmentData.staff) {
      let found = usersList.find((itm) => +appointmentData.staff === +itm.id);
      console.log({ found });
      if (found) {
        found = {
          ...found,
          label: found.username,
          vaue: found.id,
        };
        setValue("staff", found);
      }
    }
  }, [usersList, isView, isUpdate, appointmentData]);

  // const isTopicWatch = watch("topic");

  // useEffect(() => {
  //   if (isTopicWatch) {
  //     console.log("setting client to []");
  //     resetField("client", { defaultValue: [] });
  //     resetField("clients", { defaultValue: [] });
  //     setSelectedClients([]);
  //   }
  // }, [isTopicWatch]);

  const [errFields, setErrFields] = useState({});

  let disableEdit = isView;

  let emptyEncounterClient = encounterNotesList.find(
    (item) => item?.data?.length === 0
  );

  const defaultFormattedDate = useMemo(() => {
    return dayjs(date).format("YYYY-MM-DDTHH:mm:ss.SSS");
  }, [date]);

  const defaultFormattedDate_ff = useMemo(() => {
    return dayjs(date).format("YYYY-MM-DD");
  }, [date]);

  const defaultFormattedTime_ff = useMemo(() => {
    return dayjs(date).format("HH:mm");
  }, [date]);

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
              {isView
                ? "Appointment"
                : isUpdate
                ? "Update Appointment"
                : "Add New Appointment"}
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
            {/* <div className="mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("topic")}
                  disabled={disableEdit}
                  // onChange={(e) => setIsTopicChecked(e.target.checked)} // Update state on change
                />
                <label className="block mb-2">Topic</label>
              </div>
            </div> */}

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Client</label>
                <Controller
                  name="client"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      name="clients"
                      options={clientsOption}
                      isMulti
                      isDisabled={disableEdit}
                      onChange={(sel) => {
                        setSelectedClients(sel);
                        setValue("client", sel);
                      }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          padding: "3px",
                          border: `1px solid ${
                            !errFields.clients ? "#5BC4BF" : "red"
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
                  // rules={{ required: "Client is required" }}
                />
                {errors.client && (
                  <p className="text-red-500">{errors.client.message}</p>
                )}
              </div>
              <div>
                <label className="block mb-2">Staff</label>
                {/* <input
                  type="text"
                  className="form-control text-xs p-2.5 border-teal-500"
                  disabled
                  {...register("staff", {
                    // required: "Staff is required"
                  })}
                /> */}

                <Controller
                  name="staff"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={usersList}
                      isDisabled={disableEdit}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          padding: "3px",
                          border: `1px solid ${
                            !errFields.Facility ? "#5BC4BF" : "red"
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
                  rules={{ required: "Staff is required" }}
                />
                {errors.staff && (
                  <p className="text-red-500">{errors.staff.message}</p>
                )}
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Facility</label>
                <Controller
                  name="facility"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={facilityOptions}
                      isDisabled={disableEdit}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          padding: "3px",
                          border: `1px solid ${
                            !errFields.Facility ? "#5BC4BF" : "red"
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
                  rules={{ required: "Facility is required" }}
                />
                {errors.facility && (
                  <p className="text-red-500">{errors.facility.message}</p>
                )}
              </div>
              <div>
                <label className="block mb-2">Program</label>
                <Controller
                  name="program"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={programsOptions}
                      isDisabled={disableEdit}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          padding: "3px",
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
                    />
                  )}
                  rules={{ required: "Program is required" }}
                />
                {errors.program && (
                  <p className="text-red-500">{errors.program.message}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2">Activity</label>
              <Controller
                name="activity"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={activityOptions}
                    isDisabled={disableEdit}
                    className="w-100"
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        padding: "3px",
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
                  />
                )}
                rules={{ required: "Activity is required" }}
              />
              {errors.activity && (
                <p className="text-red-500">{errors.activity.message}</p>
              )}
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Type</label>
                <input
                  // disabled={disableEdit}
                  disabled={true}
                  type="text"
                  defaultValue=""
                  className="form-control text-xs p-2.5 border-teal-500"
                  {...register("type", {
                    // required: "Type is required"
                  })}
                />
                {errors.type && (
                  <p className="text-red-500">{errors.type.message}</p>
                )}
              </div>
              <div>
                <label className="block mb-2">Meeting Title</label>
                <input
                  disabled={disableEdit}
                  type="text"
                  className="form-control text-xs p-2.5 border-teal-500"
                  {...register("meeting_title", {
                    // required: "Meeting Title is required",
                  })}
                />
                {errors.meeting_title && (
                  <p className="text-red-500">{errors.meeting_title.message}</p>
                )}
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              {isFirefox ? (
                <>
                  <div>
                    <label className="block mb-2">Start Date</label>
                    {/* Your Date component should go here, replace <DateComponent /> with actual component */}
                    <input
                      className="text-xs p-2.5 border-[1px] rounded border-teal-500 w-100"
                      type="date"
                      name="firefox_date"
                      // placeholder="Date"
                      register={register}
                      disabled={disableEdit}
                      registerProps={{ required: true }}
                      value={defaultFormattedDate_ff}
                      onChange={(e) => {
                        const {
                          target: { value: date },
                        } = e;
                        const givenDate = dayjs(date);
                        const currentDate = dayjs();
                        const isBefore = givenDate.isBefore(currentDate);
                        if (isBefore) {
                          notify(
                            "You are trying to book an appointment in the past",
                            "warning",
                            {
                              position: "top-center",
                            }
                          );
                        }
                        console.log({ date });
                        handleDateTimeChange("dateTime", date);
                      }}
                    />
                    {/* <DateInput
                  name="dateTime"
                  // placeholder="Date"
                  register={register}
                  isEdittable={disableEdit}
                  registerProps={{ required: true }}
                  value={date}
                  handleDateTimeChange={(date) => {
                    console.log(date);
                    const givenDate = dayjs(date);
                    const currentDate = dayjs();
                    const isBefore = givenDate.isBefore(currentDate);
                    console.log({ givenDate, isBefore });
                    if (isBefore) {
                      notify(
                        "You are trying to book an appointment in the past",
                        "warning",
                        {
                          position: "top-center",
                        }
                      );
                    }
                    handleDateTimeChange("dateTime", date);
                  }}
                  showTime
                  className="hidxden text-xs p-2.5 border-teal-500"
                /> */}
                    {errors.firefox_date && (
                      <p className="text-red-500">
                        {errors.firefox_date.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2">Start Time</label>
                    {/* Your Date component should go here, replace <DateComponent /> with actual component */}
                    <input
                      className={`text-xs p-2.5 border-[1px] rounded border-teal-500 w-100 ${
                        !date ? "bg-gray-100" : ""
                      }`}
                      type="time"
                      name="firefox_time"
                      // placeholder="Date"
                      register={register}
                      disabled={disableEdit || !date}
                      registerProps={{ required: true }}
                      value={defaultFormattedTime_ff}
                      onChange={(e) => {
                        const {
                          target: { value: dtime },
                        } = e;
                        const givenDate = dayjs(date);
                        const currentDate = dayjs();
                        const isBefore = givenDate.isBefore(currentDate);
                        if (isBefore) {
                          notify(
                            "You are trying to book an appointment in the past",
                            "warning",
                            {
                              position: "top-center",
                            }
                          );
                        }
                        console.log(dtime);
                        const ndt = new Date(date);
                        ndt.setHours(dtime.split(":")[0]);
                        ndt.setMinutes(dtime.split(":")[1]);
                        ndt.setSeconds(0);
                        ndt.setMilliseconds(0);

                        // const selectedTime = new Date(dtime);
                        // const updatedDate = new Date(date);
                        // updatedDate.setHours(selectedTime.getHours());
                        // updatedDate.setMinutes(selectedTime.getMinutes());
                        // updatedDate.setSeconds(selectedTime.getSeconds());
                        // updatedDate.setMilliseconds(
                        //   selectedTime.getMilliseconds()
                        // );
                        // console.log({ time: updatedDate });
                        handleDateTimeChange("dateTime", ndt);
                      }}
                    />

                    {errors.firefox_time && (
                      <p className="text-red-500">
                        {errors.firefox_time.message}
                      </p>
                    )}

                    {!date ? (
                      <p className="text-xs mt-2">please pick a date</p>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block mb-2">Start Time</label>
                    {/* Your Date component should go here, replace <DateComponent /> with actual component */}
                    <input
                      className="text-xs p-2.5 border-[1px] rounded border-teal-500 w-100"
                      type="datetime-local"
                      name="dateTime"
                      // placeholder="Date"
                      register={register}
                      disabled={disableEdit}
                      registerProps={{ required: true }}
                      value={defaultFormattedDate}
                      onChange={(e) => {
                        const {
                          target: { value: date },
                        } = e;
                        const givenDate = dayjs(date);
                        const currentDate = dayjs();
                        const isBefore = givenDate.isBefore(currentDate);
                        if (isBefore) {
                          notify(
                            "You are trying to book an appointment in the past",
                            "warning",
                            {
                              position: "top-center",
                            }
                          );
                        }
                        handleDateTimeChange("dateTime", date);
                      }}
                    />
                    {/* <DateInput
                  name="dateTime"
                  // placeholder="Date"
                  register={register}
                  isEdittable={disableEdit}
                  registerProps={{ required: true }}
                  value={date}
                  handleDateTimeChange={(date) => {
                    console.log(date);
                    const givenDate = dayjs(date);
                    const currentDate = dayjs();
                    const isBefore = givenDate.isBefore(currentDate);
                    console.log({ givenDate, isBefore });
                    if (isBefore) {
                      notify(
                        "You are trying to book an appointment in the past",
                        "warning",
                        {
                          position: "top-center",
                        }
                      );
                    }
                    handleDateTimeChange("dateTime", date);
                  }}
                  showTime
                  className="hidxden text-xs p-2.5 border-teal-500"
                /> */}
                    {errors.dateTime && (
                      <p className="text-red-500">{errors.dateTime.message}</p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block mb-2">Duration</label>
                <Controller
                  name="duration"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={[30, 45, 60, 120, 180].map((value) => ({
                        value,
                        label: value,
                      }))}
                      isDisabled={disableEdit}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          padding: "3px",
                          border: `1px solid ${
                            !errFields.Facility ? "#5BC4BF" : "red"
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
                />
              </div>
            </div>

            {/* {isView && (
              <div>
                <div className="mb-4">
                  <label className="block mb-2">Google Calendar Link</label>
                  {!isView || isUpdate ? (
                    <input
                      type="text"
                      className="form-control text-xs p-2.5 border-teal-500"
                      disabled={disableEdit}
                      {...register("google_calendar_link", {
                        // required: "google_calendar_link is required"
                      })}
                    />
                  ) : (
                    <a
                      href={getValues("google_calendar_link")}
                      target="_blank"
                      className="hover:text-teal-700 text-teal-400"
                    >
                      {getValues("google_calendar_link") ||
                        "No Google Calendar Link Exist"}
                    </a>
                  )}
                  {errors.google_calendar_link && (
                    <p className="text-red-500">
                      {errors.google_calendar_link.message}
                    </p>
                  )}
                </div>
              </div>
            )} */}

            <div className="mb-4">
              <label className="block mb-2">Description</label>
              <textarea
                disabled={disableEdit}
                rows={5}
                {...register("description")}
                className="form-control text-xs p-2.5 border-teal-500"
              />
            </div>

            {/* {(isUpdate === false || isView === false) && (  
            <div className="mb-4">
              <div>
                <label className="block mb-2">Linked Encounter Notes</label>
                <Controller
                  name="linkedEncounterNotes"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={encounterNotesOptions}
                      isMulti
                      isDisabled={disableEdit}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          padding: "3px",
                          border: `1px solid ${
                            !errFields.Facility ? "#5BC4BF" : "red"
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
                />
              </div>
            </div>
           )} */}

            {!(isUpdate === false && isView === false) && (
              <div className="mb-4">
                <div className="flex flex-column gap-3">
                  <label className="block mb-2">Linked Encounter Notes</label>
                  <div className="flex flex-column gap-3 mt-2">
                    {encounterData && encounterData.length > 0 ? (
                      <div className="flex flex-wrap gap-2 items-center">
                        {encounterData
                          .filter((item) => {
                            /* OLD SNIPPET TO SHOW ONLY LATEST ON VIEW ONLY  */
                            // if (isView === true && isUpdate === false) {
                            //   return LastEncounterNote.includes(+item.id);
                            // }
                            // return item;

                            /* NEW WITH BOTH VIEW & EDIT ONLY LATEST */
                            return LastEncounterNote.includes(+item.id);
                          })
                          .map((item) => {
                            return (
                              <div className="text-xs my-1">
                                <a
                                  target="_blank"
                                  href={`/encounter-note/add/${item.client_id}/?encounterId=${item.id}&mode=edit`}
                                  className="p-1.5 px-2.5 text-black bg-gray-200 hover:text-slate-50 hover:bg-teal-400"
                                >
                                  {item.label}
                                </a>
                                {isView !== true && (
                                  <span
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      let newValue = encounterData.filter(
                                        (itm) => itm.id !== item.id
                                      );
                                      setValue(
                                        "linkedEncounterNotes",
                                        newValue
                                      );
                                    }}
                                    className="p-1.5 pr-2 text-black bg-gray-200 hover:bg-red-400 cursor-pointer"
                                  >
                                    x
                                  </span>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      "No Linked Encounter Notes"
                    )}
                    {isUpdate === true && isView === false && (
                      <Select
                        options={encounterNotesOptions}
                        isMulti
                        isDisabled={disableEdit}
                        placeholder="Select Encounter"
                        value={[]}
                        onChange={(value) => {
                          let selectedValue = [...value];
                          if (encounterData) {
                            let encounterDataIDs = encounterData.map(
                              (item) => item.id
                            );
                            let filteredSelectedValues = selectedValue.filter(
                              (item) => !encounterDataIDs.includes(item.id)
                            );
                            selectedValue = [
                              ...encounterData,
                              ...filteredSelectedValues,
                            ];
                          }
                          setValue("linkedEncounterNotes", selectedValue);
                        }}
                        styles={{
                          control: (styles) => ({
                            ...styles,
                            padding: "3px",
                            border: `1px solid ${
                              !errFields.linkedEncounterNotes
                                ? "#5BC4BF"
                                : "red"
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
                  </div>
                  {!isView && emptyEncounterClient && (
                    <a
                      href={`/encounter-note/add/${emptyEncounterClient.id}`}
                      className="rounded-sm mr-auto border-[1px] border-teal-700 p-1.5 px-2 text-teal-700 text-xs hover:bg-teal-700 hover:text-white"
                    >
                      Add New Encounter Notes
                    </a>
                  )}
                </div>
              </div>
            )}
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

export default AddAppointment;
