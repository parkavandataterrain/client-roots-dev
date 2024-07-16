import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./css/Sidebar.css";

import Sidebar from "./clientprofile/SideBar";
import GeneralInformation from "./clientprofile/General_Information";
import ContactInformation from "./clientprofile/ContactInformation";
import Demographics from "./clientprofile/Demographics";
import AddressInformation from "./clientprofile/Address";
import CustomFields from "./clientprofile/CustomFields";
import PreferredPharmacy from "./clientprofile/PreferredPharmacy";
import InsuranceInformation from "./clientprofile/InsuranceInformation";
import SystemInformation from "./clientprofile/SystemInformation";
import PrimaryButton from "./common/PrimaryButton";
import SecondaryButton from "./common/SecondaryButton";
import AlertSuccess from "./common/AlertSuccess";
import AlertError from "./common/AlertError";
import { useParams } from "react-router-dom";
import axios from "axios";
import EditPNG from "./images/edit.png";
import SavePNG from "./images/save.png";
import EditGreenPNG from "./images/edit-green.png";
import SaveGreenPNG from "./images/save-green.png";
// import DynamicFieldForm from './clientprofile/dynamicfield'

import MyComponent from "./clientprofilefull";
import apiURL from "../apiConfig";

const ClientProfile = () => {
  const { clientId } = useParams();

  const [isEdittable, setIsEdittable] = useState(true);

  const token = localStorage.getItem("access_token");

  const [clientData, setClientData] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    console.log(clientId, "clientId");
    axios
      .get(`${apiURL}/clientinfo-api/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setClientData(response.data);
        console.log(response.data.first_name);
        console.log({ response });
      })
      .catch((error) => {
        console.error("Error fetching Client Data:", error);
      });
  }, []);

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
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
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

  const handleSave = () => {
    setIsHovered(false);
    window.scrollTo({ top: 0, behavior: "smooth" });

    setShowSuccessAlert(false);
    setShowErrorAlert(false);

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
      console.log({ errors });
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
      return;
    }

    // Perform API request to update client data
    axios
      .put(`${apiURL}/clientinfo-api/${clientId}`, clientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Client data updated successfully:", response.data);
        // Optionally, you can set isEditable back to true if needed
        setIsEdittable(true);
        setShowErrorAlert(false);
        setShowSuccessAlert(true);
      })
      .catch((error) => {
        console.error("Error updating Client Data:", error);
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

  console.log({ isEdittable });

  console.log({ clientData });

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
            <h2 className="text-gray-800 text-2xl font-medium">
              Client: {clientData.first_name} {clientData.last_name}
            </h2>
            {/* {isEdittable && (<button onClick={handleEdit}>
              <div className='flex flex-col items-center'>
                <img
                  // src={EditPNG} 
                  src={isHovered ? EditGreenPNG : EditPNG}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={() => setIsHovered(false)}
                  class="w-6 h-6" />
                {isHovered && <div className="text-green-800 text-base font-medium">Edit</div>}
              </div>
            </button>)}
            {!isEdittable && (<button onClick={handleSave}>
              <div className='flex flex-col items-center'>
                <img
                  // src={SavePNG} 
                  src={isHovered ? SaveGreenPNG : SavePNG}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={() => setIsHovered(false)}
                  class="w-5 h-6" />
                {isHovered && <div className="text-green-800 text-base font-medium">Save</div>}
              </div>
            </button>)} */}
            <button onClick={handleEdit} disabled={!isEdittable}>
              <div className="flex space-x-2 items-center">
                <img
                  // src={EditGreenPNG}
                  src={isEdittable ? EditGreenPNG : EditPNG}
                  // onMouseEnter={handleMouseEnter}
                  // onMouseLeave={() => setIsHovered(false)}
                  class={`w-6 h-6 ${isEdittable ? "" : "cursor-not-allowed"}`}
                />
                <div
                  className={
                    isEdittable
                      ? "text-green-800 text-base font-medium"
                      : "text-gray-800 text-base font-medium cursor-not-allowed"
                  }
                >
                  Edit
                </div>
              </div>
            </button>
            <button onClick={handleSave} disabled={isEdittable}>
              <div className="flex space-x-2 items-center">
                <img
                  // src={SaveGreenPNG}
                  src={!isEdittable ? SaveGreenPNG : SavePNG}
                  // onMouseEnter={handleMouseEnter}
                  // onMouseLeave={() => setIsHovered(false)}
                  class={`w-5 h-6 ${!isEdittable ? "" : "cursor-not-allowed"}`}
                />
                <div
                  className={
                    !isEdittable
                      ? "text-green-800 text-base font-medium"
                      : "text-gray-800 text-base font-medium cursor-not-allowed"
                  }
                >
                  Save
                </div>
              </div>
            </button>
          </div>
          <div className="flex space-x-8">
            <Link to={"/"}>
              <p className="text-green-700 font-medium">Dashboard</p>
            </Link>
            <Link to={`/clientchart/${clientId}`}>
              <p className="text-green-700 font-medium">Client Chart</p>
            </Link>
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
