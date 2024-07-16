import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import apiURL from '../../apiConfig';

function DynamicFieldForm() {
    const [formData, setFormData] = useState([{ key: '', value: '', type: 'text', isYesChecked: false, isNoChecked: false }]);
    const [submittedData, setSubmittedData] = useState(null);
    const [apiData, setApiData] = useState(null);
    // const [file, setFile] = useState(null); 
    const [showThankYou, setShowThankYou] = useState(false);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${apiURL}/api/my-data`);
            setApiData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const newFormData = [...formData];
        newFormData[index][name] = value;
        setFormData(newFormData);
    };

    const handleYesCheckboxChange = (index) => {
        const newFormData = [...formData];
        newFormData[index].isYesChecked = !newFormData[index].isYesChecked;
        newFormData[index].isNoChecked = false;
        setFormData(newFormData);
    };

    const handleNoCheckboxChange = (index) => {
        const newFormData = [...formData];
        newFormData[index].isNoChecked = !newFormData[index].isNoChecked;
        newFormData[index].isYesChecked = false;
        setFormData(newFormData);
    };

    const handleTypeChange = (index, e) => {
        const { value } = e.target;
        const newFormData = [...formData];
        newFormData[index].type = value;
        setFormData(newFormData);
    };

    const handleAddField = () => {
        setFormData([...formData, { key: '', value: '', type: 'text', isYesChecked: false, isNoChecked: false }]);
    };

    const handleRemoveField = (index) => {
        const newFormData = [...formData];
        newFormData.splice(index, 1);
        setFormData(newFormData);
    };

    const handleFileChange = async (e, index) => { // Accept index parameter
        try {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64data = reader.result;
                const newFormData = [...formData];
                newFormData[index].value = base64data; // Set the file data as the value
                setFormData(newFormData);
            };

            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error handling file:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const jsonData = formData.reduce((acc, field) => {
                acc[field.key] = field.isYesChecked ? 'Yes' : field.isNoChecked ? 'No' : field.value;
                return acc;
            }, {});

            const formDataWithFile = new FormData();
            formDataWithFile.append('json_data', JSON.stringify(jsonData));

            console.log('FormData:', formDataWithFile);

            const response = await axios.post(`${apiURL}/api/my-view/`, formDataWithFile, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Data sent successfully');
            console.log('Data sent successfully:', response.data);
            
            setSubmittedData(jsonData);
            setShowThankYou(true); 

            // window.location.href = '/';

            // setFormData([{ key: '', value: '', type: 'text', isYesChecked: false, isNoChecked: false }]);
        } catch (error) {
            console.error('Error sending data:', error);
        }
    };

    return (

        <div className="border border-gray-300 bg-gray-50">
    {showThankYou ? (
       <div class="text-center mt-8">
       <p>Thank You!</p>
       {submittedData && (
           <div class="bg-gray-100 rounded-lg p-4 mx-auto max-w-md mt-4">
               <h2 class="text-xl font-bold mb-2">Successfully Submitted</h2>
               <p class="text-3xl mb-4">🚀</p>
               <p class="text-lg text-gray-700">Your data has been successfully submitted to your profile. Thank you for your cooperation! 🎉</p>
           </div>
       )}
   </div>
    ) : (
        <form onSubmit={handleSubmit} className="">
            {formData.map((field, index) => (
                <div key={index} className="flex items-center space-x-4 mb-4">
                    <input
                        type="text"
                        name="key"
                        value={field.key}
                        placeholder="Key"
                        onChange={(e) => handleInputChange(index, e)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-left"
                    />
                    <select
                        value={field.type}
                        onChange={(e) => handleTypeChange(index, e)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-left"
                    >
                        <option value="text">Text</option>
                        <option value="textarea">Textarea</option>
                        <option value="date">Date</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="fileupload">File Upload</option> {/* File upload option */}
                    </select>
                    {field.type === 'date' ? (
                        <DatePicker
                            selected={field.value ? new Date(field.value) : null} // Convert field.value to a Date object if it exists
                            onChange={(date) => handleInputChange(index, { target: { name: 'value', value: date.toLocaleDateString('en-US') } })}
                            dateFormat="yyyy-MM-dd"
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-left"
                        />
                    ) : field.type === 'fileupload' ? ( // File upload condition
                        <input
                            type="file"
                            onChange={(e) => handleFileChange(e, index)} // Pass index to handleFileChange
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-left"
                        />
                    ) : field.type === 'textarea' ? (
                        <textarea
                            name="value"
                            value={field.value}
                            placeholder="Value"
                            onChange={(e) => handleInputChange(index, e)}
                            style={{ width: '90%' }}
                            className="flex-grow w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-left"
                        />
                    ) : field.type === 'checkbox' ? (
                        <>
                            <input
                                type="checkbox"
                                name="yes"
                                checked={field.isYesChecked}
                                onChange={() => handleYesCheckboxChange(index)}
                            /> Yes
                            <input
                                type="checkbox"
                                name="no"
                                checked={field.isNoChecked}
                                onChange={() => handleNoCheckboxChange(index)}
                            /> No
                        </>
                    ) : (
                        <input
                            type={field.type}
                            name="value"
                            value={field.value}
                            placeholder="Value"
                            onChange={(e) => handleInputChange(index, e)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-left"
                        />
                    )}
                    <button type="button" onClick={() => handleRemoveField(index)} className="px-4 py-2 text-black bg-red-400 rounded-md focus:outline-none hover:bg-red-600">Remove</button>
                </div>
            ))}

            <button type="button" onClick={handleAddField} className="px-4 py-2 text-black bg-gray-400 rounded-md focus:outline-none hover:bg-gray-600">Add Field</button>


            <button type="submit" className="px-4 py-2 text-black bg-green-300 rounded-md focus:outline-none hover:bg-green-600">Submit</button>
        </form>
    )}
    {/* {submittedData && (
        <div className="mt-4">
            <h2>Submitted Data</h2>
            <ul>
                {Object.entries(submittedData).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {value}
                    </li>
                ))}
            </ul>
        </div>
    )}
    {apiData && (
        <div className="mt-4">
            <h2>API Data</h2>
            <ul>
                {Object.entries(apiData).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {value.toString()}
                    </li>
                ))}
            </ul>
        </div>
    )} */}
</div>

        
    );
}

export default DynamicFieldForm;
