import { useState } from "react";

import TextBox from "../common/TextBox";
import DateInput from "../common/DateInput";
import OpenAccordianPNG from '../images/open-accordion.png';
import ClosedAccordianPNG from '../images/closed-accordion.png';

const SystemInformation = ({ id, isEdittable, clientData, handleFieldChange }) => {
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
                    <h2 className="text-lg font-medium">System Information</h2>

                    <p>Kindly provide complete and valid information for System Information section.</p>
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
                                        <TextBox placeholder="Original Data Source" isEdittable={isEdittable} value={clientData.system_information_original_data_source}
                                            handleChange={(e) => handleFieldChange('system_information_original_data_source', e.target.value)} />
                                    </div>
                                    <div className="flex-1">
                                        <TextBox placeholder="Import Notes" isEdittable={isEdittable} value={clientData.system_information_import_notes}
                                            handleChange={(e) => handleFieldChange('system_information_import_notes', e.target.value)} />
                                    </div>
                                    <div className="flex-1">
                                        <DateInput placeholder="Import Date and Time" width={290} isEdittable={isEdittable} value={clientData.system_information_import_date}
                                            handleChange={(selectedDate) => handleFieldChange('system_information_import_date', selectedDate)} />
                                    </div>
                                </div>
                                <div className="flex space-x-6">
                                    <div className="flex-1">
                                        <TextBox placeholder="PRN Practice Fusion" isEdittable={isEdittable} value={clientData.system_information_prn}
                                            handleChange={(e) => handleFieldChange('system_information_prn', e.target.value)} />
                                    </div>
                                    <div className="flex-1">
                                        <TextBox placeholder="#" isEdittable={isEdittable} value={clientData.system_information_chart_number}
                                            handleChange={(e) => handleFieldChange('system_information_chart_number', e.target.value)} />
                                    </div>
                                    <div className="flex-1">
                                        <TextBox placeholder="#" isEdittable={isEdittable} value={clientData.system_information_system_id}
                                            handleChange={(e) => handleFieldChange('system_information_system_id', e.target.value)} />
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

export default SystemInformation;