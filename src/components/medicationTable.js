import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useParams } from 'react-router-dom';
import apiURL from '.././apiConfig';

function MedicationTable() {
  const { clientId } = useParams();

  const [clientMedicationData, setClientMedicationData] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    axios.get(`${apiURL}/clientmedication-api/${clientId}`)
      .then(response => {
        setClientMedicationData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching Client Medication Data:', error);
      });
  }, []);

  const handleEditClick = (medication) => {
    setSelectedMedication(medication);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setSelectedMedication(null);
    setShowEditModal(false);
  };

  const handleSaveChanges = (updatedMedication) => {
    console.log(updatedMedication)
    // Implement logic to save changes
    // You can use the updatedMedication data to send back to the server
    axios.put(`${apiURL}/clientmedication-api/${selectedMedication.id}`, updatedMedication)
      .then(response => {
        console.log('Updated Successfully:', response.data);
        // Refresh data after successful update
        axios.get(`${apiURL}/clientmedication-api/${clientId}`)
          .then(response => {
            setClientMedicationData(response.data);
          })
          .catch(error => {
            console.error('Error fetching Client Medication Data:', error);
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
      <h2>Medication Table</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead style={{ backgroundColor: '#f0f0f0' }}>
            <tr>
              <th style={{ backgroundColor: 'lightblue' }}>Start date</th>
              <th style={{ backgroundColor: 'lightblue' }}>Stop date</th>
              <th style={{ backgroundColor: 'lightblue' }}>Medication</th>
              <th style={{ backgroundColor: 'lightblue' }}>Comments</th>
              <th style={{ backgroundColor: 'lightblue' }}>Status</th>
              <th style={{ backgroundColor: 'lightblue' }}>Last Updated Date</th>
              <th style={{ backgroundColor: 'lightblue' }}>Last Updated By</th>
              <th style={{ backgroundColor: 'lightblue' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {clientMedicationData.map((medication, index) => (
              <tr key={index}>
                <td>{medication.start_date}</td>
                <td>{medication.stop_date}</td>
                <td>{medication.medication}</td>
                <td>{medication.comments}</td>
                <td>{medication.status}</td>
                <td>{medication.last_updated_date}</td>
                <td>{medication.last_updated_by}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleEditClick(medication)}>
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
          <Modal.Title>Edit Medication</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="text"
                value={selectedMedication?.start_date || ''}
                onChange={(e) => setSelectedMedication({ ...selectedMedication, start_date: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formStopDate">
              <Form.Label>Stop Date</Form.Label>
              <Form.Control
                type="text"
                value={selectedMedication?.stop_date || ''}
                onChange={(e) => setSelectedMedication({ ...selectedMedication, stop_date: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMedicationName">
              <Form.Label>Medication Name</Form.Label>
              <Form.Control
                type="text"
                value={selectedMedication?.medication || ''}
                onChange={(e) => setSelectedMedication({ ...selectedMedication, medication: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formComments">
              <Form.Label>Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={selectedMedication?.comments || ''}
                onChange={(e) => setSelectedMedication({ ...selectedMedication, comments: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                value={selectedMedication?.status || ''}
                onChange={(e) => setSelectedMedication({ ...selectedMedication, status: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLastUpdatedDate">
              <Form.Label>Last Updated Date</Form.Label>
              <Form.Control
                type="text"
                value={selectedMedication?.last_updated_date || ''}
                onChange={(e) => setSelectedMedication({ ...selectedMedication, last_updated_date: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLastUpdatedBy">
              <Form.Label>Last Updated By</Form.Label>
              <Form.Control
                type="text"
                value={selectedMedication?.last_updated_by || ''}
                onChange={(e) => setSelectedMedication({ ...selectedMedication, last_updated_by: e.target.value })}
              />
            </Form.Group>

            {/* Add other input fields for editing */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSaveChanges(selectedMedication)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MedicationTable;
