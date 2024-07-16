
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import deleteImage from '../../image/delete.jpg';
import edit from '../../image/edit.jpg';
import bulk from '../../image/bulk.jpg';
import share from '../../image/share.jpg';
import down from '../../image/down.png';
import file from '../../image/file.jpg';
import date from '../../image/date.png';
import apiURL from '../../apiConfig';

function CreateTableComponent() {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState([{ name: '', type: '', notNull: false, width: 'w-full' }]);
  const [showPreview, setShowPreview] = useState(false);
  const columnTypes = ['INTEGER', 'FLOAT', 'VARCHAR(250)', 'TEXT', 'TIMESTAMP', 'BOOLEAN', 'BYTEA','my_enum_type' ];
  const showcolumnType = ['Number', 'Decimal', 'Text', 'Memo', 'Date', 'Boolean', 'File Attachment','Dropdown'];
  const columnwidth = ["w-1/2", "w-1/4", "w-full", "w-3/4"];
  const showcolumnwidth = ['Half', 'Quarter', 'Full', 'Three-quarters'];
  
  const [matchingTables, setMatchingTables] = useState([]);
 
  const [enumValues, setEnumValues] = useState([]);

  
  const [headerValue, setHeaderValue] = useState('');
  const [subHeaderValue, setSubHeaderValue] = useState('');







  const handleEnumValueChange = (index, value) => {
    const newEnumValues = [...enumValues];
    newEnumValues[index] = value;
    setEnumValues(newEnumValues);
  };
  
  // Function to remove enum value
  const removeEnumValue = (index) => {
    const newEnumValues = [...enumValues];
    newEnumValues.splice(index, 1);
    setEnumValues(newEnumValues);
  };
  

  const addEnumValue = (e) => {
    setEnumValues([...enumValues, '']);
    e.preventDefault();
  };
 



  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(columns)
      const response = await axios.post(`${apiURL}/create_table_endpoint/`, {
        table_name: "Roots" + tableName,
        columns: columns,
        enumValues: enumValues
      });
      console.log(response.data);
      await insertHeader();
      navigate('/createtableform');
    } catch (error) {
      console.error('Error:', error.response.data.message);
      window.alert('An error occurred. Please try again later.');
    }
  };






 const insertHeader = async () => {
    try {

      console.log(tableName,headerValue,subHeaderValue)
      console.log(tableName)
      const response = await axios.post(`${apiURL}/insert_header/${tableName}/`, {
        tablename: tableName,
        header_name: headerValue,
        sub_header_name: subHeaderValue,
      });
      console.log(response.data);
   
    } catch (error) {
      console.error('Error:', error);
      
    }
  };


  const handleColumnNameChange = (index, value) => {
    const newColumns = [...columns];
    newColumns[index].name = value;
    setColumns(newColumns);
  };

  const handleColumnTypeChange = (index, value) => {
    const newColumns = [...columns];
    const databaseType = columnTypes[showcolumnType.indexOf(value)];
    newColumns[index].type = databaseType;
    setColumns(newColumns);
  };

  const handleColumnwidthChange = (index, value) => {
    const newColumns = [...columns];
    const columnWidth = columnwidth[showcolumnwidth.indexOf(value)];
    newColumns[index].width = columnWidth;
    setColumns(newColumns);
  };

  const handleNotNullChange = (index) => {
    const newColumns = [...columns];
    newColumns[index].notNull = !newColumns[index].notNull;
    setColumns(newColumns);
  };

  const addColumn = () => {
    setColumns([...columns, { name: '', type: '', notNull: false,width: 'w-full' }]);
  };

  const removeColumn = (index) => {
    const newColumns = [...columns];
    newColumns.splice(index, 1);
    setColumns(newColumns);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="container">
      <h1 className="my-4 text-left" style={{ fontSize: '3rem', color: '#5BC4BF', paddingBottom: '10px' }}>Form Builder</h1>

      <div className="container">

        <div className="container">
          <div className="row my-4">
            <div className="col-12" style={{ borderRadius: '5px 5px 0px 0px', border: '1px solid #5BC4BF', background: '#F6F6F6' }}>
              <nav className="navbar navbar-light bg-light justify-content-between">
                <a>
                  <button className="bg-Teal-500 hover:bg-Teal-700 text-block font-bold py-2 px-4 rounded mb-4 mr-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-Teal-500" style={{ borderRadius: '3px', background: '#9CDADA', marginTop: '20px' }} fdprocessedid="wgjh4" onClick={togglePreview}>Toggle Preview</button>
                </a>
                <form className="form-inline">
                  <a>
                    <Link to="/createtableform" className="bg-Teal-500 hover:bg-Teal-700 text-block font-bold py-2 px-4 rounded mb-4 mr-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-Teal-500" style={{ borderRadius: '3px', background: '#9CDADA' }}>Available Forms</Link>
                  </a>
                  <Link to="/alterTable" className="bg-Teal-500 hover:bg-Teal-700 text-block font-bold py-2 px-4 rounded mb-4 mr-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-Teal-500" style={{ borderRadius: '3px', background: '#9CDADA' }} >Alter Available Forms</Link>
                </form>
              </nav>
            </div>
            {/* <div className="col-2">
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ backgroundColor: '#e0f7fa', borderRadius: '8px', padding: '20px' }}>
                  <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#0097a7' }}>Recent Forms</h1>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Search"
                    aria-label="Search"
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '16px',
                      border: '1px solid #0097a7',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            </div> */}
          </div>
          <div className="row">
           <div className="col-12" style={{ borderRadius: '5px 5px 0px 0px', border: '1px solid #5BC4BF', background: '#F6F6F6' }}>
   
    {showPreview && (
      <form className="mb-4">
        <div className="mb-4">
          <label className="block mb-2">Form Name:</label>
          <span>{tableName}</span>
        </div>
                  <div className="mb-4">
                    <label className="block mb-2">Columns:</label>
                    {columns.map((column, index) => (
                      <div key={index} className="flex flex-wrap">
                        <span className="mr-4">Field Name: {column.name}</span>
                        <span>Field Type: {column.type}</span>
                        <span>Field Width: {column.width}</span>
                      </div>
                    ))}
                  </div>
                </form>
              )}
              <form onSubmit={handleSubmit} className={showPreview ? 'hidden' : 'block'}>
         
                  

                  <div className="mb-4">


                  <div className="mb-4 flex flex-wrap">
                  <label className="block mb-2  mr-4 animate-fadeIn" style={{ fontWeight: 'bold', marginTop: '15px' }}>
    Form Name <span className="text-red-500">*</span>
</label>
<input
    type="text"
    value={tableName}
    placeholder="Enter Form name..."
    onChange={(e) => setTableName(e.target.value)}
    className="border border-gray-300 rounded px-4 mt-2 py-2 w-96 focus:outline-none focus:border-green-500 transition-colors duration-300" 
    style={{ fontWeight: 'bold', marginTop: '10px' }}
/>

    <div className="flex flex-wrap w-full">
        <div className="w-1/2 pr-2">
            <label className="block mb-2 mt-4 animate-fadeIn"style={{ fontWeight: 'bold' }} htmlFor="headerInput">Title </label>
            <input
                id="headerInput"
                type="text"
                value={headerValue}
                onChange={(e) => setHeaderValue(e.target.value)}
                placeholder="Enter Title..."
                className="border border-gray-300 rounded px-4 py-2 mr-4 w-full focus:outline-none focus:border-green-500 transition-colors duration-300 mb-2"
            />
        </div>
        <div className="w-1/2 pl-2">
            <label className="block mb-2 mt-4 animate-fadeIn" htmlFor="subheaderTextarea">Description</label>
            <input
                id="subheaderTextarea"
                value={subHeaderValue}
                onChange={(e) => setSubHeaderValue(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-green-500 transition-colors duration-300 mb-2"
         placeholder="Enter Description..."
            />
        </div>
    </div>
</div>


                </div>
                <div className="mb-4">
                  <label className="block mb-2">Field Name:</label>
                  {columns.map((column, index) => (
                    <div key={index} className="flex flex-wrap mb-2 gap-2 transition-colors duration-300 hover:bg-gray-100">
                      <input
                        type="text"
                        placeholder="Field Name"
                        value={column.name}
                        onChange={(e) => handleColumnNameChange(index, e.target.value)}
                        className="border border-gray-300 w-96 rounded px-4 py-2 mr-2 focus:outline-none focus:border-green-500"
                      />


                      <select
                        value={showcolumnType[columnTypes.indexOf(column.type)]}
                        onChange={(e) => handleColumnTypeChange(index, e.target.value)}
                        className="border border-gray-300 rounded px-4 w-96 py-2 focus:outline-none focus:border-green-500"
                      >
                        <option value="">Select Type</option>
                        {showcolumnType.map((type, i) => (
                          <option key={i} value={type}>{type}</option>
                        ))}
                      </select>





                      {showcolumnType[columnTypes.indexOf(column.type)] === 'Dropdown' && (
  <div>
   
      <div>
        {enumValues.map((value, idx) => (
          <div key={idx} className="mb-2">
            <input
              type="text"
              value={value}
              onChange={(e) => handleEnumValueChange(idx, e.target.value)}
              placeholder={`Enter enum value ${idx + 1}`}
              className="border border-gray-300 rounded px-4 py-2 mr-4"
            />
            {idx >= 0 && (
              <button onClick={() => removeEnumValue(idx)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Remove
              </button>
            )}
          </div>
        ))}
        <button onClick={addEnumValue} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Value
        </button>
      
      </div>
   
  </div>
)}
                      {/* <select
                        value={showcolumnwidth[columnwidth.indexOf(column.width)]}
                        onChange={(e) => handleColumnwidthChange(index, e.target.value)}
                        className="border border-gray-300 rounded px-4 w-32 py-2 focus:outline-none focus:border-green-500"
                      >
                        <option value="">Select Width</option>
                        {showcolumnwidth.map((width, i) => (
                          <option key={i} value={width}>{width}</option>
                        ))}
                      </select> */}

                      <input
                        type="checkbox"
                        checked={column.notNull}
                        onChange={() => handleNotNullChange(index)}
                        className="ml-2"
                      />
                      <label className="w-24 flex items-center justify-center">Required</label>
                      <img
                        src={deleteImage}
                        alt="Delete"
                        onClick={() => removeColumn(index)}
                        className="cursor-pointer ml-2"
                        style={{ width: '20px', height: '20px', display: 'block', margin: 'auto' }}
                      />
                    </div>
                  ))}
                  <button type="button" onClick={addColumn} className="bg-Teal-500 hover:bg-Teal-700 text-block font-bold mt-2.5 py-2 px-4 rounded mb-4 mr-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-Teal-500 w-40" style={{ borderRadius: '3px', background: '#9CDADA', fontSize: '1rem' }}>Add Field</button>
                </div>
                <div className='row' style={{ display: 'flex', justifyContent: 'center' }}>
                  <button type="submit" className="bg-Teal-500 hover:bg-Teal-700 text-block font-bold mt-2.5 py-2 px-4 rounded mb-4 mr-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-Teal-500 w-48" style={{ borderRadius: '3px', background: '#9CDADA', fontSize: '1rem' }}>Create Form</button>
                </div>
              </form>


            </div>
            {/* <div className='col-2'>
              <div>
                {matchingTables.slice(0, 2).map((matchedTableName, index) => {
                  const cleanedTableName = matchedTableName.replace("roots", "");
                  return (
                    <div key={index} className="card border-success mb-3" style={{ maxWidth: '18rem' }}>
                      <div className="card-header bg-transparent border-success">
                        <div className='row'>
                          <div className='col-4'>
                            <img src={edit} alt="Image 1" className="img-fluid" />
                          </div>
                          <div className='col-4'>
                            <img src={share} alt="Image 2" className="img-fluid" />
                          </div>
                          <div className='col-4'>
                            <img src={bulk} alt="Image 3" className="img-fluid" />
                          </div>
                        </div>
                      </div>
                      <div className="card-body text-success">
                        <div style={{ textAlign: 'center' }}>
                          <h5 className="card-title">{cleanedTableName.charAt(0).toUpperCase() + cleanedTableName.slice(1)}</h5>
                          <img src={file} alt="Image 2" className="img-fluid" style={{ width: '60px', height: '60px', flexShrink: 0, margin: 'auto' }} />
                        </div>
                      </div>
                      <div className="card-footer bg-transparent border-success">
                        <div className='row'>
                          <div className='col-6'>
                            <img src={date} alt="File" style={{ width: '40px', height: '40px', flexShrink: 0, margin: 'auto' }} />
                          </div>
                          <div className='col-6'>
                            <img src={down} alt="File" style={{ width: '40px', height: '40px', flexShrink: 0, margin: 'auto' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTableComponent;


