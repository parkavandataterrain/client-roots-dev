import React, { useEffect, useState, useMemo } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import "./AppointmentStyles.css";
import useAppointments from "../../hooks/useAppointments";
import { getUpcomingEvents } from "../utils";
import { Link } from "react-router-dom";
import AppointmentDetail, {
  AppointmentDetail_Modal,
} from "./AppointmentDetail";
import AddAppointment from "../calendar/addappointment";
import axiosInstance from "../../helper/axiosInstance";

const AppointmentItem = ({ id, event, fetchEvents, clientList }) => {
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(false);
  const [viewEvent, setViewEvent] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Extract start and end times
  const startTime = new Date(event.start.dateTime).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const endTime = new Date(event.end.dateTime).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const clients = useMemo(() => {
    let foundList = clientList.filter((itm) =>
      event.clients.includes(itm.value)
    );
    return foundList;
  }, [clientList]);

  let showAppointment = editEvent === id;
  if (viewEvent === id) {
    showAppointment = true;
  }

  return (
    <>
      <div className="flex justify-between gap-x-2">
        <div className="flex gap-2">
          <div
            id={`appointment-${event.id ? event.id : id}`}
            className="flex flex-col justify-center items-center w-[40px] h-[40px] sm:w-12 sm:h-12 bg-[#89D6DE] text-white p-2"
          >
            <span className="text-[14px] sm:text-base">
              {new Date(event.start.dateTime).getDate()}
            </span>
            <span className="text-[8px] sm:text-base">
              {new Date(event.start.dateTime).toLocaleString("default", {
                month: "short",
              })}
            </span>
          </div>
          <div
            id={`appointment-${event.id ? event.id : id}`}
            className="space-y-0.5"
          >
            <div className="flex justify-between items-center">
              <Link
                to="#"
                target="_blank"
                className="text-[13px] sm:text-sm font-medium truncate"
                style={{
                  display: "block",
                  maxWidth: "50%",
                  wordBreak: "break-word",
                }}
              >
                {/* {event.topic
                ? event.meeting_title
                : clients.length > 0
                ? `${clients[0].first_name} ${
                    clients.length > 1 ? "& " + clients.length : ""
                  }`
                : "No Clients"} */}

                {clients.length > 0
                  ? `${clients[0].first_name} ${

                      clients.length > 1 ? "+ " + clients.length : ""
                  }`
                  : event.meeting_title || "No Title"}
                {/* {event.summary || "Untitled Appointment"} */}
              </Link>
              <button
                onClick={() => setShowModal(true)}
                className="px-2.5 sm:px-4 py-1.5 rounded-sm text-white h-fit w-fit bg-[#43B09C] text-[10px] sm:text-xs font-medium"
              >
                Details
              </button>
            </div>
            <div className="text-[11px] sm:text-xs py-1 flex flex-wrap gap-1">
              <span>Created by:</span>
              <span className="sm:w-100 w-[125px] text-xs md:truncate">
                {event.creator && event.creator.email
                  ? event.creator.email
                  : ""}
              </span>
            </div>
            <div className="text-[9px] sm:text-xs">
              {startTime} to {endTime}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <AppointmentDetail_Modal
          showPreview={showModal}
          toggleModal={toggleModal}
          event={event}
          // toggleEdit={() => setEditEvent(true)}
          toggleEdit={() => {
            setEditEvent(id);
            setViewEvent(null);
          }}
          toggleView={() => {
            setEditEvent(null);
            setViewEvent(id);
          }}
        />
      )}

      <AddAppointment
        show={showAppointment}
        toggleModal={() => {
          setViewEvent(null);
          setEditEvent(null);
        }}
        setShowAlert={null}
        fetchEvents={fetchEvents}
        appointmentDetail={event}
        appointmentId={event.id}
        isUpdate={editEvent === id}
        isView={viewEvent === id}
      />
    </>
  );
};

function Appointment() {
  const {
    eventList,
    fetchAppointments: fetchEvents,
    appointmentsList,
  } = useAppointments();

  let upcomingEvents = getUpcomingEvents(appointmentsList);

  console.log({ upcomingEvents });

  const [clientOption, setClientsOption] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get("/clientinfo-api");
      setClientsOption(
        response.data.map((itm) => {
          const label = `${itm?.first_name || ""} ${itm?.last_name || ""} ${
            itm?.date_of_birth ? "(" + itm?.date_of_birth + ")" : ""
          }`;

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

  return (
    <div className="bg-white w-full rounded-md shadow-md sm:col-span-8">
      <div className="flex justify-between items-center mx-3 sm:mx-6 mt-6 mb-2">
        <div id="appointment-1" className="text-lg font-medium">
          Upcoming
        </div>
        <Link
          to="/calendar"
          id="appointment-2"
          className="flex justify-center items-center space-x-1 bg-[#5BC4BF] text-white px-2.5 py-1 sm:py-1.5 my-1.5 sm:my-0 text-xs rounded-sm"
        >
          <AddCircleIcon
            id="appointment-3"
            className="text-white size-3 sm:size-4"
          />

          <span className="text-[10px] sm:text-xs">New Appointment</span>
        </Link>
      </div>
      <hr id="appointment-HR" className="w-11/12 mx-auto my-2" />
      <div className="flex flex-col justify-between space-y-6 mx-3 my-8">
        {upcomingEvents?.slice(0, 5).map((event, idx) => (
          <AppointmentItem
            key={event.id}
            event={event}
            id={idx}
            fetchEvents={fetchEvents}
            clientList={clientOption}
          />
        ))}
      </div>
    </div>
  );
}

export default Appointment;
