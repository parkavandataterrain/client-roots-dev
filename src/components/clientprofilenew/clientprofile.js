import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Sidebar.css";

import Sidebar from "./SideBar";
import GeneralInformation from "./General_Information";
import ContactInformation from "./ContactInformation";
import Demographics from "./Demographics";
import AddressInformation from "./Address";
import CustomFields from "./CustomFields";
import PreferredPharmacy from "./PreferredPharmacy";
import InsuranceInformation from "./InsuranceInformation";
import SystemInformation from "./SystemInformation";
import AlertSuccess from "../common/AlertSuccess";
import AlertError from "../common/AlertError";
import { useParams } from "react-router-dom";
import axios from "axios";
import EditPNG from "../images/edit.png";
import SavePNG from "../images/save.png";
import EditGreenPNG from "../images/edit-green.png";
import SaveGreenPNG from "../images/save-green.png";
// import DynamicFieldForm from './clientprofile/dynamicfield'

import MyComponent from "../clientprofilefull";
import apiURL from "../../apiConfig";

const initialValues = {
  first_name: null,
  middle_name: null,
  last_name: null,
  nickname_preferred_name: null,
  preferred_pronouns: null,
  email_address: null,
  mobile_number: null,
  home_phone: null,
  work_phone: null,
  best_way_to_contact: null,
  primary_phone: null,
  comfortable_language: null,
  other_language: null,
  date_of_birth: null,
  age: null,
  sex: null,
  social_security_number: null,
  us_armed_forces: null,
  describe_the_place_you_live: null,
  race: null,
  other_race: null,
  ethnicity: null,
  gender_identity: null,
  other_gender_identity: null,
  sexual_orientation: null,
  other_sexual_orientation: null,
  mailing_address_line_1: null,
  mailing_address_line_2: null,
  city: null,
  state: null,
  zip: null,
  usual_location: null,
  preferred_pharmacy_name: null,
  preferred_pharmacy_location: null,
  preferred_pharmacy_phone: null,
  insurance_primary_carrier_name: null,
  insurance_primary_subscriber_id: null,
  insurance_primary_subscriber_name: null,
  insurance_primary_group_name: null,
  insurance_primary_group_id: null,
  insurance_primary_relation_to_insured: null,
  insurance_primary_effective_from: null,
  insurance_primary_effective_to: null,
  insurance_secondary_carrier_name: null,
  insurance_secondary_subscriber_id: null,
  insurance_secondary_subscriber_name: null,
  insurance_secondary_group_name: null,
  insurance_secondary_group_id: null,
  insurance_secondary_relation_to_insured: null,
  insurance_secondary_effective_from: null,
  insurance_secondary_effective_to: null,
  insurance_tertiary_carrier_name: null,
  insurance_tertiary_subscriber_id: null,
  insurance_tertiary_subscriber_name: null,
  insurance_tertiary_group_name: null,
  insurance_tertiary_group_id: null,
  insurance_tertiary_relation_to_insured: null,
  insurance_tertiary_effective_from: null,
  insurance_tertiary_effective_to: null,
  emergency_contact_1_name: null,
  emergency_contact_1_email_address: null,
  emergency_contact_1_relationship: null,
  emergency_contact_1_address_line_1: null,
  emergency_contact_1_address_line_2: null,
  emergency_contact_1_city: null,
  emergency_contact_1_state: null,
  emergency_contact_1_zip: null,
  emergency_contact_1_phone: null,
  emergency_contact_2_name: null,
  emergency_contact_2_email_address: null,
  emergency_contact_2_relationship: null,
  emergency_contact_2_address_line_1: null,
  emergency_contact_2_address_line_2: null,
  emergency_contact_2_city: null,
  emergency_contact_2_state: null,
  emergency_contact_2_zip: null,
  emergency_contact_2_phone: null,
  system_information_original_data_source: null,
  system_information_import_notes: null,
  system_information_import_date: null,
  system_information_prn: null,
  system_information_chart_number: null,
  system_information_system_id: null,
};

const errorInitialValues = {
  first_name: "",
  last_name: "",
  email_address: "",
  mobile_number: "",
  emergency_contact_1_email_address: "",
  emergency_contact_1_zip: "",
  emergency_contact_2_email_address: "",
  emergency_contact_2_zip: "",
  age: "",
  zip_address_n_usual_location: "",
};

const ClientProfile = () => {
  const { clientId } = useParams();

  const [isEdittable, setIsEdittable] = useState(false);

  const token = localStorage.getItem("access_token");

  const [clientData, setClientData] = useState(initialValues);
  const [isHovered, setIsHovered] = useState(false);
  const [errors, setErrors] = useState(errorInitialValues);

  const handleClick = (accordionId) => {
    console.log("Inside handleClick");
    console.log("accordian id", `accordion-${accordionId}`);
    const accordionElement = document.getElementById(
      `accordian-${accordionId}`
    );
    console.log("accordionElement", accordionElement);
    if (accordionElement) {
      console.log("Inside accordionElement");
      accordionElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleEdit = () => {
    setIsEdittable(false);
    setIsHovered(false);
  };

  const handleFieldChange = (field, value) => {
    setClientData((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const closeSuccessAlert = () => {
    setShowSuccessAlert(false);
  };

  const closeErrorAlert = () => {
    setShowErrorAlert(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    console.log("Submitting clientData:", clientData);

    setErrors(errorInitialValues);
    setShowErrorAlert(false);
    setShowSuccessAlert(false);

    function validation() {
      let errors = {};
      let isValid = true;

      console.log({ clientData });
      if (!clientData.first_name) {
        console.log({ clientData });
        errors.first_name = "Mandatory field";
        isValid = false;
      }
      if (!clientData.last_name) {
        errors.last_name = "Mandatory field";
        isValid = false;
      }
      if (
        clientData.email_address &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
          clientData.email_address
        )
      ) {
        errors.email = "Invalid Email";
        isValid = false;
      }
      if (clientData.mobile_number && isNaN(clientData.mobile_number)) {
        errors.mobile_number = "Mobile must be a number";
        isValid = false;
      }

      //Emergency contact 1
      if (
        clientData.emergency_contact_1_email_address &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
          clientData.emergency_contact_1_email_address
        )
      ) {
        errors.emergency_contact_1_email_address = "Invalid Email";
        isValid = false;
      }
      if (clientData.emergency_contact_1_zip) {
        if (isNaN(clientData.emergency_contact_1_zip)) {
          errors.emergency_contact_1_zip = "Zip code must be a number";
          isValid = false;
        } else if (clientData.emergency_contact_1_zip.length > 5) {
          errors.emergency_contact_1_zip =
            "Zip code cannot be more than 5 characters";
          isValid = false;
        }
      }

      //Emergency contact 2
      if (
        clientData.emergency_contact_2_email_address &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
          clientData.emergency_contact_2_email_address
        )
      ) {
        errors.emergency_contact_2_email_address = "Invalid Email";
        isValid = false;
      }
      if (clientData.emergency_contact_2_zip) {
        if (isNaN(clientData.emergency_contact_2_zip)) {
          errors.emergency_contact_2_zip = "Zip code must be a number";
          isValid = false;
        } else if (clientData.emergency_contact_2_zip.length > 5) {
          errors.emergency_contact_2_zip =
            "Zip code cannot be more than 5 characters";
          isValid = false;
        }
      }

      //Demographics
      if (clientData.age && isNaN(clientData.age)) {
        errors.age = "Age must be a number";
        isValid = false;
      }

      //Address usual address
      if (clientData.zip_address_n_usual_location) {
        if (isNaN(clientData.zip_address_n_usual_location)) {
          errors.zip_address_n_usual_location = "Zip code must be a number";
          isValid = false;
        } else if (clientData.zip_address_n_usual_location.length > 5) {
          errors.zip_address_n_usual_location =
            "Zip code cannot be more than 5 characters";
          isValid = false;
        }
      }

      setErrors(errors);
      return isValid;
    }

    // Validate
    const isValid = validation();
    if (!isValid) {
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
      return;
    }

    axios
      .post(`${apiURL}/clientinfo-api/`, clientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Data submitted successfully:", response.data);
        setClientData(initialValues);
        setShowErrorAlert(false);
        setShowSuccessAlert(true);
        console.log({ initialValues });
        console.log("After Submit:", clientData);
      })
      .catch((error) => {
        console.error("Error submitting Client Data:", error);
        setErrorMsg(error?.message);
        setShowErrorAlert(true);
        setShowSuccessAlert(false);
      });
  };

  function handleMouseEnter() {
    setTimeout(() => {
      setIsHovered(true);
    }, 100);
  }

  return (
    <div className="h-full bg-gray-50">
      {showSuccessAlert && (
        <AlertSuccess
          message="Saved successfully"
          handleClose={closeSuccessAlert}
        />
      )}
      {showErrorAlert && (
        <AlertError
          message={errorMsg || "Invalid form values"}
          handleClose={closeErrorAlert}
        />
      )}
      <div className="bg-white p-4 shadow">
        <div className="flex justify-between mb-0 mt-4 pl-4">
          <div className="flex space-x-12">
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
              id="saveClientProfile"
            >
              Save
            </button>
          </div>
          <div className="flex space-x-8">
            <Link to={"/"}>
              <p className="text-green-700 font-medium">Dashboard</p>
            </Link>
            {/* <Link to={`/clientchart/${clientId}`}>
              <p className='text-green-700 font-medium'>Client Chart</p>
            </Link> */}
            <p className="text-green-700 font-medium">AMD Profile</p>
            <p className="text-green-700 font-medium pr-8">Manage Program</p>
          </div>
        </div>
        <div class="border-b border-green-800 mt-2 mb-4"></div>
        <div className="flex">
          <div className="">
            <Sidebar handleClick={handleClick} />
          </div>
          <div class="w-full px-2 space-y-6">
            <div>
              <GeneralInformation
                id={1}
                isEdittable={isEdittable}
                clientData={clientData}
                handleFieldChange={handleFieldChange}
              />
            </div>
            <div>
              <ContactInformation
                id={2}
                errors={errors}
                isEdittable={isEdittable}
                clientData={clientData}
                handleFieldChange={handleFieldChange}
              />
            </div>
            <div>
              <Demographics
                id={3}
                errors={errors}
                isEdittable={isEdittable}
                clientData={clientData}
                handleFieldChange={handleFieldChange}
              />
            </div>
            <div>
              <AddressInformation
                id={4}
                errors={errors}
                isEdittable={isEdittable}
                clientData={clientData}
                handleFieldChange={handleFieldChange}
              />
            </div>
            {/* <div>
              <CustomFields id={5} isEdittable={isEdittable} clientData={clientData} handleFieldChange={handleFieldChange} />
            </div> */}
            <div>
              <PreferredPharmacy
                id={6}
                isEdittable={isEdittable}
                clientData={clientData}
                handleFieldChange={handleFieldChange}
              />
            </div>
            <div>
              <InsuranceInformation
                id={7}
                isEdittable={isEdittable}
                clientData={clientData}
                handleFieldChange={handleFieldChange}
              />
            </div>
            <div>
              <SystemInformation
                id={8}
                isEdittable={isEdittable}
                clientData={clientData}
                handleFieldChange={handleFieldChange}
              />
            </div>

            {/* <div>
              <MyComponent id={9} isEdittable={isEdittable} clientData={clientData} handleFieldChange={handleFieldChange} />
            </div> */}

            {/* <div className='flex justify-center space-x-4'>
              <SecondaryButton text="Cancel" />
              <PrimaryButton text="Save" handleClick={handleSave} isDisabled={isEdittable} />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
