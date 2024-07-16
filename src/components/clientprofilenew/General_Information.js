import { useState } from "react";

import TextBox from "../common/TextBox";
import DateInput from "../common/DateInput";
import TestJPG from '../images/test.jpg';
import OpenAccordianPNG from '../images/open-accordion.png';
import ClosedAccordianPNG from '../images/closed-accordion.png';

const GeneralInformation = ({ id, isEdittable, clientData, handleFieldChange }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className="border border-gray-300  bg-gray-50 rounded-md" id={`accordian-${id}`}>
            <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={toggleAccordion}
            >
                <div>
                    <h2 className="text-lg font-medium">General Information</h2>

                    <p>Kindly provide complete and valid information for the General Information section.</p>
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
                            <div className="border-1 w-[25.92vh] h-[32.40vh] border-1
                border-gray-600/50 bg-white rounded-md flex flex-col justify-center items-center">
                                <img src={require('../images/avatar-man.png')} alt="Client Photo" className="w-28 h-28 object-cover rounded-full border-1 border-zinc-500" />
                                <div className="mt-4 text-center text-green-800">{clientData.first_name} {clientData.last_name}</div>
                            </div>

                            <div className="flex flex-col justify-between flex-1">
                                <div className="flex space-x-6">
                                    <div className="flex-1">
                                        <TextBox placeholder="Client Status" isEdittable={isEdittable} value={"Pending"} />
                                    </div>
                                    <div className="flex-1">
                                        <DateInput placeholder="Client Date" isEdittable={isEdittable} value={"2022-10-01"} />
                                    </div>
                                </div>
                                <TextBox placeholder="Client Programs" isEdittable={isEdittable} value={"STOMP"} />
                                <div className="flex space-x-6">
                                    <div className="flex-1">
                                        <TextBox placeholder="Client Navigator Name" isEdittable={isEdittable} value={"Laura"} />
                                    </div>
                                    <div className="flex-1">
                                        <TextBox placeholder="Client System ID" isEdittable={isEdittable} value={"54321a"} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default GeneralInformation;