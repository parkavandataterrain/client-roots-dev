import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import BasicTable from "../../components/react-table/BasicTable";
import Tag from "../../components/Tag/Tag";
import { notifyError } from "../../helper/toastNotication";
import { protectedApi } from "../../services/api";
import { format } from "date-fns";
import PopupCard from "./PopupCard";

function ProfileSection() {
  const { clientId } = useParams();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const response = await protectedApi.get(
          `/api/client-profile/${clientId}/`
        );
        setProfile(response.data);
      } catch (err) {
        notifyError("Error fetching client profile");
        console.error(err);
      }
    };
    fetchClientInfo();
  }, []);

  return (
    <div className="flex my-6 gap-x-4">
      <img src="/profile_picture.svg" className="w-24" alt="" />

      <div className="flex flex-col justify-center gap-y-2">
        <div className="text-[#1A1F25] font-medium text-[22px]">
          {profile?.first_name || ""} {profile?.last_name || ""}
        </div>
        <div className="flex">
          <div className="flex items-center gap-x-2 border-r w-fit pr-2">
            <img src="/calendar2.svg" alt="" />
            <span className="text-sm">
              {profile?.date_of_birth
                ? format(new Date(profile.date_of_birth), "dd MMM yyyy")
                : ""}
            </span>
          </div>
          <div className="flex items-center gap-x-2 border-r w-fit pl-2">
            <img src="/navigator.svg" alt="" />
            <span className="text-sm">Navigator: {profile?.navigator}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableSection({ setPopupType }) {
  const { clientId } = useParams();
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await protectedApi.get(`/client-svs-all/${clientId}/`);
      setData(response.data);
    } catch (err) {
      notifyError("Error fetching svs data");
      console.error(err);
    }
  }, [clientId]);

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(() => {
    return [
      {
        Header: "Updated Date",
        accessor: "created_at",
        Cell: ({ value }) => (value ? format(value, "MM-dd-yyyy") : ""),
      },
      {
        Header: "Housing",
        accessor: "housing_risk",
        Cell: ({ value, row }) =>
          value && (
            <span
              className="hover:cursor-pointer"
              onClick={() =>
                setPopupType({
                  timestamp: row.original.time_stamp,
                  type: "Housing",
                })
              }
            >
              <Tag text={value} />
            </span>
          ),
      },
      {
        Header: "Food Access",
        accessor: "food_access_risk",
        Cell: ({ value, row }) =>
          value && (
            <span
              className="hover:cursor-pointer"
              onClick={() =>
                setPopupType({
                  timestamp: row.original.time_stamp,
                  type: "Food Access",
                })
              }
            >
              <Tag text={value} />
            </span>
          ),
      },
      {
        Header: "Financial Security",
        accessor: "financial_security_risk",
        Cell: ({ value, row }) =>
          value && (
            <span
              className="hover:cursor-pointer"
              onClick={() =>
                setPopupType({
                  timestamp: row.original.time_stamp,
                  type: "Financial Security",
                })
              }
            >
              <Tag text={value} />
            </span>
          ),
      },
      {
        Header: "Education/Employment",
        accessor: "employment_education_need",
        Cell: ({ value, row }) =>
          value && (
            <span
              className="hover:cursor-pointer"
              onClick={() =>
                setPopupType({
                  timestamp: row.original.time_stamp,
                  type: "Education/Employment",
                })
              }
            >
              <Tag text={value} />
            </span>
          ),
      },
      {
        Header: "Communication/Mobility",
        accessor: "communication_mobility_needed",
        Cell: ({ value, row }) =>
          value && (
            <span
              className="hover:cursor-pointer"
              onClick={() =>
                setPopupType({
                  timestamp: row.original.time_stamp,
                  type: "Communication/Mobility",
                })
              }
            >
              <Tag text={value} />
            </span>
          ),
      },
      {
        Header: "Preventive Care",
        accessor: "prevent_care_need",
        Cell: ({ value, row }) =>
          value && (
            <span
              className="hover:cursor-pointer"
              onClick={() =>
                setPopupType({
                  timestamp: row.original.time_stamp,
                  type: "Preventive Care",
                })
              }
            >
              <Tag text={value} />
            </span>
          ),
      },
      {
        Header: "Health Care - General Health",
        accessor: "gen_health_risk",
        Cell: ({ value, row }) =>
          value && (
            <span
              className="hover:cursor-pointer"
              onClick={() =>
                setPopupType({
                  timestamp: row.original.time_stamp,
                  type: "Health Care - General Health",
                })
              }
            >
              <Tag text={value} />
            </span>
          ),
      },
      {
        Header: "Health Care - Cardiovascular",
        accessor: "cardio_risk",
        Cell: ({ value, row }) =>
          value && (
            <span
              className="hover:cursor-pointer"
              onClick={() =>
                setPopupType({
                  timestamp: row.original.time_stamp,
                  type: "Health Care - Cardiovascular",
                })
              }
            >
              <Tag text={value} />
            </span>
          ),
      },
    ];
  }, []);

  return (
    <div className="my-8">
      <BasicTable
        type="svsPage"
        columns={columns}
        data={data}
        defaultPageSize={10}
        noMargin
      />
    </div>
  );
}

function Svs() {
  const [popupType, setPopupType] = useState(null);

  const open = useMemo(() => {
    return !!popupType;
  }, [popupType]);

  const handleClose = useCallback(() => {
    setPopupType(null);
  }, []);

  return (
    <>
      <div className="mx-4">
        <div className="text-[#1A1F25] font-medium text-2xl">
          Social Vital Signs
        </div>

        <div className="my-4 bg-white rounded-md border border-[#DBE0E5] w-full px-4">
          <ProfileSection />
          <TableSection setPopupType={setPopupType} />
        </div>
      </div>
      {open && (
        <PopupCard
          open={open}
          handleClose={handleClose}
          popupInfo={popupType}
        />
      )}
    </>
  );
}

export default Svs;
