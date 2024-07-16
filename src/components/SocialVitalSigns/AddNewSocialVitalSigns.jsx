import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

import PageTitle from "../PageTitle/PageTitle";
import ClientInformation from "./ClientInformation";
import SideBar from "./SideBar";
import SvsContent from "./SvsContent";
import SvsQAContent from "./SvsQAContent";
import Graph from "./Graph";
import Stats from "./Stats";
import apiURL from "../../apiConfig";
import AlertSuccess from "../common/AlertSuccess";
import { useNavigate } from "react-router-dom";
import { protectedApi } from "../../services/api";

const AddNewSocialVitalSigns = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [contentToShow, setContentToShow] = useState("");
  const [questions, setQuestions] = useState();
  const [answers, setAnswers] = useState({
    svs_home: {
      current_residence_description: "",
      location_if_no_housing: "",
      slept_in_emergency_shelter: "",
    },
    svs_food: {
      fruit_servings_per_day: "",
      vegetable_portions_per_day: "",
      primary_food_source: "",
      worried_food_run_out: "",
      food_bought_didnt_last: "",
    },
    financial_security: {
      difficulty_paying_bills: "",
      income_covers_expenses: "",
      skip_meals_due_to_finance: "",
      calworks_benefits: "",
      social_security_disability_insurance: "",
      general_assistance: "",
      calfresh_benefits: "",
      wic_benefits: "",
      unemployment_benefits: "",
      state_disability_insurance_benefits: "",
      rental_assistance_benefits: "",
    },
    education_employment: {
      education_level: "",
      work_situation: "",
      employer_name_location: "",
      participating_in_education_program: "",
      program_name: "",
      past_program_name_dates_attended: "",
    },
    communication_mobility: {
      user_phone: "",
      difficulty_transportation: "",
      help_available: "",
      transportation_mode: "",
    },
    healthcare_preventiative: {
      health_insurance: "",
      plan_name: "",
      primary_care_doc: "",
      last_doc_visit: "",
      doc_name_loc: "",
      screening_tests: "",
      last_year_screen: "",
      regular_dentist: "",
      last_dent_visit: "",
      case_manager: "",
      case_mgr_name_location: "",
    },
    healthcare_general_health: {
      gen_health: "",
      non_active_length: "",
      emergency_visit: "",
    },
    healthcare_cardiovascular_risk: {
      med_diag: "",
      engage_exercise: "",
      min_exercise: "",
      do_you_smoke: "",
      cig_per_day: "",
      use_nicotine: "",
      last_smoke: "",
      smoke_freq: "",
    },
  });

  const [dataLoaded, setDataLoaded] = useState(false);

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

  // useEffect(() => {
  //   axios
  //     .get(`${apiURL}/api/clientsvsquestions/`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((response) => {
  //       setDataLoaded(true);
  //       setQuestions(response.data);
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching SVS Questions:", error);
  //     });

  //   axios
  //     .get(`${apiURL}/api/clientsvsfull/${clientId}/`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((response) => {
  //       // console.log("answers", response.data);
  //       setAnswers(response.data);
  //       console.log("answers", answers[0]);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching SVS Questions:", error);
  //     });
  // }, [clientId]);

  useEffect(() => {
    setContentToShow(location.state);
    console.log("contentToShow", contentToShow);
  }, []);

  let stages = [
    {
      stageIndex: 0,
      id: "svs_home",
      title: "Housing",
      qa: HOUSEING_QA,
    },
    {
      stageIndex: 1,
      id: "svs_food",
      title: "Food Access",
      qa: FOOD_ACCESS_QA,
    },
    {
      stageIndex: 2,
      id: "financial_security",
      title: "Financial Security",
      qa: FINANCIAL_SECURITY_QA,
    },
    {
      stageIndex: 3,
      id: "education_employment",
      title: "Education/Employment",
      qa: EDUCATION_EMPLOYEMENT_QA,
    },
    {
      stageIndex: 4,
      id: "communication_mobility",
      title: "Communication and Mobility",
      qa: COMMUNICATIONN_AND_MOBILITY_QA,
    },
    {
      stageIndex: 5,
      id: "healthcare_preventiative",
      title: "Healthcare - Preventive",
      qa: HEALTHCARE_PREVENTIVE_QA,
    },
    {
      stageIndex: 6,
      id: "healthcare_general_health",
      title: "Healthcare - General Health",
      qa: HEALTHCARE_GENERAL_HEALTH_QA,
    },
    {
      stageIndex: 7,
      id: "healthcare_cardiovascular_risk",
      title: "Healthcare - Cardiovascular risk",
      qa: HEALTHCARE_CARDIOVASCULAR_RISK_QA,
    },
  ];

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const goToPreviousStage = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(currentStageIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToNextStage = () => {
    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStage = (stageIndex) => {
    setCurrentStageIndex(stageIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnswers = (sectionID, questionID, value) => {
    setAnswers((prev) => {
      return {
        ...prev,
        [sectionID]: { ...prev[sectionID], [questionID]: value },
      };
    });
  };

  const handleSubmit = () => {
    // need to change endpoint
    let endpoint = "/clientsvsfull/";
    let data = {
      client_id: clientId,
      ...answers,
    };
    protectedApi
      .post(`${apiURL}/api${endpoint}`, data)
      .then((response) => {
        setShowAlert(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        // setTimeout(() => {
        //   navigate(-1);
        // }, 3000);
      })
      .catch((error) => {
        console.error("Error Submitting SVS Data:", error);
      });
  };

  // const currentStage = stages[currentStageIndex];

  return (
    <>
      {showAlert && (
        <AlertSuccess
          message="New Social Vital Sign Created !"
          handleClose={() => {
            setShowAlert(false);
          }}
        />
      )}
      <div className="flex flex-col space-y-8">
        <PageTitle clientId={clientId} title={"Client Social Vital Signs"} />
        <ClientInformation />
        <div
          className={`${
            showAlert ? "hidden" : ""
          } grid grid-cols-12 grid-rows-2 gap-x-4 p-2`}
        >
          <div className="col-span-4 space-y-8">
            <SideBar
              isQA={true}
              currentStage={stages[currentStageIndex]}
              stages={stages}
              handleStage={handleStage}
              contentToShow={contentToShow}
              setContentToShow={setContentToShow}
            />
          </div>

          <div className="col-span-8 space-y-8">
            <SvsQAContent
              isStart={stages[currentStageIndex].stageIndex === 0}
              isEnd={stages[currentStageIndex].stageIndex === stages.length - 1}
              stageIndex={stages[currentStageIndex].stageIndex}
              title={stages[currentStageIndex].title}
              questions={stages[currentStageIndex].qa}
              sectionID={stages[currentStageIndex].id}
              data={answers[stages[currentStageIndex].id]}
              handleAnswers={handleAnswers}
              goToPreviousStage={goToPreviousStage}
              goToNextStage={goToNextStage}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewSocialVitalSigns;

let HOUSEING_QA = [
  {
    id: "current_residence_description",
    question: "Which of the following best describes the place you live now?",
    inputType: "Radio",
    options: [
      "Own a house or apartment",
      "Rent a house or apartment",
      "Hotel",
      "A Treatment Facility or Group Home",
      "An Emergency Shelter",
      "Couch Surfing",
      "I have no housing",
    ],
  },
  {
    id: "location_if_no_housing",
    question:
      "If “I have no housing” was selected, please specify your location?",
    inputType: "Text",
  },
  {
    id: "slept_in_emergency_shelter",
    question:
      "Over the past 3 months, did you ever have to sleep in an emergency shelter, in a vehicle, or on the street or park, or stay temporarily with friends because of the lack of housing?",
    inputType: "Radio",
    options: [
      "Never",
      "Once or Twice",
      "Several Days",
      "Most Days",
      "Every Day",
    ],
  },
  // {
  //   id: "housing-review",
  //   question: "Review notes",
  //   inputType: "Text",
  // },
];

let FOOD_ACCESS_QA = [
  {
    id: "fruit_servings_per_day",
    question:
      "How many pieces or servings of fruit, any sort, do you eat on a typical day?",
    inputType: "Radio",
    options: ["None", "One", "Two", "Three or more"],
  },
  {
    id: "vegetable_portions_per_day",
    question:
      "How many portions of vegetables, excluding potatoes, do you eat on a typical day? ",
    inputType: "Radio",
    options: ["None", "One", "Two", "Three or more"],
  },
  {
    id: "primary_food_source",
    question: "Where do you get the majority of your food?",
    inputType: "Radio",
    options: [
      "Grocery",
      "Farmer's Market",
      "Fast food",
      "Corner store/convenience store",
      "Food pantry",
    ],
  },
  {
    id: "worried_food_run_out",
    question:
      "Within the past 12 months, we worried whether our food would run out before we got money to buy more?",
    inputType: "Radio",
    options: ["Never", "Sometimes", "Often"],
  },
  {
    id: "food_bought_didnt_last",
    question:
      "Within the past 12 months, how often did your food not last and you didn't have money to get more?",
    inputType: "Radio",
    options: ["Never", "Sometimes", "Often"],
  },
  // {
  //   id: "food-access-review",
  //   question: "Review notes",
  //   inputType: "Text",
  // },
];

let EDUCATION_EMPLOYEMENT_QA = [
  {
    id: "education_level",
    question: "What is the highest level of education you have completed?",
    inputType: "Radio",
    options: [
      "None",
      "Up to 8th grade",
      "Some high school",
      "High school diploma",
      "GED",
      "Trade/tech/vocational training",
      "Associate degree",
      "Some college",
      "Bachelor's degree",
      "Graduate/prof. degree",
    ],
  },
  {
    id: "work_situation",
    question:
      "Which of the following best describes your work situation today?",
    inputType: "Radio",
    options: [
      "I am employed full-time",
      "I am employed part-time",
      "I am self-employed",
      "I do odd jobs/occasional work",
      "I am unemployed, but looking for work",
      "I am unemployed but not looking for work",
      "I care for a child or family member full time",
      "I am temporarily disabled",
      "I am permanently disabled",
      "I am retired from work",
    ],
  },
  {
    id: "employer_name_location",
    question:
      "If you are employed full-time or part-time, what is the name and location of your employer?",
    inputType: "Text",
  },
  {
    id: "participating_in_education_program",
    question:
      "Are you currently participating in an educational or training program to improve your work opportunities?",
    inputType: "Radio",
    options: [
      "Yes",
      "No, but I would like to",
      "No, and I am not interested",
      "No, but I have in the past",
    ],
  },
  {
    id: "program_name",
    question:
      "If you selected 'Yes', What is the name of the program or school?",
    inputType: "Text",
  },
  {
    id: "past_program_name_dates_attended",
    question:
      "If you selected 'No, but I have in the past', what is the name of the program and the dates/years attended?",
    inputType: "Text",
  },
  // {
  //   id: "education-employment-7",
  //   question: "Employment/Education Need",
  //   inputType: "Text",
  // },
];

let FINANCIAL_SECURITY_QA = [
  {
    id: "difficulty_paying_bills",
    question:
      "Over the past 3 months, did you ever have difficulties in paying your bills for expenses like housing, utilities, child care, transportation, telephone, medical care, or other basic needs?",
    inputType: "Radio",
    options: ["Never", "One Month", "Two Months", "Every Month"],
  },
  {
    id: "income_covers_expenses",
    question: "Does your income generally cover your basic household expenses?",
    inputType: "Radio",
    options: ["Yes", "No"],
  },
  {
    id: "skip_meals_due_to_finance",
    question:
      "Over the past 3 months, did you ever cut the size of your meals or skip meals, because there wasn't enough money for food?",
    inputType: "Radio",
    options: [
      "Never",
      "Once or Twice",
      "Several Days",
      "Most Days",
      "Every Day",
    ],
  },

  {
    id: "financial-security-4",
    question:
      "Have you applied for or do you receive benefits or cash assistance from any of the following programs?",
    inputType: "GroupSelect",
    group: [
      {
        id: "calworks_benefits",
        question: "Calworks Benefits (TANF)",
        options: ["Receiving", "Pending", "Applied & Denied", "Never Applied"],
      },

      {
        id: "social_security_disability_insurance",
        question: "Social Security Disability Insurance (SSI)",
        options: ["Receiving", "Pending", "Applied & Denied", "Never Applied"],
      },
      {
        id: "general_assistance",
        question: "General Assistance (GA)",
        options: ["Receiving", "Pending", "Applied & Denied", "Never Applied"],
      },

      {
        id: "calfresh_benefits",
        question: "CalFresh Benefits (SNAP)",
        options: ["Receiving", "Pending", "Applied & Denied", "Never Applied"],
      },
      {
        id: "wic_benefits",
        question: "Women, Infant & Children Benefits (WIC)",
        options: ["Receiving", "Pending", "Applied & Denied", "Never Applied"],
      },

      {
        id: "unemployment_benefits",
        question: "Unemployment Benefits",
        options: ["Receiving", "Pending", "Applied & Denied", "Never Applied"],
      },
      {
        id: "state_disability_insurance_benefits",
        question: "State Disability Insurance Benefits (SDI)",
        options: ["Receiving", "Pending", "Applied & Denied", "Never Applied"],
      },

      {
        id: "rental_assistance_benefits",
        question: "Rental Assistance Benefits (e.g. Section 8 housing)",
        options: ["Receiving", "Pending", "Applied & Denied", "Never Applied"],
      },
    ],
  },

  // {
  //   id: "financial-security-5",
  //   question: "Review notes",
  //   inputType: "Text",
  //   options: [],
  // },
];

let COMMUNICATIONN_AND_MOBILITY_QA = [
  {
    id: "user_phone",
    question: "Do you have a personal phone where we can easily reach you?",
    inputType: "Radio",
    options: ["Yes", "No"],
  },
  {
    id: "difficulty_transportation",
    question:
      "Over the past year, did you ever have difficulty going to work, school, shopping, or an appointment, because the lack of convenient transportation?",
    inputType: "Radio",
    options: [
      "Never",
      "Once or Twice",
      "Several Days",
      "Most Days",
      "Every Day",
    ],
  },
  {
    id: "help_available",
    question:
      "Is there someone now that you can depend on if you ever needed help to do a task, like getting a ride somewhere, or help with shopping or cooking a meal?",
    inputType: "Radio",
    options: ["Yes", "No", "Don't Know"],
  },
  {
    id: "transportation_mode",
    question:
      "Which of the following modes of transportation will you typically use to get to Roots?",
    inputType: "Radio",
    options: [
      "Public Transportation",
      "My own car",
      "Ride from friend/family",
      "Walk, but I live within 1 mile",
      "Walk, but I live more than 1 mile away",
    ],
  },
  // {
  //   id: "communication-and-mobility-5",
  //   question: "Communication/Mobility Need",
  //   inputType: "Text",
  // },
  // {
  //   id: "communication-and-mobility-6",
  //   question: "Review notes",
  //   inputType: "Text",
  // },
];

let HEALTHCARE_PREVENTIVE_QA = [
  {
    id: "health_insurance",
    question: "Do you currently have health insurance?",
    inputType: "Radio",
    options: ["Yes", "No"],
  },
  {
    id: "plan_name",
    question: "What is the plan name?",
    inputType: "Text",
  },
  {
    id: "primary_care_doc",
    question: "Do you have a regular primary care doctor?",
    inputType: "Radio",
    options: ["Yes", "No"],
  },
  {
    id: "last_doc_visit",
    question: "When did you last see your doctor?",
    inputType: "Text",
  },
  {
    id: "doc_name_loc",
    question: "What is the name of the doctor and location?",
    inputType: "Text",
  },
  {
    id: "screening_tests",
    question: "Have you had any of the following preventative screening tests?",
    inputType: "Text",
  },
  {
    id: "last_year_screen",
    question:
      "If selected any of the above screenings, please list the last year of screening?",
    inputType: "Text",
  },
  {
    id: "regular_dentist",
    question: "Do you have a regular dentist?",
    inputType: "Radio",
    options: ["Yes", "No"],
  },
  {
    id: "last_dent_visit",
    question: "If yes, when did you last see your dentist?",
    inputType: "Text",
  },
  {
    id: "case_manager",
    question:
      "Do you have a case manager or social worker who helps you manage your healthcare?",
    inputType: "Radio",
    options: ["Yes", "No"],
  },
  {
    id: "case_mgr_name_location",
    question: "If yes, what is their name and location?",
    inputType: "Text",
  },
  // {
  //   id: "healthcare-preventive-12",
  //   question: "Preventative Care Need",
  //   inputType: "Text",
  // },
  // {
  //   id: "healthcare-preventive-13",
  //   question: "Review notes",
  //   inputType: "Text",
  // },
];

let HEALTHCARE_GENERAL_HEALTH_QA = [
  {
    id: "gen_health",
    question: "In general, would you say your health is",
    inputType: "Radio",
    options: ["Fair", "Very Good", "Good", "Poor"],
  },
  {
    id: "non_active_length",
    question:
      "During the past month, how often did poor physical health keep you from doing your usual activities, work, or recreation?",
    inputType: "Radio",
    options: ["Never", "Some days"],
  },
  {
    id: "emergency_visit",
    question:
      "Over the past year, how many times did you go to the emergency room (regular or psych emergency)?",
    inputType: "Radio",
    options: ["None", "Once", "Twice", "Three times", "Four or more times"],
  },
  // {
  //   id: "healthcare-general-health-5",
  //   question: "Health Care - General Health Risk",
  //   inputType: "Text",
  // },
  // {
  //   id: "healthcare-general-health-6",
  //   question: "Review Notes",
  //   inputType: "Text",
  // },
];

let HEALTHCARE_CARDIOVASCULAR_RISK_QA = [
  {
    id: "med_diag",
    question:
      "Have you ever been diagnosed with any of the following medical conditions? (check all that apply)?",
    inputType: "Radio",
    options: [
      "Allergies",
      "Anemia",
      "Arthritis",
      "Asthma",
      "Cancer",
      "Congestive heart failure",
      "Diabetes",
      "Emphysema",
      "Heart disease",
      "Hepatitis",
      "High cholesterol",
      "High blood pressure",
      "Kidney disease",
      "Chronic pain",
      "Enlarged prostate",
      "Seizure",
      "Sexually transmitted disease",
      "None",
    ],
  },
  {
    id: "engage_exercise",
    question:
      "On average, how many days per week do you engage in moderate to strenuous exercise (like walking fast, running, jogging, dancing, swimming, biking, or other activities that cause a light or heavy sweat)?",
    inputType: "Text",
  },
  {
    id: "min_exercise",
    question:
      "On average, how many minutes per day do you engage in moderate to strenuous exercise (like walking fast, running, jogging, dancing, swimming, biking, or other activities that cause a light or heavy sweat)?",
    inputType: "Text",
  },
  {
    id: "do_you_smoke",
    question: "Do you smoke cigarettes?",
    inputType: "Radio",
    options: ["Yes", "No"],
  },
  {
    id: "cig_per_day",
    question: "If yes, how many cigarettes do you smoke per day?",
    inputType: "Text",
  },
  {
    id: "use_nicotine",
    question:
      "Do you use any tobacco or nicotine products besides cigarettes, such as chewing tobacco, snuff, cigars, or e-cigarettes?",
    inputType: "Radio",
    options: ["Yes", "No"],
  },
  {
    id: "last_smoke",
    question: "When was the last time you smoked?",
    inputType: "Text",
  },
  {
    id: "smoke_freq",
    question: "How frequently do you smoke?",
    inputType: "Text",
  },
  // {
  //   id: "healthcare-cardiovascular-risk-9",
  //   question: "Review Notes",
  //   inputType: "Text",
  // },
];
