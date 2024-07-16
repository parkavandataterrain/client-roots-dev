import React, { useState, useMemo, useEffect } from 'react';
import { Link, unstable_usePrompt, useLocation } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Sidebar.css';

import Sidebar from './SideBar';
import GeneralInformation from './General_Information';
import ContactInformation from './ContactInformation';
import Demographics from './Demographics';
import AddressInformation from './Address';
import CustomFields from './CustomFields';
import PreferredPharmacy from './PreferredPharmacy';
import InsuranceInformation from './InsuranceInformation';
import SystemInformation from './SystemInformation';
import PrimaryButton from '../common/PrimaryButton';
import SecondaryButton from '../common/SecondaryButton';
import AlertSuccess from '../common/AlertSuccess';
import AlertError from '../common/AlertError';
import { useParams } from 'react-router-dom';
import axios from '../../helper/axiosInstance';
import EditPNG from '../images/edit.png';
import SavePNG from '../images/save.png';
import EditGreenPNG from '../images/edit-green.png';
import SaveGreenPNG from '../images/save-green.png';
import CustomFieldsForAll from './CustomFieldsForAll';
import CustomFieldsForUser from './CustomFieldsForUser';
import { useUnsavedChangesWarning } from '../common/useUnSavedChangesWarning';
// import DynamicFieldForm from './clientprofile/dynamicfield'

const bulkupdate = {
  first_name: 'John',
  middle_name: 'Michael',
  last_name: 'Doe1',
  nickname_preferred_name: 'Johnny',
  preferred_pronouns: 'He/Him',
  email_address: 'john.doe1@example.com',
  mobile_number: '1234567890',
  home_phone: '0987654321',
  work_phone: '5551234567',
  best_way_to_contact: 'Mobile Number',
  primary_phone: 'Work Phone Number',
  comfortable_language: 'English',
  other_language: 'Spanish',
  date_of_birth: '1985-07-15',
  age: '38',
  sex: 'Male',
  social_security_number: '123456789',
  us_armed_forces: 'U.S. Veteran',
  describe_the_place_you_live: 'I own a house or apartment',
  race: 'White/Caucasian',
  other_race: '',
  ethnicity: 'White',
  gender_identity: 'Cisgender',
  other_gender_identity: '',
  sexual_orientation: 'Heterosexual/Straight',
  other_sexual_orientation: '',
  mailing_address_line_1: '123 Main St',
  mailing_address_line_2: 'Apt 4B',
  city: 'Springfield',
  state: 'IL',
  zip: '62704',
  usual_location: 'Home',
  preferred_pharmacy_name: 'City Pharmacy',
  preferred_pharmacy_location: '456 Elm St, Springfield, IL',
  preferred_pharmacy_phone: '5559876543',
  insurance_primary_carrier_name: 'HealthFirst',
  insurance_primary_subscriber_id: 'H123456789',
  insurance_primary_subscriber_name: 'John M. Doe',
  insurance_primary_group_name: 'CompanyHealth',
  insurance_primary_group_id: 'G987654321',
  insurance_primary_relation_to_insured: 'Parent',
  insurance_primary_effective_from: '2022-01-01',
  insurance_primary_effective_to: '2024-01-01',
  insurance_secondary_carrier_name: 'WellCare',
  insurance_secondary_subscriber_id: 'W987654321',
  insurance_secondary_subscriber_name: 'John M. Doe',
  insurance_secondary_group_name: 'BackupHealth',
  insurance_secondary_group_id: 'BG123456789',
  insurance_secondary_relation_to_insured: 'Spouse',
  insurance_secondary_effective_from: '2024-05-21',
  insurance_secondary_effective_to: '2025-09-05',
  insurance_tertiary_carrier_name: 'MediAssist',
  insurance_tertiary_subscriber_id: 'M123456789',
  insurance_tertiary_subscriber_name: 'John M. Doe',
  insurance_tertiary_group_name: 'ExtraCare',
  insurance_tertiary_group_id: 'E987654321',
  insurance_tertiary_relation_to_insured: 'Spouse',
  insurance_tertiary_effective_from: '2022-01-01',
  insurance_tertiary_effective_to: '2024-01-01',
  emergency_contact_1_name: 'Jane Doe',
  emergency_contact_1_email_address: 'jane.doe@example.com',
  emergency_contact_1_relationship: 'Spouse',
  emergency_contact_1_address_line_1: '123 Main St',
  emergency_contact_1_address_line_2: 'Apt 4B',
  emergency_contact_1_city: 'San Francisco',
  emergency_contact_1_state: 'California',
  emergency_contact_1_zip: '62704',
  emergency_contact_1_phone: '1234567890',
  emergency_contact_2_name: 'Mary Johnson',
  emergency_contact_2_email_address: 'mary.johnson@example.com',
  emergency_contact_2_relationship: 'Friend',
  emergency_contact_2_address_line_1: '789 Oak St',
  emergency_contact_2_address_line_2: '',
  emergency_contact_2_city: 'San Jose',
  emergency_contact_2_state: 'Texas',
  emergency_contact_2_zip: '62705',
  emergency_contact_2_phone: '5551239876',
  system_information_original_data_source: 'Online Form Submission',
  system_information_import_notes: 'Imported from v1.0 system',
  system_information_import_date: '2024-05-20',
  system_information_prn: 'PRN12345',
  system_information_chart_number: 'CHART67890',
  system_information_system_id: 'SYS112233',
};

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
  custom_fields: null,
  do_you_live_at_this_address: null,
};

const errorInitialValues = {
  first_name: '',
  last_name: '',
  email_address: '',
  mobile_number: '',
  emergency_contact_1_email_address: '',
  emergency_contact_1_zip: '',
  emergency_contact_2_email_address: '',
  emergency_contact_2_zip: '',
  age: '',
  zip_address_n_usual_location: '',
  insurance_primary_effective_from: '',
  insurance_primary_effective_to: '',
  insurance_secondary_effective_from: '',
  insurance_secondary_effective_to: '',
  insurance_tertiary_effective_from: '',
  insurance_tertiary_effective_to: '',
};

const ClientProfile = ({ isNew }) => {
  const { clientId } = useParams();
  const location = useLocation();
  const [isEditable, setIsEditable] = useState(!isNew);
  const [clientData, setClientData] = useState(initialValues);
  const [selectedOption, setSelectedOption] = useState('');

  const [errors, setErrors] = useState(errorInitialValues);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [customFieldsAll, setCustomFieldsAll] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [badge, setBadge] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  const mode = clientId && !isNew ? 'edit' : 'new';

  useUnsavedChangesWarning(isDirty);

  

  const parseToDnDCustomFields = (items) => {
    return items.map((itm) => {
      let constructField = {
        type: itm.datatype,
        props: {
          label: itm.question,
          value: itm.answer,
          width: 'w-full',
        },
        ...itm,
      };

      if (itm.datatype === 'text' || itm.datatype === 'textarea') {
        constructField.props = {
          ...constructField.props,
          type: 'text',
        };
      }

      if (itm.datatype === 'datetime') {
        constructField.props = {
          ...constructField.props,
          type: 'date',
          width: 'w-1/4',
        };
      }

      if (itm.datatype === 'imageupload') {
        constructField.props = {
          ...constructField.props,
          type: 'file',
          accept: 'image/*',
          base64: itm.answer,
        };
      }

      if (itm.datatype === 'imageupload') {
        constructField.props = {
          ...constructField.props,
          type: 'file',
          accept:
            '.png, .jpg, .jpeg, .pdf, .doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          type: 'file',
          isFile: true,
          base64: itm.answer,
        };
      }

      return constructField;
    });
  };

  let customFieldsTags = useMemo(() => {
    return customFields.map((field) => {
      let cf = {
        datatype: field.type,
        question: field.props.label,
        answer: '',
      };

      if (field.type === 'imageupload' || field.type === 'fileupload') {
        cf.answer = field.props.base64;
      } else {
        cf.answer = field.props.value;
      }

      if (mode === 'edit') {
        if (field.id) {
          cf.id = field.id;
        }
      }

      return cf;
    });
  }, [customFields]);

  const refetchCustomFields = () => {
    axios
      .get(`/clientinfo-api/${clientId}`)
      .then((response) => {
        const parsedCF = parseToDnDCustomFields(
          response.data.custom_fields || []
        );
        setCustomFieldsAll(parsedCF);
        setCustomFields(parsedCF);
      })
      .catch((error) => {
        console.error('Error fetching client data:', error);
      });
  };

  useEffect(() => {
    if (clientId && !isNew) {
      axios
        .get(`/clientinfo-api/${clientId}`)
        .then((response) => {
          setClientData(response.data);
          const parsedCF = parseToDnDCustomFields(
            response.data.custom_fields || []
          );

          setCustomFieldsAll(parsedCF);
          setCustomFields(parsedCF);
        })
        .catch((error) => {
          console.error('Error fetching client data:', error);
        });

      fetchBadge();
    }
  }, [clientId, isNew]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');
    if (mode === 'edit') {
      handleEdit();
    }
  }, []);

  const handleFieldChange = (field, value) => {
    setClientData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
    setClientData((prevData) => ({
      ...prevData,
      do_you_live_at_this_address: event.target.value,
    }));
    setIsDirty(true);
  };

  // console.log('kijlsfkdjlf', selectedOption);

  const validateEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);

  const validateNumber = (number) => !isNaN(number);

  const validateZipCode = (zip) => validateNumber(zip) && zip.length <= 5;

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!clientData.first_name) {
      errors.first_name = 'Mandatory field';
      isValid = false;
    }
    if (!clientData.last_name) {
      errors.last_name = 'Mandatory field';
      isValid = false;
    }
    if (clientData.email_address && !validateEmail(clientData.email_address)) {
      errors.email_address = 'Invalid Email';
      isValid = false;
    }
    if (clientData.mobile_number && !validateNumber(clientData.mobile_number)) {
      errors.mobile_number = 'Mobile must be a number';
      isValid = false;
    }

    //Emergency contact 1
    if (
      clientData.emergency_contact_1_email_address &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        clientData.emergency_contact_1_email_address
      )
    ) {
      errors.emergency_contact_1_email_address = 'Invalid Email';
      isValid = false;
    }
    if (clientData.emergency_contact_1_zip) {
      if (isNaN(clientData.emergency_contact_1_zip)) {
        errors.emergency_contact_1_zip = 'Zip code must be a number';
        isValid = false;
      } else if (clientData.emergency_contact_1_zip.length > 5) {
        errors.emergency_contact_1_zip =
          'Zip code cannot be more than 5 characters';
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
      errors.emergency_contact_2_email_address = 'Invalid Email';
      isValid = false;
    }
    if (clientData.emergency_contact_2_zip) {
      if (isNaN(clientData.emergency_contact_2_zip)) {
        errors.emergency_contact_2_zip = 'Zip code must be a number';
        isValid = false;
      } else if (clientData.emergency_contact_2_zip.length > 5) {
        errors.emergency_contact_2_zip =
          'Zip code cannot be more than 5 characters';
        isValid = false;
      }
    }

    //Demographics
    if (clientData.age && isNaN(clientData.age)) {
      errors.age = 'Age must be a number';
      isValid = false;
    }

    //Address usual address
    if (clientData.zip_address_n_usual_location) {
      if (isNaN(clientData.zip_address_n_usual_location)) {
        errors.zip_address_n_usual_location = 'Zip code must be a number';
        isValid = false;
      } else if (clientData.zip_address_n_usual_location.length > 5) {
        errors.zip_address_n_usual_location =
          'Zip code cannot be more than 5 characters';
        isValid = false;
      }
    }

    // Date to insurance_primary_effective_from Validation
    if (
      clientData.insurance_primary_effective_from &&
      clientData.insurance_primary_effective_to
    ) {
      if (
        new Date(clientData.insurance_primary_effective_from) >
        new Date(clientData.insurance_primary_effective_to)
      ) {
        errors.insurance_primary_effective_from =
          'From date cannot be later than To date';
        isValid = false;
      }
    }

    // Date to insurance_primary_effective_from Validation
    if (
      clientData.insurance_primary_effective_from &&
      clientData.insurance_primary_effective_to
    ) {
      if (
        new Date(clientData.insurance_primary_effective_from) >
        new Date(clientData.insurance_primary_effective_to)
      ) {
        errors.insurance_primary_effective_to =
          'To date cannot be earlier than From date';
        isValid = false;
      }
    }

    // Date to insurance_secondary_effective_from Validation
    if (
      clientData.insurance_secondary_effective_from &&
      clientData.insurance_secondary_effective_to
    ) {
      if (
        new Date(clientData.insurance_secondary_effective_from) >
        new Date(clientData.insurance_secondary_effective_to)
      ) {
        errors.insurance_secondary_effective_from =
          'From date cannot be later than To date';
        isValid = false;
      }
    }

    // Date to insurance_secondary_effective_to Validation
    if (
      clientData.insurance_secondary_effective_from &&
      clientData.insurance_secondary_effective_to
    ) {
      if (
        new Date(clientData.insurance_secondary_effective_from) >
        new Date(clientData.insurance_secondary_effective_to)
      ) {
        errors.insurance_secondary_effective_to =
          'To date cannot be earlier than From date';
        isValid = false;
      }
    }

    // Date to insurance_tertiary_effective_from Validation
    if (
      clientData.insurance_tertiary_effective_from &&
      clientData.insurance_tertiary_effective_to
    ) {
      if (
        new Date(clientData.insurance_tertiary_effective_from) >
        new Date(clientData.insurance_tertiary_effective_to)
      ) {
        errors.insurance_tertiary_effective_from =
          'From date cannot be later than To date';
        isValid = false;
      }
    }

    // Date to insurance_tertiary_effective_to Validation
    if (
      clientData.insurance_tertiary_effective_from &&
      clientData.insurance_tertiary_effective_to
    ) {
      if (
        new Date(clientData.insurance_tertiary_effective_from) >
        new Date(clientData.insurance_tertiary_effective_to)
      ) {
        errors.insurance_tertiary_effective_to =
          'To date cannot be earlier than From date';
        isValid = false;
      }
    }

    setErrors(errors);
    return isValid;
  };

  const handleSave = (event) => {
    event.preventDefault();

    setErrors(errorInitialValues);
    setShowErrorAlert(false);
    setShowSuccessAlert(false);

    const isValid = validateForm();
    if (!isValid) {
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
      return;
    }

    let postClientData = {
      ...clientData,
      custom_fields: customFieldsTags,
      status: 'pending',
    };
    // console.log('ClientForm-data', { customFieldsTags, postClientData });

    if (isNew || clientData?.status === null) {
      postClientData.status = 'pending';
    }
    console.log({ postClientData });
    const apiEndpoint = isNew
      ? `/clientinfo-api/`
      : `/clientinfo-api/${clientId}`;

    const axiosMethod = isNew ? axios.post : axios.put;
    axiosMethod(apiEndpoint, postClientData)
      .then((response) => {
        setShowErrorAlert(false);
        setShowSuccessAlert(true);
      })
      .catch((error) => {
        setErrorMsg(error?.message);
        setShowErrorAlert(true);
        setShowSuccessAlert(false);
      });

    setIsDirty(true);
  };

  const closeSuccessAlert = () => setShowSuccessAlert(false);
  const closeErrorAlert = () => setShowErrorAlert(false);

  const handleClick = (accordionId) => {
    // console.log('Inside handleClick');
    // console.log('accordian id', `accordion-${accordionId}`);
    const accordionElement = document.getElementById(
      `accordian-${accordionId}`
    );
    // console.log('accordionElement', accordionElement);
    if (accordionElement) {
      // console.log('Inside accordionElement');
      accordionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleEdit = () => {
    setIsEditable(false);
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
  };

  const fetchBadge = async () => {
    try {
      const response = await axios.get(`/UserNameBadge/${clientId}`);
      const { data } = response;
      setBadge(data);
    } catch (e) {
      console.error({ e });
    }
  };
  return (
    <div className="h-full bg-gray-50">
      {/* <button
        onClick={() => {
          setClientData((prev) => {
            return { ...prev, ...bulkupdate };
          });
        }}
      >
        update bulk
      </button> */}
      {showSuccessAlert && (
        <AlertSuccess
          message="Saved successfully"
          handleClose={closeSuccessAlert}
        />
      )}
      {showErrorAlert && (
        <AlertError
          message={errorMsg || 'Invalid form values'}
          handleClose={closeErrorAlert}
        />
      )}
      <div className="bg-white p-4 shadow">
        {isNew ? (
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
              <Link to={'/'}>
                <p className="text-green-700 font-medium">Dashboard</p>
              </Link>
              {/* <Link to={`/clientchart/${clientId}`}>
              <p className='text-green-700 font-medium'>Client Chart</p>
            </Link> */}
              <p className="text-green-700 font-medium">AMD Profile</p>
              <p className="text-green-700 font-medium pr-8">Manage Program</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-between mb-0 mt-4 pl-4">
            <div className="flex space-x-12">
              <h2 className="text-gray-800 text-2xl font-medium">
                Client: {clientData.first_name} {clientData.last_name}
              </h2>

              <button onClick={handleEdit} disabled={!isEditable}>
                <div className="flex space-x-2 items-center">
                  <img
                    // src={EditGreenPNG}
                    src={isEditable ? EditGreenPNG : EditPNG}
                    // onMouseEnter={handleMouseEnter}
                    // onMouseLeave={() => setIsHovered(false)}
                    class={`w-6 h-6 ${isEditable ? '' : 'cursor-not-allowed'}`}
                  />
                  <div
                    className={
                      isEditable
                        ? 'text-green-800 text-base font-medium'
                        : 'text-gray-800 text-base font-medium cursor-not-allowed'
                    }
                  >
                    Edit
                  </div>
                </div>
              </button>
              <button onClick={handleSave} disabled={isEditable}>
                <div className="flex space-x-2 items-center">
                  <img
                    // src={SaveGreenPNG}
                    src={!isEditable ? SaveGreenPNG : SavePNG}
                    // onMouseEnter={handleMouseEnter}
                    // onMouseLeave={() => setIsHovered(false)}
                    class={`w-5 h-6 ${!isEditable ? '' : 'cursor-not-allowed'}`}
                  />
                  <div
                    className={
                      !isEditable
                        ? 'text-green-800 text-base font-medium'
                        : 'text-gray-800 text-base font-medium cursor-not-allowed'
                    }
                  >
                    Save
                  </div>
                </div>
              </button>
            </div>
            <div className="flex space-x-8">
              <Link to={'/'}>
                <p className="text-green-700 font-medium">Dashboard</p>
              </Link>
              <Link to={`/clientchart/${clientId}`}>
                <p className="text-green-700 font-medium">Client Chart</p>
              </Link>
              <p className="text-green-700 font-medium">AMD Profile</p>
              <p className="text-green-700 font-medium pr-8">Manage Program</p>
            </div>
          </div>
        )}
        <div className="border-b border-green-800 mt-2 mb-4"></div>
        <div className="flex">
          <Sidebar
            handleClick={handleClick}
            isNew={isNew}
            isEditable={isEditable}
          />
          <div className="w-full px-2 space-y-4">
            {location.pathname === '/clientprofilenew' ? (
              <></>
            ) : (
              <div>
                <GeneralInformation
                  id={1}
                  badge={badge}
                  isEdittable={isEditable}
                  clientData={clientData}
                  handleFieldChange={handleFieldChange}
                />
              </div>
            )}
            <div>
              <ContactInformation
                id={2}
                errors={errors}
                isEdittable={isEditable}
                clientData={clientData}
                handleFieldChange={handleFieldChange}
              />
            </div>
            <div>
              <Demographics
                id={3}
                errors={errors}
                isEdittable={isEditable}
                clientData={clientData}
                handleFieldChange={handleFieldChange}
              />
            </div>
            <div>
              <AddressInformation
                id={4}
                errors={errors}
                isEdittable={isEditable}
                clientData={clientData}
                handleFieldChange={handleFieldChange}
                handleRadioChange={handleRadioChange}
                selectedOption={selectedOption}
              />
            </div>
            {/* <div>
              <CustomFields id={5} isEdittable={isEditable} clientData={clientData} handleFieldChange={handleFieldChange} />
            </div> */}
            <div>
              <PreferredPharmacy
                id={6}
                isEdittable={isEditable}
                clientData={clientData}
                handleFieldChange={handleFieldChange}
              />
            </div>
            <div>
              <InsuranceInformation
                id={7}
                isEdittable={isEditable}
                clientData={clientData}
                handleFieldChange={handleFieldChange}
                errors={errors}
              />
            </div>
            <div>
              <SystemInformation
                id={8}
                isEdittable={isEditable}
                clientData={clientData}
                handleFieldChange={handleFieldChange}
              />
            </div>

            <div>
              <CustomFieldsForUser
                id={10}
                onChange={(dndItms) => {
                  setCustomFields(dndItms);
                }}
                dndItems={customFields}
                viewMode={true && !isNew}
                editMode={!isEditable && !isNew}
              />
            </div>

            {!isNew && !isEditable && (
              <div>
                <CustomFieldsForAll
                  id={10}
                  onChange={(dndItms) => {
                    setCustomFieldsAll(dndItms);
                  }}
                  dndItems={customFieldsAll}
                  viewMode={mode === 'view'}
                  mode={mode}
                  refresh={refetchCustomFields}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;

// mock dd

// {
//   "age": "",
//   "first_name": "TesFN",
//   "middle_name": "TestMN",
//   "last_name": "TestLN",
//   "nickname_preferred_name": "testfml",
//   "preferred_pronouns": "mr",
//   "email_address": "tt@tt.in",
//   "mobile_number": "9876543211",
//   "home_phone": "9876543232",
//   "work_phone": "1234567890",
//   "best_way_to_contact": "Mobile Number",
//   "primary_phone": "Home Phone Number",
//   "comfortable_language": "English",
//   "other_language": "Tamil",
//   "date_of_birth": "2024-05-23",
//   "sex": "Female",
//   "social_security_number": "123456789",
//   "us_armed_forces": "acs",
//   "describe_the_place_you_live": "Home or Apartment",
//   "race": "Native American",
//   "other_race": "",
//   "ethnicity": "Black",
//   "gender_identity": "Transgender",
//   "other_gender_identity": "",
//   "sexual_orientation": "Bisexual",
//   "other_sexual_orientation": "",
//   "mailing_address_line_1": "",
//   "mailing_address_line_2": "",
//   "city": "",
//   "state": "",
//   "zip": "",
//   "usual_location": "",
//   "preferred_pharmacy_name": "",
//   "preferred_pharmacy_location": "",
//   "preferred_pharmacy_phone": "",
//   "insurance_primary_carrier_name": "icici",
//   "insurance_primary_subscriber_id": "12345",
//   "insurance_primary_subscriber_name": "ra",
//   "insurance_primary_group_name": "",
//   "insurance_primary_group_id": "",
//   "insurance_primary_relation_to_insured": "Spouse",
//   "insurance_primary_effective_from": "2024-05-20",
//   "insurance_primary_effective_to": "2024-06-01",
//   "insurance_secondary_carrier_name": "hdfc",
//   "insurance_secondary_subscriber_id": "34565",
//   "insurance_secondary_subscriber_name": "ed",
//   "insurance_secondary_group_name": "",
//   "insurance_secondary_group_id": "",
//   "insurance_secondary_relation_to_insured": "Spouse",
//   "insurance_secondary_effective_from": "2024-05-21",
//   "insurance_secondary_effective_to": "2024-05-27",
//   "insurance_tertiary_carrier_name": "policybaz",
//   "insurance_tertiary_subscriber_id": "1234",
//   "insurance_tertiary_subscriber_name": "ef",
//   "insurance_tertiary_group_name": "",
//   "insurance_tertiary_group_id": "",
//   "insurance_tertiary_relation_to_insured": "Friend",
//   "insurance_tertiary_effective_from": "2024-05-30",
//   "insurance_tertiary_effective_to": "2024-07-05",
//   "emergency_contact_1_name": "EC1",
//   "emergency_contact_1_email_address": "ec1@tt.in",
//   "emergency_contact_1_relationship": "Parent",
//   "emergency_contact_1_address_line_1": "ec1",
//   "emergency_contact_1_address_line_2": "usa",
//   "emergency_contact_1_city": "San Francisco",
//   "emergency_contact_1_state": "California",
//   "emergency_contact_1_zip": "600123",
//   "emergency_contact_1_phone": "9500890890",
//   "emergency_contact_2_name": "EC2",
//   "emergency_contact_2_email_address": "ec2@tt.in",
//   "emergency_contact_2_relationship": "Child",
//   "emergency_contact_2_address_line_1": "ec2",
//   "emergency_contact_2_address_line_2": "usa",
//   "emergency_contact_2_city": "San Diego",
//   "emergency_contact_2_state": "Washington",
//   "emergency_contact_2_zip": "123456",
//   "emergency_contact_2_phone": "9500890890",
//   "system_information_original_data_source": "",
//   "system_information_import_notes": "",
//   "system_information_import_date": "",
//   "system_information_prn": "",
//   "system_information_chart_number": "",
//   "system_information_system_id": ""
// }
