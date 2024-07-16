import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Accordion from "react-bootstrap/Accordion";
import "./css/clientchart.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import MedicationTable from "./medicationTable"; // Import the new component
import { useParams } from "react-router-dom";

import ClientDetails from "./clientchart/clientdetails";
import SocialVitalSigns from "./clientchart/socialvitalsigns";
import Diagnosis from "./clientchart/diagnosis";
import Medications from "./clientchart/medications";
import AlertSuccess from "./common/AlertSuccess";
import apiURL from ".././apiConfig";

function ClientChart() {
  const { clientId } = useParams();
  const token = localStorage.getItem("access_token");

  const [client, setClient] = useState([]);
  const [clientMedicationData, setClientMedicationData] = useState([]);
  const [clientDiagnosesData, setClientDiagnosesData] = useState([]);
  const [clientSVSData, setClientSVSData] = useState({});
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const closeAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    axios
      .get(`${apiURL}/clientinfo-api/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setClient(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Client SVS Data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${apiURL}/clientsvs-api/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setClientSVSData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Client SVS Data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${apiURL}/clientmedication-api/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setClientMedicationData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Client Medication Data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${apiURL}/clientdiagnoses-api/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setClientDiagnosesData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Client Diagnoses Data:", error);
      });
  }, []);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleViewEditClick = (page, clientID) => {
    // Redirect to the new page with the medication data
    if (page === "medication") {
      navigate(`/medication-details/${clientID}`);
    } else if (page === "diagnosis") {
      navigate(`/diagnosis_details/${clientID}`);
    }
  };

  const getColorByRisk = (risk) => {
    switch (risk) {
      case "Low":
        return "green";
      case "Medium":
        return "yellow";
      case "High":
        return "red";
      case "No":
        return "green";
      case "Yes":
        return "red";
      default:
        return "white"; // or any default color
    }
  };

  return (
    <div className="w-screen bg-gray-50">
      {showAlert && (
        <AlertSuccess message="Saved successfully" handleClose={closeAlert} />
      )}
      <div className="bg-white p-4 shadow">
        <div className="flex justify-between mb-4 mt-4 pl-4">
          <div className="flex flex-row space-x-12">
            <div
              className="text-gray-800 text-2xl font-medium"
              style={{
                fontFamily: "Roboto Mono",
              }}
            >
              Client Chart
            </div>
            {/* <img src={EditPNG} class="w-6 h-6" />
            <img src={SavePNG} class="w-5 h-6" /> */}
          </div>
          <div className="flex space-x-8">
            <Link to={"/"}>
              <p className="text-green-700 font-medium">Dashboard</p>
            </Link>
            <p className="text-green-700 font-medium">AMD Profile</p>
            <p className="text-green-700 font-medium pr-8">Manage Program</p>
          </div>
        </div>
        <div class="border-b border-green-800 mt-2 mb-4"></div>
        <div className="flex">
          <div class="w-full px-2 space-y-6">
            <div>
              <ClientDetails clientData={client} />
            </div>
            <div>
              <SocialVitalSigns clientSVSData={clientSVSData} />
            </div>
            <div>
              <Diagnosis
                clientDiagnosesData={clientDiagnosesData}
                setShowAlert={setShowAlert}
              />
            </div>
            <div>
              <Medications
                clientMedicationData={clientMedicationData}
                setShowAlert={setShowAlert}
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    // <div className='flex flex-col px-3 mt-2'>
    //   <div className='flex flex-row justify-between pb-8 mt-3'>
    //     <div className='text-2xl font-semibold'>
    //       Client Chart
    //     </div>
    //   </div>
    //   <div class="w-full px-2 space-y-6">
    // <ClientDetails />
    //     {/* <ClientGoals />
    // <PriorityList />
    // <Referrals />
    // <Calendar />
    // <Encounter />
    // <Notification /> */}
    //   </div >
    // </div >
    //   <>
    //   <div className="container-fluid mt-3">
    //   <div className="row">
    //     <div className="col-4">
    //       <Card>
    //         <Card.Body>
    //           <Card.Title>Name: {client.first_name}</Card.Title>
    //           <Card.Subtitle className="mb-2 text-muted">
    //             {/*Age: {client.age} | Sex: {client.sex}*/}
    //           </Card.Subtitle>
    //           <Card.Text>
    //             <strong>Preferred Name:</strong> {client.nickname_preferred_name}
    //             <br />
    //             <strong>Pronouns:</strong> {client.preferred_pronouns}
    //             <br />
    //             <strong>Date of birth:</strong> {client.date_of_birth}
    //             <br />
    //             <strong>Language:</strong> {client.comfortable_language}
    //             <br />
    //             <strong>Primary Phone:</strong> {client.primary_phone}
    //             <br />
    //             <strong>Email:</strong> {client.emergency_contact_1_email_address}
    //             <br />
    //             <strong>Insurance:</strong> {client.insurance}
    //             <br />
    //             <strong>Insurance ID:</strong> {client.insurance_primary_carrier_name}
    //             <br />
    //             <strong>Navigator & Program:</strong> {client.navigator_program}
    //             <br />
    //             <strong>Other Programs:</strong> {client.other_programs}
    //             <br />
    //           </Card.Text>
    //         </Card.Body>
    //       </Card>
    //     </div>
    //     {/* Add other components or content in the remaining columns if needed */}
    //   </div>
    // </div>
    //   <div className="container-fluid mt-5">
    //     <div className="row">
    //       <div className='col-6'>
    //         <Accordion>
    //           <Accordion.Item eventKey="0">
    //             <Accordion.Header className='fw-bold'>Medications</Accordion.Header>
    //             <Accordion.Body>
    //             <Card>
    //           <Card.Body>
    //             <Card.Title style={{ display: 'flex', justifyContent: 'space-between' }}>Medication Details
    //     <button className='view-edit' onClick={() => handleViewEditClick("medication", clientId)}>
    //       View/Edit
    //     </button>              </Card.Title>
    //             <table className="table">
    //               <tbody>
    //                 {clientMedicationData.map((medication, index) => (
    //                   <tr key={index}>
    //                     <td style={{ width: '70%' ,borderBottom: '2px solid #000' }}>
    //                       <strong>Medication:</strong> <br /> {medication.medication}
    //                       <br /><br />
    //                       <strong>Comment:</strong> <br /> {medication.comments}
    //                       <br /><br />
    //                       <strong>Last Updated By:</strong> <br /> {medication.last_updated_by}
    //                     </td>
    //                     <td style={{ width: '30%', borderBottom: '2px solid #000'  }}>
    //                       <strong>Start Date:</strong> <br /> {medication.start_date}
    //                       <br /><br />
    //                       <strong>Stop Date:</strong> <br /> {medication.stop_date}
    //                       <br /><br />
    //                       <strong>Status:</strong> <br /> {medication.status}
    //                       <br /><br />
    //                       <strong>Last Updated:</strong> <br /> {medication.last_udpated_date}
    //                     </td>
    //                   </tr>
    //                 ))}
    //               </tbody>
    //             </table>
    //           </Card.Body>
    //         </Card>

    //             </Accordion.Body>
    //           </Accordion.Item>
    //         </Accordion>
    //       </div>

    //       <div className='col-6'>
    //         <Accordion>
    //           <Accordion.Item eventKey="0">
    //             <Accordion.Header className='fw-bold'>Diagnosis</Accordion.Header>
    //             <Accordion.Body>
    //             <Card>
    //           <Card.Body>
    //             <Card.Title style={{ display: 'flex', justifyContent: 'space-between' }}>Diagnosis Details
    //             <button className='view-edit' onClick={() => handleViewEditClick("diagnosis",clientId)}>View/Edit</button>
    //             </Card.Title>
    //             <table className="table">
    //               <tbody>
    //                 {clientDiagnosesData.map((diagnoses, index) => (
    //                   <tr key={index}>
    //                     <td style={{ width: '70%', borderBottom: '2px solid #000'   }}>
    //                       <strong>Diagnoses Name:</strong> <br /> {diagnoses.diagnosis_name}
    //                       <br /><br />
    //                       <strong>ICD10 Code:</strong> <br /> {diagnoses.icd10_code}
    //                       <br /><br />
    //                       <strong>Comment:</strong> <br /> {diagnoses.comments}
    //                       <br /><br />
    //                       <strong>Last Updated By:</strong> <br /> {diagnoses.last_updated_by}
    //                     </td>
    //                     <td style={{ width: '30%', borderBottom: '2px solid #000'   }}>
    //                       <strong>Diagnosis Start Date:</strong> <br /> {diagnoses.start_date}
    //                       <br /><br />
    //                       <strong>Diagnosis Stop Date:</strong> <br /> {diagnoses.stop_date}
    //                       <br /><br />
    //                       <strong>Status:</strong> <br /> {diagnoses.status}
    //                       <br /><br />
    //                       <strong>Last Updated:</strong> <br /> {diagnoses.last_udpated_date}
    //                     </td>
    //                   </tr>
    //                 ))}
    //               </tbody>
    //             </table>
    //           </Card.Body>
    //         </Card>
    //             </Accordion.Body>
    //           </Accordion.Item>
    //         </Accordion>
    //       </div>

    //       <div className='col-6'>
    //         <Accordion>
    //           <Accordion.Item eventKey="0">
    //             <Accordion.Header>SVS</Accordion.Header>
    //             <Accordion.Body>
    //             <table className="table">
    //                   <thead>
    //                     <tr>
    //                       <th>Domain</th>
    //                       <th>Risk</th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>

    //                   {Object.entries(clientSVSData).map(([key, value], outerIndex) => (
    //                     <React.Fragment key={outerIndex}>
    //                       <tr>
    //                         <td>{key}</td>
    //                         <td style={{ backgroundColor: getColorByRisk(value.risk) }}>{value.risk}</td>
    //                       </tr>
    //                       {/*
    //                       {Object.entries(value).map(([nestedKey, nestedValue], innerIndex) => (
    //                         <tr key={innerIndex}>
    //                           <td>{nestedKey}</td>
    //                           <td>{nestedValue}</td>
    //                         </tr>
    //                       ))}
    //                       */}
    //                     </React.Fragment>
    //                   ))}

    //                 </tbody>
    //                 </table>
    //           </Accordion.Body>
    //           </Accordion.Item>
    //         </Accordion>
    //       </div>
    //     </div>
    //   </div>
    //   </>
  );
}

export default ClientChart;
