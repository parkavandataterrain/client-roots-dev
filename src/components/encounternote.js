import React, { useState,useEffect,useRef } from 'react';
import './css/encounternote.css';
import axios from 'axios';
import apiURL from '../apiConfig';

const EncounterNote = () => {

  const [selectedOption, setSelectedOption] = useState("");
  const [userData, setUserData] = useState(null);
  const [profileTypeData, setProfileTypeData] = useState(null);

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
  };


  const [files1, setFiles1] = useState([]);
  const [files2, setFiles2] = useState([]);
  const [files3, setFiles3] = useState([]);
  const [files4, setFiles4] = useState([]);

  const handleFileChange1 = (event) => {
    const fileList = event.target.files;
    const newFiles = Array.from(fileList).map(file => ({
      name: file.name,
      id: Math.random().toString(36).substring(7),
      file
    }));
    setFiles1(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleFileChange2 = (event) => {
    const fileList = event.target.files;
    const newFiles = Array.from(fileList).map(file => ({
      name: file.name,
      id: Math.random().toString(36).substring(7),
      file
    }));
    setFiles2(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleFileChange3 = (event) => {
    const fileList = event.target.files;
    const newFiles = Array.from(fileList).map(file => ({
      name: file.name,
      id: Math.random().toString(36).substring(7),
      file
    }));
    setFiles3(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleFileChange4 = (event) => {
    const fileList = event.target.files;
    const newFiles = Array.from(fileList).map(file => ({
      name: file.name,
      id: Math.random().toString(36).substring(7),
      file
    }));
    setFiles4(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleRemoveFile1 = (id) => {
    setFiles1(prevFiles => prevFiles.filter(file => file.id !== id));
  };

  const handleRemoveFile2 = (id) => {
    setFiles2(prevFiles => prevFiles.filter(file => file.id !== id));
  };

  const handleRemoveFile3 = (id) => {
    setFiles3(prevFiles => prevFiles.filter(file => file.id !== id));
  };

  const handleRemoveFile4 = (id) => {
    setFiles4(prevFiles => prevFiles.filter(file => file.id !== id));
  };







    useEffect(() => {
      // Retrieve token from local storage
      const access_token = localStorage.getItem('access_token');
  
      // Function to fetch user data
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${apiURL}/api/username`, {
            headers: {
              Authorization: `Bearer ${access_token}` // Include token in the request headers
            }
          });
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      // Function to fetch profile type data
      const fetchProfileTypeData = async () => {
        try {
          const response = await fetch(`${apiURL}/profile-type/`, {
            headers: {
              Authorization: `Bearer ${access_token}` // Include token in the request headers
            }
          });
          const data = await response.json();
          setProfileTypeData(data);
        } catch (error) {
          console.error('Error fetching profile type data:', error);
        }
      };
  
      // Call the fetch functions
      fetchUserData();
      fetchProfileTypeData();
    }, []);


    console.log(profileTypeData)
    console.log(userData)

//M implementation

useEffect(() => {
  const fetchClients = async () => {
    try {
      const response = await axios.get(`${apiURL}/clientinfo-api/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  fetchClients();
}, []);

const token = localStorage.getItem('access_token');

const [clients, setClients] = useState([]);
const [selectedClient, setSelectedClient] = useState("");
const [clientDetails, setClientDetails] = useState({
  dob: null,
  preferredName: null,
  primaryPhoneNumber: null,
  email: null
});

const initialValuesClientDetails = {
  dob: null,
  preferredName: null,
  primaryPhoneNumber: null,
  email: null
};

const initialValues = {
  client_id: null,
  staff_name: null,
  encounter_date: null,
  start_time: null,
  end_time: null,
  encounter_type: null,
  encounter_status: null,
  facility: null,
  program: null,
  note_template: null, //this is alternative for noneType not confirmed yet
  noteType: null,
  custom_fields: null,
  encounter_summary: null,
  uploaded_documents: null,
  care_plans: null,
  signed_by: null,
};

  // State variables to hold form data
  const [formData, setFormData] = useState({
    client_id: null,
    staff_name: null,
    encounter_date: null,
    start_time: null,
    end_time: null,
    encounter_type: null,
    encounter_status: null,
    facility: null,
    program: null,
    note_template: null, //this is alternative for noneType not confirmed yet
    noteType: null,
    custom_fields: null,
    encounter_summary: null,
    uploaded_documents: null,
    care_plans: null,
    signed_by: null,
  });

  const handleChange = (field, value) => {
    setFormData((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    setSelectedClient(clientId);
    handleChange("client_id", clientId)
    handleChange("staff_name", userData.username)
      
    // Find the selected client from the clients array
    const selectedClient = clients.find(client => client.id === parseInt(clientId));
    // console.log(selectedClient,clientId, clients,"selected client")
    if (selectedClient) {
      setClientDetails({
        dob: selectedClient.date_of_birth,
        nickname_preferred_name: selectedClient.nickname_preferred_name || "",
        primaryPhoneNumber: selectedClient.mobile_number || "",
        email: selectedClient.email_address || ""
      });
    }
  };

  // Function to handle form submission
  const handleSubmit1 = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    //handleChange("staff_name", userData.username)
    console.log("form data before submit", formData)

    try {
      // Make POST request to API endpoint with form data
      const response = await axios.post(`${apiURL}/api/encounter-notes/create/`, formData);
      console.log('Response:', response.data); // Log response from API
      // Clear form fields after successful submission if needed
      // setFormData({ ...formData, clientName: '', dob: '', preferredName: '', ... });
      alert("Successfully Submitted")
      setFormData(initialValues)
      setSelectedClient("")
      setClientDetails(initialValuesClientDetails); // Reset client details
    } catch (error) {
      console.error('Error:', error); // Log any errors
    }
  };

    


  return (
    <form onSubmit={handleSubmit1}>
      <div className="container pt-4">
        <div className="row">
          <div className="col-12">
            <h2 className="text-left">Client Encounter Note</h2>
          </div>
        </div>
      </div>

      <div className="container pt-4">
        <div className="row">
          <div className="col-md-4">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">Client Name</span>
              </div>
              <select 
                className="form-control" 
                id="clientName"
                value={selectedClient}
                onChange={handleClientChange}
              >
                <option value="">Select a client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {`${client.first_name} ${client.middle_name ? client.middle_name + ' ' : ''}${client.last_name}`}
                  </option>
                ))}
              </select>            </div>
          </div>
          <div className="col-md-4">
            <div className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon2">DOB</span>
              </div>
              <input 
                type="text" 
                className="form-control" 
                id="basic-url2" 
                aria-describedby="basic-addon2" 
                value={clientDetails.dob || ""} 
                //onChange={(e) => setClientDetails({ ...clientDetails, dob: e.target.value })}
                disabled 
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon3">Preferred Name</span>
              </div>
              <input 
                type="text" 
                className="form-control" 
                id="basic-url3" 
                aria-describedby="basic-addon3" 
                value={clientDetails.nickname_preferred_name || ""} 
                // onChange={(e) => setClientDetails({ ...clientDetails, nickname_preferred_name: e.target.value })}
                disabled 
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">Primary Phonenumber</span>
              </div>
              <input 
                type="text" 
                className="form-control" 
                id="basic-url1" 
                aria-describedby="basic-addon1" 
                value={clientDetails.primaryPhoneNumber || ""} 
                // onChange={(e) => setClientDetails({ ...clientDetails, primaryPhoneNumber: e.target.value })}
                disabled 
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon2">Email</span>
              </div>
              <input 
                type="text" 
                className="form-control" 
                id="basic-url2" 
                aria-describedby="basic-addon2" 
                value={clientDetails.email || ""} 
                // onChange={(e) => setClientDetails({ ...clientDetails, email: e.target.value })}
                disabled 
              />
            </div>
          </div>
        </div>
      
     {/* <>--------------------------------next section-----------------------------------------</> */}
        

        <hr />

        <div className="row">
          <div className="col-md-6">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">Staff Name <span style={{ color: 'red' }}>*</span> </span>
              </div>

              {userData && ( // Check if userData exists before accessing its properties
        <input
          type="text"
          className="form-control"
          id="basic-url1"
          aria-describedby="basic-addon1"
          value={userData.username || ""}
          disabled
        />
      )}

                       </div>
          </div>
          <div className="col-md-6">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon2">Encounter Date <span style={{ color: 'red' }}>*</span>  </span>
              </div>
              <input type="date" className="form-control" id="basic-url2" value={formData.encounter_date || ""} onChange={(encounter_date) => handleChange("encounter_date", encounter_date.target.value)} aria-describedby="basic-addon2" />
            </div>
          </div>

          
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">Facility <span style={{ color: 'red' }}>*</span> </span>
              </div>
              <input type="text" className="form-control" id="basic-url1" value={formData.facility || ""} onChange={(facility) => handleChange("facility", facility.target.value)} aria-describedby="basic-addon1" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon2">Program <span style={{ color: 'red' }}>*</span> </span>
              </div>
              <input type="text" className="form-control" id="basic-url2" value={formData.program || ""} onChange={(program) => handleChange("program", program.target.value)} aria-describedby="basic-addon2" />
            </div>
          </div>

          
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">Note Type <span style={{ color: 'red' }}>*</span> </span>
              </div>
              <input type="text" className="form-control" id="basic-url1" value={formData.noteType || ""} onChange={(noteType) => handleChange("noteType", noteType.target.value)} aria-describedby="basic-addon1" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon2">Encounter Type <span style={{ color: 'red' }}>*</span> </span>
              </div>
              <input type="text" className="form-control" id="basic-url2" value={formData.encounter_type || ""} onChange={(encounter_type) => handleChange("encounter_type", encounter_type.target.value)} aria-describedby="basic-addon2" />
            </div>
          </div>

          
        </div>

        <div className="row pt-4">

        <div className="col-md-12">

        

        <div className="form-group shadow-textarea">
        <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">Custom Fields</span>
              </div>
           
            <textarea className="form-control z-depth-1" id="exampleFormControlTextarea6" value={formData.custom_fields || ""} onChange={(custom_fields) => handleChange("custom_fields", custom_fields.target.value)} rows="3" placeholder="Write something here..."></textarea>
          </div>

          </div>

        </div>

        <div className="row pt-4">
      <div className="col-md-12">
        <div className="card shadow-textarea">
          <div className="card-body">
            <div className="input-group-prepend mb-3">
              <span className="input-group-text" id="basic-addon1">Encounter Summary</span>
              <select id="enabledSelect" value={selectedOption} className="form-select" onChange={handleSelectChange}>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>
            
            {selectedOption === "option1" && (
              <textarea className="form-control z-depth-1" rows="3" placeholder="Write something for Option 1..."></textarea>
            )}
            {selectedOption === "option2" && (
              <textarea className="form-control z-depth-1" rows="3" placeholder="Write something for Option 2..."></textarea>
            )}
            {selectedOption === "option3" && (
              <textarea className="form-control z-depth-1" rows="3" placeholder="Write something for Option 3..."></textarea>
            )}
          </div>
        </div>
      </div>
    </div>


      

    <div>
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="formFileMultiple1" className="form-label">Multiple files input example 1</label>
                <input className="form-control" type="file" id="formFileMultiple1" multiple onChange={handleFileChange1} autoComplete="off" />
              </div>
              <ul className="file-list" style={{ maxHeight: '200px', overflowY: 'auto', padding: '15px' }}>
                {/* Added styling for scroll */}
                {files1.map(file => (
                  <li className="file-item" key={file.id}>
                    {file.name}
                    <button className="btn btn-danger btn-sm ml-2" onClick={() => handleRemoveFile1(file.id)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="formFileMultiple2" className="form-label">Multiple files input example 2</label>
                <input className="form-control" type="file" id="formFileMultiple2" multiple onChange={handleFileChange2} autoComplete="off" />
              </div>
              <ul className="file-list" style={{ maxHeight: '200px', overflowY: 'auto', padding: '15px' }}> {/* Added styling for scroll */}
                {files2.map(file => (
                  <li className="file-item" key={file.id}>
                    {file.name}
                    <button className="btn btn-danger btn-sm ml-2" onClick={() => handleRemoveFile2(file.id)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="formFileMultiple3" className="form-label">Multiple files input example 3</label>
                <input className="form-control" type="file" id="formFileMultiple3" multiple onChange={handleFileChange3} autoComplete="off" />
              </div>
              <ul className="file-list" style={{ maxHeight: '200px', overflowY: 'auto', padding: '15px' }}>
                {/* Added styling for scroll */}
                {files3.map(file => (
                  <li className="file-item" key={file.id}>
                    {file.name}
                    <button className="btn btn-danger btn-sm ml-2" onClick={() => handleRemoveFile3(file.id)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

  

<div className="col-md-6">
  <div className="card" >
    <div className="card-body">
      <div className="row">
        <div className="col-md-6 border-left">
          <p >Signed By</p>
        </div>

        <div className="col-md-6">
        <p><span className="dot">•</span> dummy data 1</p>
        <p><span className="dot">•</span> dummy data 2</p>
        <p><span className="dot">•</span> dummy data 3</p>
       

          <button className="btn btn-success">signature</button>
        </div>
      </div>
    </div>
  </div>
</div>




</div>
  
</div>
</div>
  
    </form>
  );
};

export default EncounterNote;

