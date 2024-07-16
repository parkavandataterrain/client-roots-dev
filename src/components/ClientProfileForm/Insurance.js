import { useState } from 'react';
import TextBox from '../common/TextBox';
import DropDown from '../common/Dropdown';
import DateInput from '../common/DateInput';

const Insurance = ({
  heading,
  isEdittable,
  clientData,
  handleFieldChange,
  insurancePrefix,
  errors_from,
  errors_to,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  // Drop down options
  const relationshipOptions = [
    { value: 'Parent', label: 'Parent' },
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Child', label: 'Child' },
    { value: 'Sibling', label: 'Sibling' },
    { value: 'Friend', label: 'Friend' },
    { value: 'Other', label: 'Other' },
  ];

  let requredIndicator = required ? ' *' : '';

  return (
    <div className="">
      <div className="border-1 border-gray-500/50 mx-4 mb-4">
        <div className="bg-gray-500/50 h-16 flex items-center p-2 text-lg font-medium">
          {heading}
        </div>
        <div className="p-4 border-t border-gray-300">
          <div className="flex flex-col justify-between space-y-6">
            <div className="flex space-x-6">
              <div className="flex-1">
                <TextBox
                  placeholder={'Carrier Name' + requredIndicator}
                  isEdittable={isEdittable}
                  value={clientData[`${insurancePrefix}_carrier_name`]}
                  handleChange={(e) =>
                    handleFieldChange(
                      `${insurancePrefix}_carrier_name`,
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            <div className="flex space-x-6">
              <div className="flex-1">
                <TextBox
                  placeholder={'Subscriber ID' + requredIndicator}
                  isEdittable={isEdittable}
                  value={clientData[`${insurancePrefix}_subscriber_id`]}
                  handleChange={(e) =>
                    handleFieldChange(
                      `${insurancePrefix}_subscriber_id`,
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex-1">
                <TextBox
                  placeholder={'Subscriber Name' + requredIndicator}
                  isEdittable={isEdittable}
                  value={clientData[`${insurancePrefix}_subscriber_name`]}
                  handleChange={(e) =>
                    handleFieldChange(
                      `${insurancePrefix}_subscriber_name`,
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="flex-1">
                <TextBox
                  placeholder={'Group Name'}
                  isEdittable={isEdittable}
                  value={clientData[`${insurancePrefix}_group_name`]}
                  handleChange={(e) =>
                    handleFieldChange(
                      `${insurancePrefix}_group_name`,
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex-1">
                <TextBox
                  placeholder={'Group Id'}
                  isEdittable={isEdittable}
                  value={clientData[`${insurancePrefix}_group_id`]}
                  handleChange={(e) =>
                    handleFieldChange(
                      `${insurancePrefix}_group_id`,
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            <div className="flex space-x-6">
              <div className="flex-1">
                <DropDown
                  placeholder={'Relation to Insured' + requredIndicator}
                  options={relationshipOptions}
                  isEdittable={isEdittable}
                  selectedOption={
                    clientData[`${insurancePrefix}_relation_to_insured`]
                  }
                  handleChange={(e) =>
                    handleFieldChange(
                      `${insurancePrefix}_relation_to_insured`,
                      e.value
                    )
                  }
                />
              </div>
              <div className="flex-1">
                <DateInput
                  placeholder={'Effective From Date' + requredIndicator}
                  width={260}
                  isEdittable={isEdittable}
                  value={clientData[`${insurancePrefix}_effective_from`]}
                  handleChange={(selectedDate) =>
                    handleFieldChange(
                      `${insurancePrefix}_effective_from`,
                      selectedDate
                    )
                  }
                />
                {errors_from && (
                  <p className="text-red-500 text-xs mt-1">{errors_from}</p>
                )}
              </div>
              <div className="flex-1">
                <DateInput
                  placeholder={'Effective To Date' + requredIndicator}
                  width={260}
                  isEdittable={isEdittable}
                  value={clientData[`${insurancePrefix}_effective_to`]}
                  handleChange={(selectedDate) =>
                    handleFieldChange(
                      `${insurancePrefix}_effective_to`,
                      selectedDate
                    )
                  }
                />
                {errors_to && (
                  <p className="text-red-500 text-xs mt-1">{errors_to}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insurance;
