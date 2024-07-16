import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";

import PageTitle from "../PageTitle/PageTitle";
import ClientInformation from "./ClientInformation";
import SideBar from "./SideBar";
import SvsContent from "./SvsContent";
import Graph from "./Graph";
import Stats from "./Stats";
import apiURL from "../../apiConfig";

const SocialVitalSignsMain = () => {
  const { clientId } = useParams();
  const [contentToShow, setContentToShow] = useState("");
  const [questions, setQuestions] = useState();
  const [answers, setAnswers] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const housingData = {
    id: 4,
    current_residence_description: "Couch surfing",
    location_if_no_housing: "Oakland, Hayward ",
    slept_in_emergency_shelter: "Every Day",
    housing_risk: "High",
    client_id: 5,
  };

  console.log({ clientId });
  const token = localStorage.getItem("access_token");
  // const location = useLocation();
  // const { domain } = location?.state;
  // console.log("domain", props.location?.state);
  // console.log("domain", domain);
  // const location = useLocation();
  // const { fromNotifications } = location.state || {};
  // console.log("fromNotifications", fromNotifications);

  const location = useLocation();
  const { state } = location;

  console.log("location.state", location.state);
  console.log("location.pathname", location.pathname);

  useEffect(() => {
    axios
      .get(`${apiURL}/api/clientsvsquestions/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDataLoaded(true);
        setQuestions(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching SVS Questions:", error);
      });

    axios
      .get(`${apiURL}/api/clientsvsfull/${clientId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log("answers", response.data);
        setAnswers(response.data);
        console.log("answers", answers[0]);
      })
      .catch((error) => {
        console.error("Error fetching SVS Questions:", error);
      });
  }, [clientId]);

  useEffect(() => {
    setContentToShow(location.state || "Housing");
    console.log("contentToShow", contentToShow);
  }, []);

  return (
    <div className="flex flex-col space-y-8">
      <PageTitle clientId={clientId} title={"Client Social Vital Signs"} />
      <ClientInformation />
      <div className="grid grid-cols-12 grid-rows-2 gap-x-4 p-2">
        <div className="col-span-4 space-y-8">
          <SideBar
            contentToShow={contentToShow}
            setContentToShow={setContentToShow}
          />
          <Stats />
        </div>
        {dataLoaded && (
          <div className="col-span-8 space-y-8">
            {contentToShow === "Housing" && (
              <SvsContent
                title={"Housing"}
                questions={questions}
                data={answers}
              />
            )}
            {contentToShow === "Food Access" && (
              <SvsContent
                title={"Food Access"}
                questions={questions}
                data={answers}
              />
            )}
            {contentToShow === "Financial Security" && (
              <SvsContent
                title={"Financial Security"}
                questions={questions}
                data={answers}
              />
            )}
            {contentToShow === "Education/Employment" && (
              <SvsContent
                title={"Education/Employment"}
                questions={questions}
                data={answers}
              />
            )}
            {contentToShow === "Communication and Mobility" && (
              <SvsContent
                title={"Communication and Mobility"}
                questions={questions}
                data={answers}
              />
            )}
            {contentToShow === "Healthcare - Preventive" && (
              <SvsContent
                title={"Healthcare - Preventive"}
                questions={questions}
                data={answers}
              />
            )}
            {contentToShow === "Healthcare - General Health" && (
              <SvsContent
                title={"Healthcare - General Health"}
                questions={questions}
                data={answers}
              />
            )}
            {contentToShow === "Healthcare - Cardiovascular  risk" && (
              <SvsContent
                title={"Healthcare - Cardiovascular risk"}
                questions={questions}
                data={answers}
              />
            )}
            <Graph />
          </div>
        )}
      </div>
      {/* <div className="col-span-4"> */}
      {/* <SideBar setContentToShow={setContentToShow} /> */}
      {/* </div> */}
    </div>
  );
};

export default SocialVitalSignsMain;
