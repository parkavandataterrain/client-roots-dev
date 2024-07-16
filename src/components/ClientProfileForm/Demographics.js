import { useState } from "react";

import TextBox from "../common/TextBox";
import DropDown from "../common/Dropdown";
import DateInput from "../common/DateInput";
import OpenAccordianPNG from "../images/open-accordion.png";
import ClosedAccordianPNG from "../images/closed-accordion.png";

const Demographics = ({
  id,
  isEdittable,
  clientData,
  handleFieldChange,
  errors,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  //Drop down options
  const sexOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const usArmedForcesOptions = [
    {
      label: "U.S. Veteran",
      value: "U.S. Veteran",
    },
    { label: "U.S. Active Military", value: "U.S. Active Military" },
    { label: "None of the Above", value: "None of the Above" },
    { label: "Decline to Specify", value: "Decline to Specify" },
  ];

  const ethinicityOptions = [
    { value: "Asian", label: "Asian" },
    { value: "Black", label: "Black" },
    { value: "Hispanic", label: "Hispanic" },
    { value: "White", label: "White" },
    { value: "Other", label: "Other" },
  ];

  // OLD
  // const currentPlaceOptions = [
  //   { value: "Home or Apartment", label: "Home or Apartment" },
  //   { value: "Group Home", label: "Group Home" },
  //   { value: "Car", label: "Car" },
  // ];

  const currentPlaceOptions = [
    {
      label: "I own a house or apartment",
      value: "I own a house or apartment",
    },
    {
      label: "I rent a house or apartment",
      value: "I rent a house or apartment",
    },
    {
      label: "I live with family or friends (don't pay rent or own property)",
      value: "I live with family or friends (don't pay rent or own property)",
    },
    { label: "Couch surfing", value: "Couch surfing" },
    { label: "Transitional housing", value: "Transitional housing" },
    { label: "Hotel", value: "Hotel" },
    { label: "An Emergency Shelter", value: "An Emergency Shelter" },
    {
      label: "A Treatment Facility or Group Home",
      value: "A Treatment Facility or Group Home",
    },
    {
      label:
        "I have no housing (I’m sleeping on the street, in a park, a vehicle, or a bus or train station)",
      value:
        "I have no housing (I’m sleeping on the street, in a park, a vehicle, or a bus or train station)",
    },
  ];

  const raceOptions = [
    { label: "Black or African Descent", value: "Black or African Descent" },
    { label: "White or Caucasian", value: "White or Caucasian" },
    { label: "Asian", value: "Asian" },
    {
      label: "Pacific Islander or Native Hawaiian",
      value: "Pacific Islander or Native Hawaiian",
    },
    { label: "Filipino", value: "Filipino" },
    {
      label: "Native American/Alaskan/American Indian",
      value: "Native American/Alaskan/American Indian",
    },
    { label: "Middle Eastern/Arab", value: "Middle Eastern/Arab" },
    { label: "Other", value: "Other" },
  ];

  const genderOptions = [
    { value: "Cisgender", label: "Cisgender" },
    { value: "Transgender", label: "Transgender" },
    { value: "Non-binary", label: "Non-binary" },
    { value: "Other", label: "Other" },
  ];

  // OLD
  // const sexualOrientationOptions = [
  //   { value: "Heterosexual", label: "Heterosexual" },
  //   { value: "Homosexual", label: "Homosexual" },
  //   { value: "Bisexual", label: "Bisexual" },
  //   { value: "Other", label: "Other" },
  // ];

  const sexualOrientationOptions = [
    { label: "Heterosexual/Straight", value: "Heterosexual/Straight" },
    { label: "Homosexual/Gay/Lesbian", value: "Homosexual/Gay/Lesbian" },
    { label: "Bisexual", value: "Bisexual" },
    { label: "Pansexual", value: "Pansexual" },
    { label: "Asexual", value: "Asexual" },
    { label: "Decline to Specify", value: "Decline to Specify" },
    { label: "Other", value: "Other" },
  ];

  return (
    <div
      className="border border-gray-300  bg-gray-50 rounded-md"
      id={`accordian-${id}`}
    >
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={toggleAccordion}
      >
        <div>
          <h2 className="text-lg font-medium">Demographics</h2>

          <p>
            Kindly provide complete and valid information for the Demographics
            section.
          </p>
        </div>
        <img
          src={isOpen ? OpenAccordianPNG : ClosedAccordianPNG}
          alt={isOpen ? "Open accordian" : "Close accordion"}
          className="ml-2 w-6 h-6"
        />
      </div>
      {isOpen && (
        <>
          <div className="p-4 border-t border-gray-300">
            <div className="flex flex-col justify-between space-y-6">
              <div className="flex space-x-6">
                <div className="flex-1">
                  <DateInput
                    placeholder="Date of Birth *"
                    width={290}
                    isEdittable={isEdittable}
                    value={clientData.date_of_birth}
                    handleChange={(selectedDate) =>
                      handleFieldChange("date_of_birth", selectedDate)
                    }
                  />
                </div>
                <div className="flex-1">
                  <TextBox
                    placeholder="Age"
                    isEdittable={true}
                    value={clientData.age}
                    handleChange={(e) =>
                      handleFieldChange("age", e.target.value)
                    }
                  />
                  {errors.age && (
                    <div className="text-red-500 text-xs pt-2">
                      {errors.age}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <DropDown
                    placeholder="Sex *"
                    options={sexOptions}
                    isEdittable={isEdittable}
                    selectedOption={clientData.sex}
                    handleChange={(e) => handleFieldChange("sex", e.value)}
                  />
                </div>
              </div>
              <div className="flex space-x-6">
                <div className="flex-1">
                  <TextBox
                    placeholder="Social Security Number"
                    isEdittable={isEdittable}
                    value={clientData.social_security_number}
                    handleChange={(e) =>
                      handleFieldChange(
                        "social_security_number",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="flex-1">
                  {/* <TextBox
                    placeholder="US Armed Forces"
                    isEdittable={isEdittable}
                    value={clientData.us_armed_forces}
                    handleChange={(e) =>
                      handleFieldChange("us_armed_forces", e.target.value)
                    }
                  /> */}
                  <DropDown
                    placeholder="US Armed Forces *"
                    options={usArmedForcesOptions}
                    isEdittable={isEdittable}
                    selectedOption={clientData.us_armed_forces}
                    handleChange={(e) =>
                      handleFieldChange("us_armed_forces", e.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <DropDown
                    placeholder="Ethinicity *"
                    options={ethinicityOptions}
                    isEdittable={isEdittable}
                    selectedOption={clientData.ethnicity}
                    handleChange={(e) =>
                      handleFieldChange("ethnicity", e.value)
                    }
                  />
                </div>
              </div>
              <div className="flex space-x-6">
                <div className="flex-1">
                  <DropDown
                    placeholder="Which Best describes the place you live now? *"
                    options={currentPlaceOptions}
                    isEdittable={isEdittable}
                    selectedOption={clientData.describe_the_place_you_live}
                    handleChange={(e) =>
                      handleFieldChange("describe_the_place_you_live", e.value)
                    }
                  />
                </div>
              </div>
              <div className="flex space-x-6">
                <div className="flex-1">
                  <DropDown
                    placeholder="Race *"
                    options={raceOptions}
                    isEdittable={isEdittable}
                    selectedOption={clientData.race}
                    handleChange={(e) => handleFieldChange("race", e.value)}
                  />
                </div>
                <div className="flex-1">
                  <TextBox
                    placeholder="Other Race"
                    isEdittable={isEdittable}
                    value={clientData.other_race}
                    handleChange={(e) =>
                      handleFieldChange("other_race", e.target.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <DropDown
                    placeholder="Gender Identity *"
                    options={genderOptions}
                    isEdittable={isEdittable}
                    selectedOption={clientData.gender_identity}
                    handleChange={(e) =>
                      handleFieldChange("gender_identity", e.value)
                    }
                  />
                </div>
              </div>
              <div className="flex space-x-6">
                <div className="flex-1">
                  <TextBox
                    placeholder="Other Gender Identity"
                    isEdittable={isEdittable}
                    value={clientData.other_gender_identity}
                    handleChange={(e) =>
                      handleFieldChange("other_gender_identity", e.target.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <DropDown
                    placeholder="Sexual Orientation *"
                    options={sexualOrientationOptions}
                    isEdittable={isEdittable}
                    selectedOption={clientData.sexual_orientation}
                    handleChange={(e) =>
                      handleFieldChange("sexual_orientation", e.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <TextBox
                    placeholder="Other Sexual Orientation"
                    isEdittable={isEdittable}
                    value={clientData.other_sexual_orientation}
                    handleChange={(e) =>
                      handleFieldChange(
                        "other_sexual_orientation",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Demographics;
