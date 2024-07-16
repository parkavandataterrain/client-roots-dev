import { useState, useEffect, useMemo } from 'react';
import { useTable } from 'react-table';

import { SOCIAL_VITAL_COLUMNS } from '../constants';
import '../css/mypanel.module.css'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import FilterPNG from '../images/filter.png';
import ViewPNG from '../images/view.png';
import OpenAccordianPNG from '../images/open-accordion.png';
import ClosedAccordianPNG from '../images/closed-accordion.png';
import apiURL from '../../apiConfig';

const SocialVitalSigns = ({ id }) => {
    const { clientId } = useParams();
    const token = localStorage.getItem('access_token');

    const [isOpen, setIsOpen] = useState(true);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    const [data, setData] = useState([{
        "id": 10, "domain": "Housing", "risk": "High", "date_last_accessed": "2022-01-16"
    },
    {
        "id": 10, "domain": "Food Access", "risk": "Medium", "date_last_accessed": "2022-01-21"
    },
    {
        "id": 10, "domain": "Financial Security", "risk": "Low", "date_last_accessed": "2022-03-19"
    },
    {
        "id": 10, "domain": "Education/Employment", "risk": "High", "date_last_accessed": "2022-04-23"
    },
    {
        "id": 10, "domain": "Communication and Mobility", "risk": "Medium", "date_last_accessed": "2022-09-21"
    },
    {
        "id": 10, "domain": "Healthcare - Preventiative", "risk": "Medium", "date_last_accessed": "2022-09-21"
    },
    {
        "id": 10, "domain": "Healthcare - General Health", "risk": "Medium", "date_last_accessed": "2022-09-21"
    },
    {
        "id": 10, "domain": "Healthcare - Cardiovascular risk", "risk": "Low", "date_last_accessed": "2022-10-06"
    }
    ]);

    const columns = useMemo(() => SOCIAL_VITAL_COLUMNS, []);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data });

    useEffect(() => {
        axios.get(`${apiURL}/clientsvs-api/${clientId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setData(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching Client SVS Data:', error);
            });
    }, []);

    return (
        <div className="border border-gray-300  bg-green-50/50 rounded-md" id={`accordian-${id}`}>
            <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={toggleAccordion}
            >
                <div>
                    <h2 className="text-lg font-medium">Social Vital Signs</h2>

                    {/* <p>Kindly provide complete and valid information for the Contact Information section.</p> */}
                </div>
                <img
                    src={isOpen ? OpenAccordianPNG : ClosedAccordianPNG}
                    alt={isOpen ? 'Open accordian' : 'Close accordion'}
                    className="ml-2 w-6 h-6"
                />

            </div>
            {
                isOpen && (
                    <div className="py-4 border-t border-gray-300">

                        <div className='flex flex-col px-0 mt-2'>
                            <div className="rounded-lg p-4" >
                                <table {...getTableProps()} className="table">
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
                                                <th className='text-left' style={{ padding: '20px', backgroundColor: 'white', borderBottom: '1px solid #34703C' }}>
                                                    Date Assigned
                                                </th>
                                                <th className='text-center' style={{ minWidth: '130px', backgroundColor: 'white', borderBottom: '1px solid #34703C' }}>
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
                                                    {row.cells.map((cell) => {
                                                        let cellClassName = 'text-left';
                                                        if (cell.value === 'High' || cell.value === 'Yes') {
                                                            cellClassName += ' text-red-500';
                                                        } else if (cell.value === 'Medium') {
                                                            cellClassName += ' text-orange-500';
                                                        } else if (cell.value === 'Low' || cell.value === 'No') {
                                                            cellClassName += ' text-green-500';
                                                        }
                                                        return (
                                                            <td className={cellClassName} {...cell.getCellProps()} style={{ padding: '15px 20px', backgroundColor: 'white', borderTop: '1px solid #E1FBE8' }}>
                                                                {cell.render('Cell')}
                                                            </td>
                                                        );
                                                    })}
                                                    <td style={{ padding: '15px 20px', backgroundColor: 'white', borderTop: '1px solid #E1FBE8' }}>
                                                        2023-10-01
                                                    </td>
                                                    <td className='' style={{ backgroundColor: 'white', borderTop: '1px solid #E1FBE8' }}>
                                                        <img src={ViewPNG} className="w-5 h-5" style={{ display: 'block', margin: '0 auto' }} />
                                                    </td>
                                                </tr>
                                            );
                                        })}
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

export default SocialVitalSigns;