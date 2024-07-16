import { useState } from "react";

import TextBox from "../common/TextBox";
import DropDown from "../common/Dropdown";

const EmergencyContact1 = ({ heading, isEdittable, clientData, handleFieldChange, errors }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };
    //Drop down options
    const relationshipOptions = [
        { value: 'Parent', label: 'Parent' },
        { value: 'Spouse', label: 'Spouse' },
        { value: 'Child', label: 'Child' },
        { value: 'Sibling', label: 'Sibling' },
        { value: 'Friend', label: 'Friend' },
        { value: 'Other', label: 'Other' }
    ]

    const cityOptions = [
        { value: 'San Francisco', label: 'San Francisco' },
        { value: 'San Jose', label: 'San Jose' },
        { value: 'San Diego', label: 'San Diego' },
        { value: 'Los Angeles', label: 'Los Angeles' },
        { value: 'Houston', label: 'Houston' },
        { value: 'Seattle', label: 'Seattle' }
    ]

    const stateOptions = [
        { value: 'California', label: 'California' },
        { value: 'Washington', label: 'Washington' },
        { value: 'Texas', label: 'Texas' },
    ]

    return (
        <div className="">
            <div className="border-1 border-gray-500/50 m-4">
                <div className="bg-gray-500/50 h-16 flex items-center p-2 text-lg font-medium">
                    {heading}
                </div>
                <div className="p-4 border-t border-gray-300">
                    <div className="flex flex-col justify-between space-y-6">
                        <div className="flex space-x-6">
                            <div className="flex-1">
                                <TextBox placeholder="Name" isEdittable={isEdittable} value={clientData.emergency_contact_1_name}
                                    handleChange={(e) => handleFieldChange('emergency_contact_1_name', e.target.value)} />
                            </div>
                            <div className="flex-1">
                                <TextBox placeholder="Email Address" isEdittable={isEdittable} value={clientData.emergency_contact_1_email_address}
                                    handleChange={(e) => handleFieldChange('emergency_contact_1_email_address', e.target.value)} />
                                {errors.emergency_contact_1_email_address && <div className="text-red-500 text-xs pt-2">{errors.emergency_contact_1_email_address}</div>}
                            </div>
                            <div className="flex-1">
                                <DropDown placeholder="Relationship" options={relationshipOptions} isEdittable={isEdittable} selectedOption={clientData.emergency_contact_1_relationship}
                                    handleChange={(e) => handleFieldChange('emergency_contact_1_relationship', e.value)} />
                            </div>
                        </div>
                        <div className="flex space-x-6">
                            <div className="flex-1">
                                <TextBox placeholder="Address Line #1" isEdittable={isEdittable} value={clientData.emergency_contact_1_address_line_1}
                                    handleChange={(e) => handleFieldChange('emergency_contact_1_address_line_1', e.target.value)} />
                            </div>
                            <div className="flex-1">
                                <TextBox placeholder="Address Line #2" isEdittable={isEdittable} value={clientData.emergency_contact_1_address_line_2}
                                    handleChange={(e) => handleFieldChange('emergency_contact_1_address_line_2', e.target.value)} />
                            </div>
                            <div className="flex-1">
                                <DropDown placeholder="City" options={cityOptions} isEdittable={isEdittable} selectedOption={clientData.emergency_contact_1_city}
                                    handleChange={(e) => handleFieldChange('emergency_contact_1_city', e.value)} />
                            </div>

                        </div>
                        <div className="flex space-x-6">
                            <div className="flex-1">
                                <DropDown placeholder="State" options={stateOptions} isEdittable={isEdittable} selectedOption={clientData.emergency_contact_1_state}
                                    handleChange={(e) => handleFieldChange('emergency_contact_1_state', e.value)} />
                            </div>
                            <div className="flex-1">
                                <TextBox placeholder="Zip Code" isEdittable={isEdittable} value={clientData.emergency_contact_1_zip}
                                    handleChange={(e) => handleFieldChange('emergency_contact_1_zip', e.target.value)} />
                                {errors.emergency_contact_1_zip && <div className="text-red-500 text-xs pt-2">{errors.emergency_contact_1_zip}</div>}
                            </div>
                            <div className="flex-1">
                                <TextBox placeholder="Phone Number" isEdittable={isEdittable} value={clientData.emergency_contact_1_phone}
                                    handleChange={(e) => handleFieldChange('emergency_contact_1_phone', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default EmergencyContact1;