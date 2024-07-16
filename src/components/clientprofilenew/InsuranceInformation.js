import { useState } from "react";

import Insurance1 from "./Insurance1";
import Insurance2 from "./Insurance2";
import Insurance3 from "./Insurance3";
import OpenAccordianPNG from '../images/open-accordion.png';
import ClosedAccordianPNG from '../images/closed-accordion.png';

const InsuranceInformation = ({ id, isEdittable, clientData, handleFieldChange }) => {
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
                    <h2 className="text-lg font-medium">Insurance Information</h2>

                    <p>Kindly provide complete and valid information for the Insurance Information section.</p>
                </div>
                <img
                    src={isOpen ? OpenAccordianPNG : ClosedAccordianPNG}
                    alt={isOpen ? 'Open accordian' : 'Close accordion'}
                    className="ml-2 w-6 h-6"
                />
            </div>
            {
                isOpen && (
                    <>
                        <div className="p-4 border-t border-gray-300"></div>
                        <Insurance1 heading={"Primary - Insurance"} isEdittable={isEdittable} clientData={clientData} handleFieldChange={handleFieldChange} />
                        <Insurance2 heading={"Secondary - Insurance"} isEdittable={isEdittable} clientData={clientData} handleFieldChange={handleFieldChange} />
                        <Insurance3 heading={"Tertiary - Insurance"} isEdittable={isEdittable} clientData={clientData} handleFieldChange={handleFieldChange} />
                    </>
                )
            }
        </div >
    );
};

export default InsuranceInformation;