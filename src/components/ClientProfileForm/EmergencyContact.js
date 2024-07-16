import { useState } from "react";
import TextBox from "../common/TextBox";
import DropDown from "../common/Dropdown";

const EmergencyContact = ({
  heading,
  isEdittable,
  clientData,
  handleFieldChange,
  errors,
  contactPrefix,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  // Drop down options
  const relationshipOptions = [
    { value: "Parent", label: "Parent" },
    { value: "Spouse", label: "Spouse" },
    { value: "Child", label: "Child" },
    { value: "Sibling", label: "Sibling" },
    { value: "Friend", label: "Friend" },
    { value: "Other", label: "Other" },
  ];

  const cityOptions = [
    { value: "San Francisco", label: "San Francisco" },
    { value: "San Jose", label: "San Jose" },
    { value: "San Diego", label: "San Diego" },
    { value: "Los Angeles", label: "Los Angeles" },
    { value: "Houston", label: "Houston" },
    { value: "Seattle", label: "Seattle" },
  ];

  const stateOptions = [
    { value: "California", label: "California" },
    { value: "Washington", label: "Washington" },
    { value: "Texas", label: "Texas" },
  ];

  return (
    <div className="">
      <div className="border-1 border-gray-500/50 m-4">
        <div
          className="bg-gray-500/50 h-16 flex items-center p-2 text-lg font-medium"
          onClick={toggleAccordion}
        >
          {heading}
        </div>
        {isOpen && (
          <div className="p-4 border-t border-gray-300">
            <div className="flex flex-col justify-between space-y-6">
              <div className="flex space-x-6">
                <div className="flex-1">
                  <TextBox
                    placeholder={`Name${required ? " *" : ""}`}
                    isEdittable={isEdittable}
                    value={clientData[`${contactPrefix}_name`]}
                    handleChange={(e) =>
                      handleFieldChange(`${contactPrefix}_name`, e.target.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <TextBox
                    placeholder={`Email Address${required ? " *" : ""}`}
                    isEdittable={isEdittable}
                    value={clientData[`${contactPrefix}_email_address`]}
                    handleChange={(e) =>
                      handleFieldChange(
                        `${contactPrefix}_email_address`,
                        e.target.value
                      )
                    }
                  />
                  {errors[`${contactPrefix}_email_address`] && (
                    <div className="text-red-500 text-xs pt-2">
                      {errors[`${contactPrefix}_email_address`]}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <DropDown
                    placeholder={`Relationship${required ? " *" : ""}`}
                    options={relationshipOptions}
                    isEdittable={isEdittable}
                    selectedOption={clientData[`${contactPrefix}_relationship`]}
                    handleChange={(e) =>
                      handleFieldChange(
                        `${contactPrefix}_relationship`,
                        e.value
                      )
                    }
                  />
                </div>
              </div>
              <div className="flex space-x-6">
                <div className="flex-1">
                  <TextBox
                    placeholder={`Address Line #1${required ? " *" : ""}`}
                    isEdittable={isEdittable}
                    value={clientData[`${contactPrefix}_address_line_1`]}
                    handleChange={(e) =>
                      handleFieldChange(
                        `${contactPrefix}_address_line_1`,
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="flex-1">
                  <TextBox
                    placeholder={`Address Line #2${required ? " *" : ""}`}
                    isEdittable={isEdittable}
                    value={clientData[`${contactPrefix}_address_line_2`]}
                    handleChange={(e) =>
                      handleFieldChange(
                        `${contactPrefix}_address_line_2`,
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="flex-1">
                  <DropDown
                    placeholder={`City${required ? " *" : ""}`}
                    options={cityOptions}
                    isEdittable={isEdittable}
                    selectedOption={clientData[`${contactPrefix}_city`]}
                    handleChange={(e) =>
                      handleFieldChange(`${contactPrefix}_city`, e.value)
                    }
                  />
                </div>
              </div>
              <div className="flex space-x-6">
                <div className="flex-1">
                  <DropDown
                    placeholder={`State${required ? " *" : ""}`}
                    options={stateOptions}
                    isEdittable={isEdittable}
                    selectedOption={clientData[`${contactPrefix}_state`]}
                    handleChange={(e) =>
                      handleFieldChange(`${contactPrefix}_state`, e.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <TextBox
                    placeholder={`Zip Code${required ? " *" : ""}`}
                    isEdittable={isEdittable}
                    value={clientData[`${contactPrefix}_zip`]}
                    handleChange={(e) =>
                      handleFieldChange(`${contactPrefix}_zip`, e.target.value)
                    }
                  />
                  {errors[`${contactPrefix}_zip`] && (
                    <div className="text-red-500 text-xs pt-2">
                      {errors[`${contactPrefix}_zip`]}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <TextBox
                    placeholder={`Phone Number${required ? " *" : ""}`}
                    isEdittable={isEdittable}
                    type={'number'}
                    value={clientData[`${contactPrefix}_phone`]}
                    handleChange={(e) =>
                      handleFieldChange(
                        `${contactPrefix}_phone`,
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyContact;
