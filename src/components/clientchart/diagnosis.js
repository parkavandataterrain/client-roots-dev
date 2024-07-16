import { useState, useEffect, useMemo } from 'react';
import { useTable } from 'react-table';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';

import { DIAGNOSIS_COLUMNS } from '../constants';
import AddNewButton from '../common/AddNewButton';
import '../css/mypanel.module.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import FilterPNG from '../images/filter.png';
import EditPNG from '../images/edit.png';
import ViewPNG from '../images/view.png';
import OpenAccordianPNG from '../images/open-accordion.png';
import ClosedAccordianPNG from '../images/closed-accordion.png';
import PrimaryButton from '../common/PrimaryButton';
import apiURL from '../../apiConfig';

const Diagnosis = ({ id, setShowAlert }) => {

    const { clientId } = useParams();
    const token = localStorage.getItem('access_token');

    const [isOpen, setIsOpen] = useState(true);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    const [showAddRow, setShowAddRow] = useState(false)

    const [data, setData] = useState([{
        "id": 10, "diagnosis_name": "Housing", "icd10_code": "...", "comments": "comments",
        "last_updated_by": "John Doe", "last_updated_date": "2022-01-21", "start_date": "2022-01-21", "stop_date": "2022-01-21", "status": "Pending"
    },
    {
        "id": 10, "diagnosis_name": "Food Access", "icd10_code": "...", "comments": "comments",
        "last_updated_by": "John Doe", "last_updated_date": "2022-01-21", "start_date": "2022-01-21", "stop_date": "2022-01-21", "status": "Done"

    },
    {
        "id": 10, "diagnosis_name": "Financial Security", "icd10_code": "...", "comments": "comments",
        "last_updated_by": "John Doe", "last_updated_date": "2022-01-21", "start_date": "2022-01-21", "stop_date": "2022-01-21", "status": "Pending"

    },
    {
        "id": 10, "diagnosis_name": "Education/Employment", "icd10_code": "...", "comments": "comments",
        "last_updated_by": "John Doe", "last_updated_date": "2022-01-21", "start_date": "2022-01-21", "stop_date": "2022-01-21", "status": "Done"

    },
    {
        "id": 10, "diagnosis_name": "Legal Status", "icd10_code": "...", "comments": "comments",
        "last_updated_by": "John Doe", "last_updated_date": "2022-01-21", "start_date": "2022-01-21", "stop_date": "2022-01-21", "status": "Pending"

    },
    {
        "id": 10, "diagnosis_name": "General Health", "icd10_code": "...", "comments": "comments",
        "last_updated_by": "John Doe", "last_updated_date": "2022-01-21", "start_date": "2022-01-21", "stop_date": "2022-01-21", "status": "Pending"

    }
    ]);

    const columns = useMemo(() => DIAGNOSIS_COLUMNS, []);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data });

    useEffect(() => {
        axios.get(`${apiURL}/clientdiagnoses-api/${clientId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setData(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching Client Diagnoses Data:', error);
            });
    }, []);


    //Add New Row
    const [newDiagnosis, setNewDiagnosis] = useState({
        start_date: '',
        stop_date: '',
        diagnosis_name: '',
        icd10_code: null,
        diagnosis_status: null,
        last_updated_date: null,
        comments: "",
        last_updated_by: "" // Assign a value here
    });


    function handleAddRow(e) {
        e.stopPropagation();
        setShowAddRow(true)
    }

    // const handleDateChange = (name, value) => {
    //     const formattedDate = format(value, 'yyyy-MM-dd')
    //     console.log("name,value", name, formattedDate)
    //     setValue(name, value);

    //     if (name === "last_updated_date") {
    //         setLastUpdatedDate(formattedDate);
    //     } else if (name === "start_date") {
    //         setStartDate(formattedDate);
    //     } else if (name === "stop_date") {
    //         setStopDate(formattedDate);
    //     }
    //     console.log(lastUpdatedDate, startDate, stopDate)
    // }


    const {
        register,
        //handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm();


    const onSubmit = (data) => {
        console.log(data);
        reset();
        setShowAddRow(false);
        setShowAlert(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = (newDiagnosis) => {
        console.log(newDiagnosis, "dtdrter")
        const formDataWithClientId = {
            ...newDiagnosis,
            last_updated_date: newDiagnosis.last_updated_date ? format(new Date(newDiagnosis.last_updated_date), 'yyyy-MM-dd') : null,
            start_date: newDiagnosis.start_date ? format(new Date(newDiagnosis.start_date), 'yyyy-MM-dd') : null,
            stop_date: newDiagnosis.stop_date ? format(new Date(newDiagnosis.stop_date), 'yyyy-MM-dd') : null,
            client_id: clientId
        };
        console.log(JSON.stringify(formDataWithClientId));
        // Handle adding new medication (existing code)
        axios.post(`${apiURL}/clientdiagnoses-api/`, formDataWithClientId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log("Successfully added:", response.data);
                // Reset form data after submission
                setNewDiagnosis({
                    start_date: '',
                    stop_date: '',
                    diagnosis_name: '',
                    icd10_code: null,
                    diagnosis_status: null,
                    last_updated_date: null,
                    comments: "",
                    last_updated_by: ""
                });
                // Hide the add row section
                setShowAddRow(false);
                // Show alert or perform any other action upon successful submission
                setShowAlert(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            })
            .catch(error => {
                console.error('Error adding client medication:', error);
                // Handle error here, show error message or perform any other action
            });
    };

    const EditableRows = () => {
        return (
            <tr>
                <td style={{ paddingLeft: "10px", padding: '15px 10px', backgroundColor: 'white', borderTop: '1px solid #E1FBE8' }}>
                    <input
                        name="diagnosis_name"
                        id="diagnosis_name"
                        type="text"
                        className="block px-2.5 h-[7vh] w-full text-md rounded-md border-1 focus:outline-none focus:ring-0 peer"
                        value={newDiagnosis.diagnosis_name}
                        onChange={(e) => setNewDiagnosis({ ...newDiagnosis, diagnosis_name: e.target.value })} />
                </td>
                <td style={{ paddingLeft: "10px", backgroundColor: 'white', borderTop: '1px solid #E1FBE8' }}>
                    <input
                        name="icd_code"
                        id="icd_code"
                        type="text"
                        className="block px-2.5 h-[7vh] w-full text-md rounded-md border-1 focus:outline-none focus:ring-0 peer"
                        value={newDiagnosis.icd10_code}
                        onChange={(e) => setNewDiagnosis({ ...newDiagnosis, icd10_code: e.target.value })} />
                </td>
                <td style={{ paddingLeft: "10px", backgroundColor: 'white', borderTop: '1px solid #E1FBE8' }}>
                    <input
                        name="comments"
                        id="comments"
                        type="text"
                        className="block px-2.5 h-[7vh] w-full text-md rounded-md border-1 focus:outline-none focus:ring-0 peer"
                        value={newDiagnosis.comments}
                        onChange={(e) => setNewDiagnosis({ ...newDiagnosis, comments: e.target.value })} />
                </td>
                <td style={{ paddingLeft: "15px", backgroundColor: 'white', borderTop: '1px solid #E1FBE8' }}>
                    <input
                        name="last_updated_by"
                        id="last_updated_by"
                        type="text"
                        className="block px-2.5 h-[7vh] w-full text-md rounded-md border-1 focus:outline-none focus:ring-0 peer"
                        value={newDiagnosis.last_updated_by}
                        onChange={(e) => setNewDiagnosis({ ...newDiagnosis, last_updated_by: e.target.value })} />
                </td>
                <td style={{ paddingLeft: "15px", backgroundColor: 'white', borderTop: '1px solid #E1FBE8' }}>
                    <DatePicker
                        id="last_updated_date"
                        selected={newDiagnosis.last_updated_date}
                        dateFormat="yyyy-MM-dd"
                        className="block px-2.5 h-[7vh] w-full text-md rounded-md border-1 focus:outline-none focus:ring-0 peer"
                        onChange={(e) => setNewDiagnosis({ ...newDiagnosis, last_updated_date: e })}
                    />
                </td>
                <td style={{ paddingLeft: "15px", backgroundColor: 'white', borderTop: '1px solid #E1FBE8' }}>
                    <DatePicker
                        id="start_date"
                        selected={newDiagnosis.start_date}
                        dateFormat="yyyy-MM-dd"
                        className="block px-2.5 h-[7vh] w-full text-md rounded-md border-1 focus:outline-none focus:ring-0 peer"
                        onChange={(e) => setNewDiagnosis({ ...newDiagnosis, start_date: e })}
                    />
                </td>
                <td style={{ paddingLeft: "15px", backgroundColor: 'white', borderTop: '1px solid #E1FBE8' }}>
                    <DatePicker
                        id="stop_date"
                        selected={newDiagnosis.stop_date}
                        dateFormat="yyyy-MM-dd"
                        className="block px-2.5 h-[7vh] w-full text-md rounded-md border-1 focus:outline-none focus:ring-0 peer"
                        onChange={(e) => setNewDiagnosis({ ...newDiagnosis, stop_date: e })}
                    />
                </td>
                <td style={{ paddingLeft: "15px", backgroundColor: 'white', borderTop: '1px solid #E1FBE8' }}>
                    {/* <TextBox name={"status"} id={"status"} register={register} /> */}
                    <input
                        name="status"
                        id="status"
                        type="text"
                        className="block px-2.5 h-[7vh] w-full text-md rounded-md border-1 focus:outline-none focus:ring-0 peer"
                        value={newDiagnosis.diagnosis_status}
                        onChange={(e) => setNewDiagnosis({ ...newDiagnosis, diagnosis_status: e.target.value })} />
                </td>
                <td className='bg-white' >
                    <div className=' flex items-center'>
                        <PrimaryButton handleClick={() => handleSubmit(newDiagnosis)} text={"Save"} width={40} height={'7vh'} />
                    </div>
                    {/* <div className='flex flex-row'>
                        <img src={SavePNG} onClick={saveRow} className="w-5 h-5" style={{ display: 'block', margin: '0 auto' }} />
                        <img src={DeletePNG} onClick={deleteRow} className="w-5 h-5" style={{ display: 'block', margin: '0 auto' }} />
                    </div> */}
                </td>
            </tr>
            // </form>
        );
    };

    return (
        <div className="border border-gray-300  bg-green-50/50 rounded-md" id={`accordian-${id}`}>
            <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={toggleAccordion}
            >
                <div>
                    <h2 className="text-lg font-medium">Diagnoses</h2>

                    {/* <p>Kindly provide complete and valid information for the Contact Information section.</p> */}
                </div>
                <div className='flex space-x-20'>
                    {/* <PrimaryButton text="Add New" width={100} height={35} /> */}
                    {isOpen && <div className=' flex items-center'><AddNewButton handleClick={handleAddRow} /></div>}
                    <div className=' flex items-center'>
                        <img
                            src={isOpen ? OpenAccordianPNG : ClosedAccordianPNG}
                            alt={isOpen ? 'Open accordian' : 'Close accordion'}
                            className="w-6 h-6"
                        />
                    </div>
                </div>
            </div>
            {
                isOpen && (
                    <div className="py-4 border-t border-gray-300">
                        <div className='flex flex-col px-0 mt-2 '>
                            <div className="p-4 overflow-x-auto" >
                                <table {...getTableProps()} className="rounded-lg table">
                                    <thead>
                                        {headerGroups.map((headerGroup) => (
                                            <tr {...headerGroup.getHeaderGroupProps()} >
                                                {headerGroup.headers.map((column) => (
                                                        <th className='text-left' {...column.getHeaderProps()} style={{ padding: '20px', minWidth: column.width, backgroundColor: 'white', borderBottom: '1px solid #34703C' }}>
                                                            <div className='flex flex-row'>
                                                                <div>
                                                                    {column.render('Header')}
                                                                </div>
                                                                <div className='flex items-center'>
                                                                    <img src={FilterPNG} className='ml-3 size-4' />
                                                                </div>
                                                            </div>
                                                        </th>

                                                    ))}
                                                    <th className='text-center' style={{ minWidth: '120px', backgroundColor: 'white', borderBottom: '1px solid #34703C' }}>
                                                        Action
                                                    </th>
                                                </tr>
                                            ))}

                                        </thead>
                                        <tbody {...getTableBodyProps()}>
                                            {rows.map((row) => {
                                                prepareRow(row);
                                                return (
                                                    <tr {...row.getRowProps()}>
                                                        {row.cells.map((cell, index) => {
                                                            let cellClassName = index === 0 ? 'text-left' : 'text-center';
                                                            if (cell.value === 'Pending') {
                                                                cellClassName += ' text-red-500';
                                                            } else if (cell.value === 'Done') {
                                                                cellClassName += ' text-green-500';
                                                            }
                                                            return (
                                                                <td className={cellClassName} {...cell.getCellProps()} style={{ padding: '15px 20px', backgroundColor: 'white', borderTop: '1px solid #E1FBE8' }}>
                                                                    {cell.render('Cell')}
                                                                </td>
                                                            );
                                                        })}
                                                        <td className='' style={{ backgroundColor: 'white', borderTop: '1px solid #E1FBE8' }}>
                                                            <div className='flex flex-row'>
                                                                <img src={EditPNG} className="w-5 h-5" style={{ display: 'block', margin: '0 auto' }} />
                                                                <img src={ViewPNG} className="w-5 h-5" style={{ display: 'block', margin: '0 auto' }} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}

                                            {showAddRow && <EditableRows />}
                                        </tbody>
                                    </table>
                            </div>
                        </div >
                    </div>
                )
            }
        </div >
    );
}

export default Diagnosis;