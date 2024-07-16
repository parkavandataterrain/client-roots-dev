import { useState } from "react";

import TextBox from "../common/TextBox";
import OpenAccordianPNG from '../images/open-accordion.png';
import ClosedAccordianPNG from '../images/closed-accordion.png';

const CustomFields = ({ id, isEdittable, clientData, handleFieldChange }) => {
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
                    <h2 className="text-lg font-medium">Custom Fields</h2>

                    <p>Kindly provide complete and valid information for custom fields section.</p>
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
                        <div className="p-4 border-t border-gray-300">
                            <div className="flex flex-col justify-between space-y-6">
                                <div className="flex space-x-6">
                                    <div className="flex-1">
                                        <TextBox placeholder="Custom Field 1" isEdittable={isEdittable} />
                                    </div>
                                </div>
                                <div className="flex space-x-6">
                                    <div className="flex-1">
                                        <TextBox placeholder="Custom Field 2" isEdittable={isEdittable} />
                                    </div>
                                </div>
                                <div className="flex space-x-6">
                                    <div className="flex-1">
                                        <TextBox placeholder="Custom Field 3" isEdittable={isEdittable} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </div >
    );
};

export default CustomFields;