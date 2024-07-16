import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useParams } from 'react-router-dom';
import apiURL from '.././apiConfig';

function DiagnosisTable() {
  const { clientId } = useParams();

  const [clientDiagnosisData, setClientDiagnosisData] = useState([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    axios.get(`${apiURL}/clientdiagnoses-api/${clientId}`)
      .then(response => {
        setClientDiagnosisData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching Client Diagnosis Data:', error);
      });
  }, []);

  const handleEditClick = (Diagnosis) => {
    setSelectedDiagnosis(Diagnosis);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setSelectedDiagnosis(null);
    setShowEditModal(false);
  };

  const handleSaveChanges = (updatedDiagnosis) => {
    console.log(updatedDiagnosis)
    // Implement logic to save changes
    // You can use the updatedDiagnosis data to send back to the server
    axios.put(`${apiURL}/clientdiagnoses-api/${selectedDiagnosis.id}`, updatedDiagnosis)
      .then(response => {
        console.log('Updated Successfully:', response.data);
        // Refresh data after successful update
        axios.get(`${apiURL}/clientdiagnoses-api/${clientId}`)
          .then(response => {
            setClientDiagnosisData(response.data);
          })
          .catch(error => {
            console.error('Error fetching Client Diagnosis Data:', error);
          });
      })
      .catch(error => {
        console.error('Failed to Update:', error);
      });

    // Close the modal
    setShowEditModal(false);
  };

  return (
    <div className="container-fluid mt-3">
      <h2>Diagnosis Table</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead style={{ backgroundColor: '#f0f0f0' }}>
            <tr>
              <th style={{ backgroundColor: 'lightblue' }}>Start date</th>
              <th style={{ backgroundColor: 'lightblue' }}>Stop date</th>
              <th style={{ backgroundColor: 'lightblue' }}>Diagnosis Name</th>
              <th style={{ backgroundColor: 'lightblue' }}>ICD10 Code</th>
              <th style={{ backgroundColor: 'lightblue' }}>Diagonosis Status</th>
              <th style={{ backgroundColor: 'lightblue' }}>Last Updated Date</th>
              <th style={{ backgroundColor: 'lightblue' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {clientDiagnosisData.map((Diagnosis, index) => (
              <tr key={index}>
                <td>{Diagnosis.start_date}</td>
                <td>{Diagnosis.stop_date}</td>
                <td>{Diagnosis.diagnosis_name}</td>
                <td>{Diagnosis.icd10_code}</td>
                <td>{Diagnosis.diagnosis_status}</td>
                <td>{Diagnosis.last_updated_date}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleEditClick(Diagnosis)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showEditModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Diagnosis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="text"
                value={selectedDiagnosis?.start_date || ''}
                onChange={(e) => setSelectedDiagnosis({ ...selectedDiagnosis, start_date: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formStopDate">
              <Form.Label>Stop Date</Form.Label>
              <Form.Control
                type="text"
                value={selectedDiagnosis?.stop_date || ''}
                onChange={(e) => setSelectedDiagnosis({ ...selectedDiagnosis, stop_date: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDiagnosisName">
              <Form.Label>Diagnosis Name</Form.Label>
              <Form.Control
                type="text"
                value={selectedDiagnosis?.diagnosis_name || ''}
                onChange={(e) => setSelectedDiagnosis({ ...selectedDiagnosis, diagnosis_name: e.target.value })}
              />
            </Form.Group>


            <Form.Group className="mb-3" controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                value={selectedDiagnosis?.diagnosis_status || ''}
                onChange={(e) => setSelectedDiagnosis({ ...selectedDiagnosis, diagnosis_status: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLastUpdatedDate">
              <Form.Label>Last Updated Date</Form.Label>
              <Form.Control
                type="text"
                value={selectedDiagnosis?.last_updated_date || ''}
                onChange={(e) => setSelectedDiagnosis({ ...selectedDiagnosis, last_updated_date: e.target.value })}
              />
            </Form.Group>

            {/* Add other input fields for editing */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSaveChanges(selectedDiagnosis)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DiagnosisTable;
