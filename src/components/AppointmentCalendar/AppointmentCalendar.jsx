import React, { useEffect, useMemo, useCallback } from "react";
import { useState } from "react";
import ExternalLinkIcon from "../images/externalLink.svg";
import BasicTable from "../react-table/BasicTable";
import DocumentAddIcon from "../images/documentAdd.svg";
import EditIcon from "../images/edit.svg";
import EyeIcon from "../images/eye.svg";
import "./AppointmentCalendarStyles.css";

import useAppointments from "../../hooks/useAppointments";
import { getTodayUpcomingEvents } from "../utils";
import { Link } from "react-router-dom";
import axiosInstance from "../../helper/axiosInstance";

function AppointmentCalendar({ from }) {
  const { appointmentsList } = useAppointments(from);
  const [data, setData] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);

  const fetchClients = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/clientinfo-api");
      setClientOptions(
        response.data.map((itm) => ({
          ...itm,
          label: `${itm?.first_name || ""} ${itm?.last_name || ""} ${
            itm?.date_of_birth ? "(" + itm?.date_of_birth + ")" : ""
          }`,
          value: itm?.id,
        }))
      );
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    const upcomingEvents = getTodayUpcomingEvents(appointmentsList);
    const newData = upcomingEvents.map((event) => {
      const clients = clientOptions.filter((itm) =>
        event.clients.includes(itm.value)
      );

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

      const clientTopic =
        clients.length > 0
          ? `${clients[0].first_name} ${
              clients.length > 1 ? "+ " + (clients.length - 1) : ""
            }`
          : event.meeting_title || "No Title";

      return {
        time: `${startTime} - ${endTime}`,
        clientTopic,
        description: event.description || "",
        encounterMode: "...",
      };
    });
    setData(newData);
  }, [appointmentsList, clientOptions]);

  const columns = useMemo(
    () => [
      {
        Header: "Time",
        accessor: "time",
        align: "left",
      },
      {
        Header: "Client Topic",
        accessor: "clientTopic",
        align: "left",
      },
      {
        Header: "Descriptions",
        accessor: "description",
        align: "left",
      },
      {
        Header: "Encounter Mode",
        accessor: "encounterMode",
      },
      {
        Header: "Encounter Note",
        accessor: "encounterNote",
        Cell: () => (
          <div className="mx-auto flex justify-around items-center">
            <img src={DocumentAddIcon} alt="add" />
            <img src={EditIcon} alt="edit" />
            <img src={EyeIcon} alt="view" />
          </div>
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: () => (
          <div className="mx-auto flex justify-around space-x-2 items-center">
            <img src={EditIcon} alt="edit" />
            <img src={EyeIcon} alt="view" />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="w-full bg-white rounded-md shadow-md flex flex-col">
      <div className="flex justify-between items-center mx-3 sm:mx-8 mt-6">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <span className="text-lg font-medium">Appointment Calendar</span>
          <img
            src={ExternalLinkIcon}
            className="size-3 sm:size-4"
            alt="link"
          />
        </div>
        <div>
          <Link
            to="/calendar"
            className="px-3 py-1 border-1 sm:border-2 rounded-sm border-[#EBAC88] text-[#CB6A69] text-[13px] font-medium leading-5"
          >
            Create New
          </Link>
        </div>
      </div>
      <hr className="w-[98%] mx-auto my-2" />
      <div className="w-full flex-grow flex flex-col">
        <BasicTable
          type="appointmentCalendar"
          columns={columns}
          data={data}
        />
      </div>
    </div>
  );
}

export default React.memo(AppointmentCalendar);