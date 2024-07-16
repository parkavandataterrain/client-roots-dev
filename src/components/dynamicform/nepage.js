import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiURL from '../../apiConfig';
import Swal from 'sweetalert2';
import Select from 'react-select';
import DateInput from './FormElements/DateInput';
import HeaderElement from './FormElements/HeaderElement';
import DividerElement from './FormElements/DividerElement';
import InputElement from './FormElements/InputElement';
import TextAreaElement from './FormElements/TextAreaElement';
import SelectElement from './FormElements/SelectElement';
import MultiSelectElement from './FormElements/MultiSelectElement';
import { saveAs } from 'file-saver';

function NewPage() {
  const location = useLocation();
  const { tableName } = useParams();
  console.log(tableName, 'Table Name');
  const [tableColumns, setTableColumns] = useState([]);
  const [formData, setFormData] = useState({});
  const [tableHeaders, setTableHeaders] = useState([]);
  const [tableStructure, setTableStructure] = useState([]);
  const [columnInfo, setColumnInfo] = useState([]);
  console.log(tableName, tableColumns);
  const [droplist, setDroplist] = useState({});
  const formRef = useRef(null);

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      const newDroplist = {};
      for (const column of tableColumns) {
        console.log(column.type);
        console.log('column.name', column.name);

        if (
          column.type === 'USER-DEFINED' ||
          ((column.type === 'USER-DEFINED' || column.type === 'ARRAY') &&
            (column.name.endsWith('_multiple') ||
              column.name.endsWith('_checkbox')))
        ) {
          const enumType = `enum_type_${tableName}_${column.name}_enum_type`;

          try {
            const response = await axios.get(`${apiURL}/get_enum_labels/`, {
              params: {
                enum_type: enumType,
              },
            });
            const dropdownOptions = response.data.enum_labels;
            newDroplist[enumType] = dropdownOptions;
            console.log('Dropdown options for', enumType, ':', dropdownOptions);
          } catch (error) {
            console.error(
              'Error fetching dropdown options for',
              enumType,
              ':',
              error
            );
          }
        }
      }
      setDroplist(newDroplist);
      console.log('Droplist updated:', droplist);
    };

    fetchDropdownOptions();
  }, [tableName, tableColumns]);

  useEffect(() => {
    fetchTableHeaders();
  }, [tableName]);

  useEffect(() => {
    fetchTableStructure();
  }, []);

  // const handleDropdownOptionsFetch = async (enumType) => {
  //     try {
  //         const response = await axios.get(`${apiURL}/get_enum_labels/`, {
  //             params: {
  //                 enum_type: enumType
  //             }
  //         });
  //         const dropdownOptions = response.data.enum_labels;
  //         setDroplist(dropdownOptions);
  //         console.log('Dropdown options:', dropdownOptions);
  //     } catch (error) {
  //         console.error('Error fetching dropdown options:', error);
  //     }
  // };

  const fetchTableHeaders = async () => {
    try {
      const cleanedTableName = tableName.replace('roots', '');
      const response = await axios.get(
        `${apiURL}/insert_header_get/${tableName}/`
      );
      if (response.data.headers) {
        setTableHeaders(response.data.headers);
        console.log('headr', response.data.headers);
      } else {
        console.error('No headers found in response:', response);
      }
    } catch (error) {
      console.error('Error fetching table headers:', error);
    }
  };

  const fetchTableStructure = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/get_table_structure/${tableName}`
      );
      if (response.headers['content-type'].includes('application/json')) {
        console.log('response.data.columns', response.data.columns);
        console.log('response.data', response.data.columns);
        setTableColumns(response.data.columns);

        // Fetch column info after fetching table structure
        fetchColumnInfo();
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error fetching table structure:', error);
    }
  };

  const fetchColumnInfo = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/get_column_info/${tableName}`
      );
      if (response.headers['content-type'].includes('application/json')) {
        console.log('response.data.columns_info', response.data.columns_info);

        // Update existing columns with additional info
        setTableColumns((prevColumns) =>
          prevColumns.map((column) => ({
            ...column,
            ...response.data.columns_info.find(
              (info) => info.name === column.name
            ),
          }))
        );
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error fetching column info:', error);
    }
  };

  const handleInputChange = (event, columnName) => {
    const value =
      event.target.type === 'file' ? event.target.files[0] : event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [columnName]: value,
    }));
  };

  const handleSubmitPost = async (event) => {
    event.preventDefault();

    // Filter out hidden columns before checking required fields
    const visibleColumns = tableColumns.filter((column) => !column.hidden);
    const requiredFieldsEmpty = visibleColumns.some(
      (column) => column.required && !formData[column.name]
    );

    if (requiredFieldsEmpty) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please fill all required fields.',
      });
      return;
    }

    // if (
    //   location.pathname.includes(query.get('encounter'))(
    //   )
    // )
    const queryParams = new URLSearchParams(location.search);
    console.log(queryParams.getAll('encounter'));

    // console.log(queryParams.getAll('encounter'));
    try {
      console.log(formData);

      let response;
      if (queryParams.get('encounter')) {
        response = await axios.post(
          `${apiURL}/get_table_structure/${tableName}/?encounterId=${queryParams.get(
            'encounterId'
          )}&encounter=select_forms`,
          formData
        );
      } else {
        response = await axios.post(
          `${apiURL}/get_table_structure/${tableName}/`,
          formData
        );
      }

      if (response.status === 201) {
        console.log('Data inserted successfully');
        setFormData({});
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Data inserted successfully',
          timer: 2000,
        });
      } else {
        console.error('Error:', response.data.message);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to insert data. Please fill the required field properly.',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'An unexpected error occurred. Please try again later.',
      });
    }
  };

  const renderInputField = (column) => {
    if (column.hidden) return null;

    let label = column.column_fullname;
    if (column.required) {
      label += ' *';
    }

    switch (column.type) {
      case 'character varying':
        return (
          <div
            key={column.name}
            type="character varying"
            className={`mb-3 ${column.width} character-varying`}
          >
            {/* <label className="block mb-1">{label}</label>
            <input
              type="text"
              value={formData[column.name] || ""}
              onChange={(event) => handleInputChange(event, column.name)}
              className={`${column.width} border border-gray-300 rounded px-4 py-2`}
            /> */}
            <InputElement
              label={label}
              onChange={(event) => handleInputChange(event, column.name)}
              type="text"
              value={formData[column.name] || ''}
              required={column.is_nullable === 'NO'}
            />
          </div>
        );
      case 'integer':
        return (
          <div
            key={column.name}
            type="integer"
            className={`mb-3 ${column.width} integer`}
          >
            {/* <label className="block mb-1">{label}</label>
            <input
              type="number"
              value={formData[column.name] || ""}
              onChange={(event) => handleInputChange(event, column.name)}
              className={`${column.width} border border-gray-300 rounded px-4 py-2`}
            /> */}
            <InputElement
              label={label}
              type="number"
              value={formData[column.name] || ''}
              onChange={(event) => handleInputChange(event, column.name)}
              required={column.is_nullable === 'NO'}
            />
          </div>
        );
      case 'text':
        return (
          <div
            key={column.name}
            type="text"
            className={`mb-3 ${column.width} text`}
          >
            {/* <label className="block mb-1">{label}</label>
            <textarea
              value={formData[column.name] || ""}
              onChange={(event) => handleInputChange(event, column.name)}
              className={`${column.width} border border-gray-300 rounded px-4 py-2`}
            /> */}
            <TextAreaElement
              label={label}
              value={formData[column.name] || ''}
              onChange={(event) => handleInputChange(event, column.name)}
              required={column.is_nullable === 'NO'}
            />
          </div>
        );
      case 'double precision':
        return (
          <div
            key={column.name}
            type="double precision"
            className={`mb-3 ${column.width} double-precision`}
          >
            {/* <label className="block mb-1">{label}</label>
            <input
              type="number" // Use type "number" for input validation
              step="0.01" // Allow floating-point numbers
              value={formData[column.name] || ""}
              onChange={(event) => handleInputChange(event, column.name)}
              className={`${column.width} border border-gray-300 rounded px-4 py-2`}
            /> */}

            <InputElement
              label={label}
              type="number" // Use type "number" for input validation
              step="0.01" // Allow floating-point numbers
              value={formData[column.name] || ''}
              onChange={(event) => handleInputChange(event, column.name)}
              required={column.is_nullable === 'NO'}
            />
          </div>
        );
      case 'boolean':
        return (
          <div
            key={column.name}
            type="boolean"
            className={`mb-3 ${column.width} boolean`}
          >
            {/* <label className="block mb-1">{label}</label>
            <select
              value={formData[column.name] || ""}
              onChange={(event) => handleInputChange(event, column.name)}
              className={`${column.width} border border-gray-300 rounded px-4 py-2`}
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select> */}

            <SelectElement
              label={label}
              required={column.is_nullable === 'NO'}
              options={[
                {
                  label: 'Yes',
                  value: 'true',
                },
                {
                  label: 'No',
                  value: 'false',
                },
              ]}
              value={formData[column.name] || ''}
              onChange={(event) => handleInputChange(event, column.name)}
            />
          </div>
        );
      case 'bytea':
        return (
          <div
            key={column.name}
            type="bytea"
            className={`mb-3 ${column.width} bytea`}
          >
            {/* <label className="block mb-1">{label}</label>
            <input
              type="file"
              accept=".png, .jpg, .jpeg, .pdf"
              onChange={(event) => handleInputChange(event, column.name)}
              className={`${column.width} border border-gray-300 rounded px-4 py-2`}
            /> */}
            <InputElement
              label={label}
              required={column.is_nullable === 'NO'}
              type="file"
              accept=".png, .jpg, .jpeg, .pdf"
              onChange={(event) => handleInputChange(event, column.name)}
            />
          </div>
        );
      case 'character':
        return (
          <div
            key={column.name}
            type="character"
            className={`mb-0 ${column.width} character`}
          >
            <HeaderElement type="header" label={label} />
          </div>
        );
      case 'json':
        return (
          <div
            key={column.name}
            type="json"
            className={`mb-1 ${column.width} json`}
          >
            <HeaderElement label={label} />
          </div>
        );
      case 'line':
        return (
          <div
            key={column.name}
            type="line"
            className={`mb-4 ${column.width} line`}
          >
            <DividerElement />
          </div>
        );

      case 'timestamp without time zone':
        return (
          <div
            key={column.name}
            type="timestamp without time zone"
            className={`mb-2 ${column.width} timestamp-without-time-zone`}
          >
            <DateInput
              label={label}
              required={column.is_nullable === 'NO'}
              type="date"
              value={formData[column.name] || ''}
              onChange={(event) => handleInputChange(event, column.name)}
              className={`border border-gray-300 rounded px-4 py-2`}
              width={column.width}
            />
          </div>
        );
      default:
        console.log(column.type);

        // console.log(column.type)

        // const dropdownOptions1=[1,2,3]

        const key = `enum_type_${tableName}_${column.name}_enum_type`;

        console.log(key);

        // console.log("keykey",key)

        if (key.endsWith('multiple_enum_type')) {
          console.log('qdwewwwwwwwwwwwwwww', droplist, droplist[key]);
          return (
            <div
              key={column.name}
              type="multiple_enum_type"
              className={`mb-3 ${column.width} multiple_enum_type`}
            >
              {/* <label className="block mb-1">{label} xxx</label>
              <Select
                options={
                  droplist[key] &&
                  droplist[key].map((option) => ({
                    value: option,
                    label: option,
                  }))
                }
                isMulti
                value={
                  formData[column.name]
                    ? formData[column.name].map((option) => ({
                        value: option,
                        label: option,
                      }))
                    : []
                }
                onChange={(selectedOptions) => {
                  const selectedValues = selectedOptions
                    ? selectedOptions.map((option) => option.value.toString())
                    : [];
                  console.log(
                    column.name,
                    selectedValues,
                    "ssssssssssssssssssssssssssss"
                  );
                  setFormData((prevState) => ({
                    ...prevState,
                    [column.name]: selectedValues,
                  }));
                  console.log(
                    column.name,
                    selectedValues,
                    "ssssssssssssssssssssssssssss"
                  );
                }}
                className={`${column.width} border border-gray-300 rounded px-4 py-2`}
                placeholder="Select"
              /> */}

              <MultiSelectElement
                label={label}
                required={column.is_nullable === 'NO'}
                options={
                  droplist[key]
                    ? droplist[key].map((option) => ({
                        value: option,
                        label: option,
                      }))
                    : []
                }
                value={
                  formData[column.name]
                    ? formData[column.name].map((option) => ({
                        value: option,
                        label: option,
                      }))
                    : []
                }
                onChange={(selectedOptions) => {
                  const selectedValues = selectedOptions
                    ? selectedOptions.map((option) => option.value.toString())
                    : [];
                  console.log(
                    column.name,
                    selectedValues,
                    'ssssssssssssssssssssssssssss'
                  );
                  setFormData((prevState) => ({
                    ...prevState,
                    [column.name]: selectedValues,
                  }));
                  console.log(
                    column.name,
                    selectedValues,
                    'ssssssssssssssssssssssssssss'
                  );
                }}
                placeholder="Select"
              />
            </div>
          );
        }

        // else if (key.endsWith("checkbox_enum_type")){
        //     console.log('checkbox_enum_type okkk')
        //     // console.log(droplist[key])
        //     return (
        //         <div key={column.name} className="mb-1">
        //             <label className="block mb-1">{label}</label>
        //             <Select

        //                 options={droplist[key] && droplist[key].map(option => ({ value: option, label: option }))}
        //                 isMulti
        //                 value={formData[column.name] ? formData[column.name].map(option => ({ value: option, label: option })) : []}
        //                 onChange={(selectedOptions) => {
        //                     const selectedValues = selectedOptions ? selectedOptions.map(option => option.value.toString()) : [];
        //                     console.log(column.name,selectedValues,'ssssssssssssssssssssssssssss')
        //                     setFormData(prevState => ({
        //                         ...prevState,
        //                         [column.name]: selectedValues
        //                     }));
        //                     console.log(column.name,selectedValues,'ssssssssssssssssssssssssssss')
        //                 }}
        //                 className={`${column.width} border border-gray-300 rounded px-4 py-2`}
        //                 placeholder="Select"
        //             />

        //         </div>
        //     );

        // }
        else if (key.endsWith('checkbox_enum_type')) {
          console.log('checkbox_enum_type okkk');
          // console.log(droplist[key])
          return (
            <div
              key={column.name}
              type="checkbox_enum_type"
              className={`mb-3 ${column.width} checkbox_enum_type`}
            >
              {/* <label className="block mb-1">{label}</label>
              {droplist[key] &&
                droplist[key].map((option) => (
                  <div key={option}>
                    <input
                      type="checkbox"
                      id={option}
                      value={option}
                      checked={
                        formData[column.name] &&
                        formData[column.name].includes(option)
                      }
                      onChange={(event) => {
                        const value = event.target.value;
                        setFormData((prevState) => ({
                          ...prevState,
                          [column.name]: prevState[column.name]
                            ? prevState[column.name].includes(value)
                              ? prevState[column.name].filter(
                                  (val) => val !== value
                                )
                              : [...prevState[column.name], value]
                            : [value],
                        }));
                      }}
                    />
                    <label htmlFor={option}>{option}</label>
                  </div>
                ))} */}
              <div className="m-1">
                <label
                  className={`block flex gap-2 text-gray-500 text-xs font-bold my-2`}
                >
                  <span>{label}</span>
                  {column.is_nullable === 'NO' && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <div className={`flex flex-column gap-2`}>
                  {droplist[key] &&
                    droplist[key].map((option) => (
                      <div key={option} className={`flex gap-1 items-center`}>
                        <input
                          type="checkbox"
                          id={option}
                          value={option}
                          checked={
                            formData[column.name] &&
                            formData[column.name].includes(option)
                          }
                          onChange={(event) => {
                            const value = event.target.value;
                            setFormData((prevState) => ({
                              ...prevState,
                              [column.name]: prevState[column.name]
                                ? prevState[column.name].includes(value)
                                  ? prevState[column.name].filter(
                                      (val) => val !== value
                                    )
                                  : [...prevState[column.name], value]
                                : [value],
                            }));
                          }}
                        />
                        <label htmlFor={option}>{option}</label>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          );
        } else {
          console.log('test');
          console.log('droplist', droplist);

          return (
            <div
              key={column.name}
              type="select"
              className={`mb-3 ${column.width} select`}
            >
              {/* <label className="block mb-1">{label}</label>
              <select
                value={formData[column.name] || ""}
                onChange={(event) => handleInputChange(event, column.name)}
                className={`${column.width} border border-gray-300 rounded px-4 py-2`}
              >
                <option value="">Select</option>
                {droplist[key] &&
                  droplist[key].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select> */}
              <SelectElement
                label={label}
                required={column.is_nullable === 'NO'}
                options={
                  droplist[key]
                    ? droplist[key].map((option) => {
                        return option;
                      })
                    : []
                }
                value={formData[column.name] || ''}
                onChange={(event) => handleInputChange(event, column.name)}
              />
            </div>
          );
        }
    }
  };

  const getStylesheetContent = () => {
    const sheets = document.styleSheets;
    let cssText = '';

    for (const sheet of sheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (const rule of rules) {
          cssText += rule.cssText;
        }
      } catch (e) {
        console.log('Error reading stylesheet:', e);
      }
    }
    return cssText;
  };

  const downloadHTML = () => {
    console.log('downloadHTML');
    console.log('table Name', tableName);
    const formContainerHtml = formRef.current.outerHTML;
    const styles = getStylesheetContent();
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
        <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>

        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${tableName}</title>
        <style>${styles}</style>
        <style>

            button {
                margin: 20px;
                padding: 10px 20px;
                font-size: 16px;
            }

            .popup {
                display: none;
                position: fixed;
                z-index: 1;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0, 0, 0, 0.5);
            }


            .close {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
            }

            .close:hover,
            .close:focus {
                color: black;
                text-decoration: none;
                cursor: pointer;
            }

            ul {
                list-style: none;
                padding: 0;
            }

            ul li {
                margin: 10px 0;
            }

            ul li button {
                width: 100%;
                padding: 10px;
                font-size: 16px;
            }

        </style>
        <style>


          button {
              padding: 12px 24px;
              font-size: 16px;
              cursor: pointer;
              border: none;
              background-color: #007bff;
              color: white;
              border-radius: 5px;
              transition: background-color 0.3s, transform 0.2s;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          button:hover {
              background-color: #0056b3;
              transform: scale(1.05);
          }

          button:active {
              background-color: #004080;
          }
          #openPopup{
            display: none;

          }
          .openPopup {
              display: none;
              position: fixed;
              z-index: 1;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              display: flex;
              justify-content: center;
              align-items: center;
              animation: fadeIn 0.3s;
          }

          .popup-content {
            background: linear-gradient(135deg, #ffffff, #f0f0f0);
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
              width: 300px;
              text-align: center;
              animation: slideIn 0.3s;
              position: relative;
              top: 30%;
              left: 30%;

          }
          .popup-content ul {
              padding-right: 30px;

          }
  

          .close {
              color: #aaa;
              float: right;
              font-size: 28px;
              font-weight: bold;
              cursor: pointer;
              transition: color 0.3s;
          }

          .close:hover,
          .close:focus {
              color: #333;
          }

          h2 {
              font-size: 24px;
              margin-bottom: 20px;
              color: #333;
          }

          ul {
              list-style: none;
              padding: 0;
          }

          ul li {
              margin: 10px 0;
          }

          ul li button {
              width: 100%;
              padding: 12px;
              font-size: 16px;
              border-radius: 5px;
              border: none;
              background-color: #007bff;
              color: white;
              cursor: pointer;
              transition: background-color 0.3s, transform 0.2s;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          ul li button:hover {
              background-color: #0056b3;
              transform: scale(1.05);
          }

          ul li button:active {
              background-color: #004080;
          }

          @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
          }

          @keyframes slideIn {
              from { transform: translateY(-20px); }
              to { transform: translateY(0); }
          }

        </style>
        <style>
          /* Modal styles */
          .modal {
              display: none; 
              position: fixed; 
              z-index: 1; 
              left: 0;
              top: 0;
              width: 100%; 
              height: 100%; 
              overflow: auto; 
              background-color: rgb(0,0,0); 
              background-color: rgba(0,0,0,0.4); 
              padding-top: 60px; 
          }

          .modal-content {
              background-color: #fefefe;
              margin: 5% auto; 
              padding: 20px;
              border: 1px solid #888;
              width: 80%; 
          }

          .close {
              color: #aaa;
              float: right;
              font-size: 28px;
              font-weight: bold;
          }

          .close:hover,
          .close:focus {
              color: black;
              text-decoration: none;
              cursor: pointer;
          }

        </style>

      </head>
      <body>${formContainerHtml}</body>
      <script>

        const button_info = document.createElement('button');
        button_info.setAttribute('id', 'openModal');
        button_info.textContent = 'Info';
        document.body.appendChild(button_info);

        // info modal

            const modal = document.createElement('div');
            modal.id = 'myModal';
            modal.classList.add('modal');

            const modalContent = document.createElement('div');
            modalContent.classList.add('modal-content');

            const closeSpan = document.createElement('span');
            closeSpan.classList.add('close');
            closeSpan.innerHTML = '&times;';
            closeSpan.addEventListener('click', function() {
                modal.style.display = 'none';
            });
            modalContent.appendChild(closeSpan);

            const title = document.createElement('h2');
            title.textContent = 'Information';
            modalContent.appendChild(title);

            const ul = document.createElement('ul');
            const items = [
                'Save in local: Data will be saved locally until reset or uploaded to the database. Data will remain local.',
                'Upload to database: You can save the data offline. Once online, you can upload the data, and it will be stored in the same place where this data is stored in the app.',
                'Download & View: If you want to check how much data is present, you can download and view it.'
            ];
            items.forEach(itemText => {
                const li = document.createElement('li');
                li.innerHTML = '<strong>' + itemText.split(':')[0] + '</strong>' + itemText.split(':')[1];
                ul.appendChild(li);
            });
            modalContent.appendChild(ul);

            modal.appendChild(modalContent);

            document.body.appendChild(modal);

        //  --------- end of infomodal
          var my_modal = document.getElementById("myModal");
          var btn_modal = document.getElementById("openModal");
          var span_close = document.getElementsByClassName("close")[0];

          btn_modal.onclick = function() {
              my_modal.style.display = "block";
          }

          span_close.onclick = function() {
              my_modal.style.display = "none";
          }

          window.onclick = function(event) {
              if (event.target == modal) {
                  my_modal.style.display = "none";
              }
          }


        document.addEventListener('DOMContentLoaded', function() {
                    // Initialize flatpickr on all elements with id="dateInput"
                    flatpickr("#dateInput", {
                        dateFormat: "m/d/Y"
                    });
                });

        
        const popup = document.createElement('div');
        popup.id = 'openPopup';
        popup.className = 'openPopup';

        // Create the popup content div
        const popupContent = document.createElement('div');
        popupContent.className = 'popup-content';

        // Create the close button
        const closeButton = document.createElement('span');
        closeButton.id = 'closePopup';
        closeButton.className = 'close';
        closeButton.innerHTML = '&times;';

        // Create the heading
        const heading = document.createElement('h2');
        heading.textContent = 'Data uploading to Database';

        // Create the list
        const list = document.createElement('ul');

        // Create the list items and buttons
        // const actions = [
        //     { id: 'addClientInfo', text: 'Add Client Info' },
        //     { id: 'addPriorityList', text: 'Add Priority List' },
        //     { id: 'addEncounterNotes', text: 'Add Encounter Notes' }
        // ];

        // actions.forEach(action => {
        //     const listItem = document.createElement('li');
        //     const button = document.createElement('button');
        //     button.id = action.id;
        //     button.textContent = action.text;
        //     listItem.appendChild(button);
        //     list.appendChild(listItem);
        // });

        // Append all elements to their respective parents
        popupContent.appendChild(closeButton);
        popupContent.appendChild(heading);
        popupContent.appendChild(list);
        popup.appendChild(popupContent);
        document.body.appendChild(popup);

        // document.getElementById('addClientInfo').addEventListener('click', () => {
        //       console.log('need to call the api for addClientInfo');
        //       console.log(formData);
        // });

        // document.getElementById('addPriorityList').addEventListener('click', () => {
        //   console.log('need to call the api for addPriorityList');
        // });

        // document.getElementById('addEncounterNotes').addEventListener('click', () => {
        //   console.log('need to call the api for addEncounterNotes');
        // });

        // document.getElementById('openPopup').addEventListener('click', () => {
            
        // });
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        var randomIntegerInRange = localStorage.getItem("randomIntegerInRange")
        if (!randomIntegerInRange){
          randomIntegerInRange = getRandomInt(1, 1000);
          localStorage.setItem('randomIntegerInRange',randomIntegerInRange)
        }else if(randomIntegerInRange == null){
          randomIntegerInRange = getRandomInt(1, 1000);

          localStorage.setItem('randomIntegerInRange',randomIntegerInRange)
        }
        
        console.log("randomIntegerInRange")
        console.log(randomIntegerInRange)


        var formData = [];
        var columnData = []
        var dict_data = []

        if (localStorage.getItem('dict_data'+randomIntegerInRange)){
          dict_data = JSON.parse(localStorage.getItem('dict_data'+randomIntegerInRange))
        }
        if (localStorage.getItem('columnData'+randomIntegerInRange)){
          columnData = JSON.parse(localStorage.getItem('columnData'+randomIntegerInRange))
        }
        if (localStorage.getItem('formData'+randomIntegerInRange)){
          formData = JSON.parse(localStorage.getItem('formData'+randomIntegerInRange))
        }

        console.log("formData");
        console.log(formData);
        console.log("columnData");
        console.log(columnData);
        console.log("dict_data");
        console.log(dict_data);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save in Local';
        saveButton.type = 'button';
        saveButton.setAttribute('class','bg-[#5BC4BF] text-white hover:bg-teal-700 font-bold mt-2.5 p-2 px-4 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500  text-xs')
        saveButton.setAttribute('id','save')

        document.querySelector('form .text-center').insertAdjacentElement('afterbegin', saveButton);

        const uploadButton = document.createElement('button');
        uploadButton.textContent = 'Upload to Database';
        uploadButton.type = 'button';
        uploadButton.setAttribute('class','bg-[#5BC4BF] text-white hover:bg-teal-700 font-bold mt-2.5 p-2 px-4 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500  text-xs')
        uploadButton.setAttribute('id','upload')
        document.querySelector('form #save').insertAdjacentElement('afterend', uploadButton);


        document.getElementById('closePopup').addEventListener('click', () => {
          document.getElementById('openPopup').style.display = 'none';
        });

        function updateNetworkStatus() {
            if (!navigator.onLine) {
                alert('There is no internet connection');
                return false 
            }else{
              return true 
            }
        }
        

        button_div = document.querySelector('form .text-center')
        button_div.style.display = 'flex'
        button_div.style.justifyContent = 'space-around' 
        document.querySelector('form [type="submit"]').style.display = 'none'

        
        // function isValidDateFormat(dateString) {
        //     const regex = /^(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/d{4}$/;
        //     if (!regex.test(dateString)) {
        //         return false;
        //     }
        //     const [month, day, year] = dateString.split('/').map(Number);
        //     const date = new Date(year, month - 1, day);
        //     return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
        // }
        saveButton.onclick = function() {
            let divs = document.querySelectorAll('form div div');
            let formdata1 = []
            let columnData1 = []
            let count = 0
            let dict_values = {}

            divs.forEach(div => {
              parent_type = div.getAttribute('type')
              type_character = parent_type
              if (type_character === 'character varying'){
                console.log('character varying')

                label_data = div.querySelector('label span').textContent.trim()
                input_data = div.querySelector('input[type="text"]').value.trim()
                columnData1.push(label_data)
                formdata1.push(input_data)
                console.log("formdata1");
                console.log(formdata1);
                console.log("columnData1");
                console.log(columnData1);
                if (input_data){
                  dict_values['col_'+count] = input_data

                }
                count++
                console.log(count);
              }
              if (type_character === 'character' || type_character === 'json'){
                  console.log('character')
                  label_data = div.querySelector('h1').textContent.trim()
                  // columnData1.push(label_data)
                  // formdata1.push('')
                  console.log("columnData1");
                  console.log(columnData1);
                  count++
                // dict_values['col_'+count] = input_data

              }
              else if (type_character === 'integer' || type_character === 'double precision'){
                  console.log('integer')
                  label_data = div.querySelector('label span').textContent.trim()
                  input_data = div.querySelector('input[type="number"]').value.trim()
                  columnData1.push(label_data)
                  formdata1.push(input_data)
                  console.log("formdata1");
                  console.log(formdata1);
                  console.log("columnData1");
                  console.log(columnData1);
                  if (input_data){
                    dict_values['col_'+count] = input_data

                  }

                  count++
                console.log(count);


              }
              else if (type_character === 'text'){
                  console.log('text')
                  label_data = div.querySelector('label span').textContent.trim()
                  input_data = div.querySelector('textarea').value.trim()
                  columnData1.push(label_data)
                  formdata1.push(input_data)
                  console.log("formdata1");
                  console.log(formdata1);
                  console.log("columnData1");
                  console.log(columnData1);
                  if (input_data){
                    dict_values['col_'+count] = input_data

                  }

                  count++
                  console.log(count);

                

              }
              
              else if (type_character === 'boolean' || type_character === 'select'){
                  console.log('integer')
                  label_data = div.querySelector('label span').textContent.trim()
                  input_data = div.querySelector('select').value.trim()
                  columnData1.push(label_data)
                  formdata1.push(input_data)
                  console.log("formdata1");
                  console.log(formdata1);
                  console.log("columnData1");
                  console.log(columnData1);
                  if (input_data){
                    dict_values['col_'+count] = input_data

                  }
                count++

                console.log(count);

                

              }
              else if (type_character === 'bytea'){
                  console.log('bytea')
                  label_data = div.querySelector('label span').textContent.trim()
                  columnData1.push(label_data)
                  input_data = div.querySelector('[type="file"]')
                  formdata1.push("")
                  if (input_data){
                    dict_values['col_'+count] = ''
                  }

                  count++
                  console.log(count);

              }
              
              else if (type_character === 'line'){
                  console.log('line')
                  label_data = div.querySelector('div').textContent.trim()
                  // columnData1.push(label_data)
                  // formdata1.push('')
                  // console.log("columnData1");
                  // console.log(columnData1);
                  count++
                // dict_values['col_'+count] = input_data

              }
              else if (type_character === 'timestamp without time zone'){
                  console.log('timestamp without time zone')
                  label_data = div.querySelector('label span').textContent.trim()
                  input_data = div.querySelector('#dateInput').value.trim()
                  columnData1.push(label_data)
                  formdata1.push(input_data)
                  console.log("formdata1");
                  console.log(formdata1);
                  console.log("columnData1");
                  console.log(columnData1);
                  if (input_data){
                    dict_values['col_'+count] = input_data
                  }

                  count++
                  console.log(count);


              }
              else if (type_character === 'multiple_enum_type'){
                  console.log('multiple_enum_type')
                  label_data = div.querySelector('label span').textContent.trim()
                  // input_data = div.querySelector('input [type="checkbox"]').value.trim()
                  columnData1.push(label_data)
                  // formdata1.push(input_data)
                  formdata1.push("")
                  console.log("formdata1");
                  console.log(formdata1);
                  console.log("columnData1");
                  console.log(columnData1);
                  // if (input_data){
                  //   dict_values['col_'+count+'_multiple'] = ['option-1']
                  // }

                  count++
                  console.log(count);


              }
              else if (type_character === 'checkbox_enum_type'){
                  console.log('multiple_enum_type')
                  label_data = div.querySelector('label span').textContent.trim()
                  input_data = div.querySelectorAll('input[type="checkbox"]')
                  data = []
                  for (let i of input_data){
                      if (i.checked){
                          data.push(i.value)
                      }
                  }
                  console.log(data)
                  if (data){
                    dict_values['col_'+count+'_checkbox'] = data
                  }
                  count++
                  console.log(count);
              }
            
            });
            dict_data.push(dict_values)

            
            formData.push(formdata1)
            columnData.push(columnData1)
            console.log("count");
            console.log(count);
            console.log("dict_data");
            console.log(dict_data);
            localStorage.setItem('formData'+randomIntegerInRange, JSON.stringify(formData));
            localStorage.setItem('dict_data'+randomIntegerInRange, JSON.stringify(dict_data));
            localStorage.setItem('columnData'+randomIntegerInRange, JSON.stringify(columnData));



            alert('You are saving this document to the current device in offline mode. Any forms collected in offline mode must be uploaded from this device to the application once you regain internet connectivity. Check with your administrator if you need assistance.');
            window.location.reload()
        };
        

        uploadButton.addEventListener('click',(e)=>{
          console.log('button clicked');
          var url = 'https://backend.dataterrain-dev.net/get_table_structure/${tableName}/';

          if (updateNetworkStatus()){
            var dictData = JSON.parse(localStorage.getItem('dict_data'+randomIntegerInRange))
            // console.log("dictData");
            // console.log(dictData);

            for (let data of dictData){
              console.log('fetch data');
              console.log(JSON.stringify(data));
              fetch(url, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              })
              .then(response => response.json())
              .then(data => {
                  heading.textContent =  dictData.length + " Data got updated into Database";
                  console.log('Success:', data);

                  formData = [];
                  columnData = []
                  dict_data = []
                  console.log('clicking reset button');
                  localStorage.clear()
              })
              .catch((error) => {
                  console.error('Error:', error);
              });
            }
            
            console.log("formData");
            console.log(formData);
            console.log("columnData");
            console.log(columnData);
            document.getElementById('openPopup').style.display = 'block';
            
          }
        })

        document.querySelector('form').onsubmit = function(event) {
            if (!updateNetworkStatus()){
                alert('You cant download since you are in offline')
                return ''
              }
            event.preventDefault(); 
            let formData1 = JSON.parse(localStorage.getItem('formData'+randomIntegerInRange));
            let columnData1 = JSON.parse(localStorage.getItem('columnData'+randomIntegerInRange));
            console.log("columnData")
            console.log(columnData)
            console.log("formData")
            console.log(formData)
            if (formData1.length === 0) {
                alert('No data to save!');
                return;
            }
            
            const data = [
                columnData1[0],
                ...formData1
            ];
            
            const worksheet = XLSX.utils.aoa_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Form Data');

            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = '${tableName}.xlsx';
            a.click();
            URL.revokeObjectURL(a.href);

            
        };
      </script>
      </html>

    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    saveAs(blob, `${tableName}.html`);
  };

  return (
    <div className="container mt-3">
      <div
        ref={formRef}
        className="card p-4 shadow "
        style={{ width: '70%', margin: 'auto', backgroundColor: '#f6f6f6' }}
      >
        <div className="card mb-3">
          {/* <img className="card-img-top" style={{ hight: '300px'}} src={Screenshot} alt="Card image cap" /> */}

          <div>
            <ul className="grid grid-cols-1 gap-4">
              {tableHeaders.map((header, index) => (
                <>
                  {/* <motion.li
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                > */}
                  <div className="p-4 bg-white rounded-lg shadow-md">
                    <h1 className="text-xl font-semibold mb-2">{header[2]}</h1>
                    <h3 className="text-base font-medium text-gray-700">
                      {header[3]}
                    </h3>
                  </div>
                  {/* </motion.li> */}
                </>
              ))}
            </ul>
          </div>
        </div>
        {/* <h2 className="text-2xl font-bold mb-4">Form Name - {tableName}</h2> */}
        {tableColumns.length > 0 && (
          <form>
            <div>
              {tableColumns.map((column) => {
                return renderInputField(column);
              })}
              <div
                className="text-center mt-6"
                style={{ display: 'flex', justifyContent: 'space-around' }}
              >
                <button
                  type="submit"
                  onClick={handleSubmitPost}
                  className="bg-[#5BC4BF] text-white hover:bg-teal-700 font-bold mt-2.5 p-2 px-4 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500  text-xs"
                  id="download-btn"
                >
                  Submit
                </button>
                <button
                  onClick={downloadHTML}
                  className="bg-[#5BC4BF] text-white hover:bg-teal-700 font-bold mt-2.5 p-2 px-4 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500  text-xs"
                >
                  Download & View
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default NewPage;
