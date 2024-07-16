import React, { useState } from 'react';
import TextBox from '../common/TextBox';
import DateInput from '../common/DateInput';
import axios from 'axios';
import apiURL from '../../apiConfig';
import PhoneNumberInput from '../common/PhoneNumberInput';

const ContactInformation = () => {
  const token = localStorage.getItem('access_token');

  const [isEditable, setIsEditable] = useState(false);

  const [clientData, setClientData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    sex: '',
    date_of_birth: '',
    mobile_number: '',
    home_phone: '',
    work_phone: '',
    email_address: '',
    best_way_to_contact: '',
    primary_phone: '',
    comfortable_language: '',
    other_language: '',
  });

  const handleFieldChange = (field, value) => {
    setClientData((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submitting clientData:', clientData);
    if (
      !clientData.first_name ||
      !clientData.middle_name ||
      !clientData.last_name ||
      !clientData.date_of_birth ||
      !clientData.sex ||
      !clientData.mobile_number
    ) {
      alert('Please fill out all mandatory fields.');
      return;
    }
    axios
      .post(`${apiURL}/clientinfo-api/`, clientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        alert('Successfully created');
        console.log('Data submitted successfully:', response.data);
        setClientData({
          first_name: '',
          middle_name: '',
          last_name: '',
          sex: '',
          date_of_birth: '',
          mobile_number: '',
          home_phone: '',
          work_phone: '',
          email_address: '',
          best_way_to_contact: '',
          primary_phone: '',
          comfortable_language: '',
          other_language: '',
        });
      })
      .catch((error) => {
        console.error('Error submitting Client Data:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="border border-gray-300 bg-gray-50 rounded-md">
        <div className="flex items-center justify-between p-4 cursor-pointer">
          <div>
            <h2 className="text-lg font-medium">Client Form</h2>
            <p>
              Kindly provide complete and valid information for the General
              Information section.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-300"></div>
        <div className="border-1 border-gray-500/50 mx-4">
          <div className="bg-gray-500/50 h-16 flex items-center p-2 text-lg font-medium ">
            General Information
          </div>
          <div className="p-4 border-t border-gray-300">
            <div className="flex flex-col justify-between space-y-6">
              <div className="flex space-x-6">
                <div className="flex-1">
                  <TextBox
                    placeholder="First Name"
                    isEditable={isEditable}
                    value={clientData.first_name}
                    handleChange={(e) =>
                      handleFieldChange('first_name', e.target.value)
                    }
                    required
                  />
                </div>
                <div className="flex-1">
                  <TextBox
                    placeholder="Middle Name"
                    isEditable={isEditable}
                    value={clientData.middle_name}
                    handleChange={(e) =>
                      handleFieldChange('middle_name', e.target.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <TextBox
                    placeholder="Last Name"
                    isEditable={isEditable}
                    value={clientData.last_name}
                    handleChange={(e) =>
                      handleFieldChange('last_name', e.target.value)
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-6">
                <div className="flex-1">
                  <DateInput
                    placeholder="Date of Birth"
                    width={290}
                    isEditable={isEditable}
                    value={clientData.date_of_birth}
                    handleChange={(selectedDate) =>
                      handleFieldChange('date_of_birth', selectedDate)
                    }
                    required
                  />
                </div>
                <div className="flex-1">
                  <TextBox
                    placeholder="Gender"
                    isEditable={isEditable}
                    value={clientData.sex}
                    handleChange={(e) =>
                      handleFieldChange('sex', e.target.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <PhoneNumberInput
                    placeholder="Mobile Number"
                    type="number"
                    isEditable={isEditable}
                    value={clientData.mobile_number}
                    handleChange={(e) =>
                      handleFieldChange('mobile_number', e.target.value)
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-6">
                <div className="flex-1">
                  <TextBox
                    placeholder="Email Address"
                    isEditable={isEditable}
                    value={clientData.email_address}
                    handleChange={(e) =>
                      handleFieldChange('email_address', e.target.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <PhoneNumberInput
                    placeholder="Home Phone Number"
                    type={'number'}
                    isEditable={isEditable}
                    value={clientData.home_phone}
                    handleChange={(e) =>
                      handleFieldChange('home_phone', e.target.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <PhoneNumberInput
                    placeholder="Work Phone Number"
                    type={'number'}
                    isEditable={isEditable}
                    value={clientData.work_phone}
                    handleChange={(e) =>
                      handleFieldChange('work_phone', e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default ContactInformation;
