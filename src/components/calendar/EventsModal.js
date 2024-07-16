import React, { useState } from "react";
import ClosePNG from "../images/close.png";
import GoogleIcon from "../images/google_icon.svg";
import EditIcon from "../images/edit.png";
import TrashIcon from "../images/delete.png";
import CalendarIcon from "../images/calendar-boxed.svg";
import InternalCalendarIcon from "../images/internal-meeting.svg";

import dayjs from "dayjs";
import { Modal } from "react-bootstrap";
import AddAppointment from "./addappointment";

const EventModal = ({
  show,
  eventDate,
  toggleModal,
  events = [],
  fetchEvents,
  deleteAppointment,
}) => {
  const [editEvent, setEditEvent] = useState(false);

  return (
    <Modal show={show} onHide={() => toggleModal()} centered>
      <Modal.Header className="m-0 p-3.5 w-100 text-black text-base bg-white font-medium">
        <Modal.Title className="m-0 p-0 w-100">
          <div className="flex justify-between items-center w-100">
            <span className="text-black text-base text-gray-600 font-semibold flex flex-row items-center gap-1">
              <span className="text-xs text-white bg-[#2F9384] p-1 px-2 rounded-md">
                {events.length}
              </span>
              <span>Appointments</span>
              <span className="text-xs">{`${
                eventDate ? `(${eventDate})` : ""
              }`}</span>
            </span>
            <button onClick={() => toggleModal()}>
              <img src={ClosePNG} className="w-5 h-5"></img>
            </button>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col border bg-white border-gray-500 rounded-md w-100">
          <div className="flex flex-col max-h-[50vh] overflow-y-auto p-2">
            <div className="flex flex-col divide-y divide-slate-200">
              {events.map((event, index) => {
                const startTime = dayjs(event.start.dateTime).format("hh:mm A");
                const endTime = dayjs(event.end.dateTime).format("hh:mm A");

                const isPast = dayjs().isAfter(event.start.dateTime);

                return (
                  <>
                    <div
                      key={index}
                      className="p-2 py-1 relative hover:bg-gray-100"
                    >
                      <a href={event.htmlLink} target="_blank">
                        <div
                          className={`flex flex-row gap-1 justify-between items-center w-full rounded-tl-sm rounded-tr-sm mx-1`}
                        >
                          <div className={`flex flex-row gap-1 items-start`}>
                            <img
                              src={
                                event.isExternal
                                  ? GoogleIcon
                                  : InternalCalendarIcon
                              }
                              className={
                                event.isExternal
                                  ? "size-8 sm:size-8"
                                  : "size-9 sm:size-9"
                              }
                              alt="event-meet"
                            />
                            <div className="text-left font-normal">
                              <p className="truncate text-xs m-0">
                                {event.summary}
                              </p>
                              <span className="truncate text-xs">
                                {startTime + "-" + endTime}
                              </span>
                            </div>
                          </div>
                          {!event.isExternal && (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                className="hover:bg-teal-400 rounded p-1.5 m-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setEditEvent(index);
                                }}
                              >
                                <img src={EditIcon} className="h-4 w-auto" />
                              </button>
                              <button
                                className="hover:bg-teal-400 rounded p-1.5 m-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  deleteAppointment(event.id);
                                }}
                              >
                                <img src={TrashIcon} className="h-4 w-auto" />
                              </button>
                            </div>
                          )}
                        </div>
                      </a>
                    </div>
                    <AddAppointment
                      show={editEvent === index}
                      toggleModal={() => setEditEvent(null)}
                      setShowAlert={null}
                      fetchEvents={fetchEvents}
                      appointmentDetail={event}
                      appointmentId={event.id}
                      isUpdate
                    />
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EventModal;
