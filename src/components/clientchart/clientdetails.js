import { useState, useEffect, useMemo } from 'react';
import { useTable } from 'react-table';

import { COLUMNS } from '../constants';
import '../css/mypanel.module.css'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AvatarPNG from '../images/avatar-man.png';
import OpenAccordianPNG from '../images/open-accordion.png';
import ClosedAccordianPNG from '../images/closed-accordion.png';
import apiURL from '../../apiConfig';

const ClientDetails = ({ id }) => {

    const { clientId } = useParams();
    const token = localStorage.getItem('access_token');

    const [isOpen, setIsOpen] = useState(true);

    const [clientData, setClientData] = useState([]);
    const toggleAccordion = () => {
        setIsOpen(!isOpen);
        console.log(isOpen)
    };

    useEffect(() => {
        axios.get(`${apiURL}/clientinfo-api/${clientId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setClientData(response.data);
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
                    <h2 className="text-lg font-medium">Client Profile</h2>

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
                    <div className="p-4 border-t border-gray-300">

                        <div className="flex space-x-6">
                            {/* <div className="border-1 w-[16.30vw] h-[35.10vh] border-1
                border-green-600 bg-white rounded-md flex flex-col items-center justify-center"> */}
                            <div className="w-80 h-96 bg-white rounded border-1 border-green-800 flex flex-col justify-center items-center">

                                <img src={AvatarPNG} alt="Client Photo" className="w-44 h-44 object-cover rounded-full border-1 border-green-800" />
                                <div className="mt-4 text-center text-green-800">{clientData.first_name} {clientData.last_name}</div>
                            </div>
                            <div className="border-1 w-full border-1
                border-gray-600/50 bg-white rounded-md flex flex-col border-green-800">
                                <div className="my-2 text-center text-lg text-black font-normal">Other Details</div>
                                <div className="w-full border-t border-green-800"></div>

                                <div className='flex flex-row justify-around text-zinc-500 font-medium'>
                                    <div className="flex flex-col  space-y-4 pt-4 pb-12">
                                        <div className="flex justify-between space-x-60">
                                            <div>
                                                Preferred Name:
                                            </div>
                                            <div>
                                                {clientData.nickname_preferred_name}
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                Pronouns:
                                            </div>
                                            <div>
                                                {clientData.preferred_pronouns}
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                Date of Birth:
                                            </div>
                                            <div>
                                                {clientData.date_of_birth}
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                Language:
                                            </div>
                                            <div>
                                                {clientData.comfortable_language}
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                Primary Phone:
                                            </div>
                                            <div>
                                                {clientData.primary_phone}
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                Email:
                                            </div>
                                            <div>
                                                {clientData.email_address}
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                Insurance:
                                            </div>
                                            <div>
                                                {clientData.insurance_primary_carrier_name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-full border-1 border-green-800"></div>
                                    <div className="flex flex-col space-y-4 pt-4 pb-4">
                                        <div className="flex justify-between space-x-60">
                                            <div>
                                                Insurance ID:
                                            </div>
                                            <div>
                                                {clientData.insurance_primary_subscriber_id}
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                Navigator:
                                            </div>
                                            <div>
                                                Mark
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                Current Programs:
                                            </div>
                                            <div>
                                                ECM
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                Closed Programs:
                                            </div>
                                            <div>
                                                Healthy Measures, Diabetes
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default ClientDetails;