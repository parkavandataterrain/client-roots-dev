import { useState } from "react";

import TextBox from "../common/TextBox";
import OpenAccordianPNG from '../images/open-accordion.png';
import ClosedAccordianPNG from '../images/closed-accordion.png';

const PreferredPharmacy = ({ id, isEdittable, clientData, handleFieldChange }) => {
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
                    <h2 className="text-lg font-medium">Preferred Pharmacy</h2>

                    <p>Kindly provide complete and valid information for Preferred Pharmacy section.</p>
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
                                        <TextBox placeholder="Pharmacy Name" isEdittable={isEdittable} value={clientData.preferred_pharmacy_name}
                                            handleChange={(e) => handleFieldChange('preferred_pharmacy_name', e.target.value)} />
                                    </div>
                                    <div className="flex-1">
                                        <TextBox placeholder="Pharmacy Phone Number" isEdittable={isEdittable} value={clientData.preferred_pharmacy_phone}
                                            handleChange={(e) => handleFieldChange('preferred_pharmacy_phone', e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex space-x-6">
                                    <div className="flex-1">
                                        <TextBox placeholder="Pharmacy Address and Location" isEdittable={isEdittable} value={clientData.preferred_pharmacy_location}
                                            handleChange={(e) => handleFieldChange('preferred_pharmacy_location', e.target.value)} />
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

export default PreferredPharmacy;