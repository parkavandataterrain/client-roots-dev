import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import FormLabel from "./FormLabel";
import "react-datepicker/dist/react-datepicker.css";

function DateInput({
  type,
  label,
  value = null,
  onChange = () => {},
  className,
  required,
  disabled,
  stateless,
  width,
}) {
  const [date, setDate] = useState(null);
  const handleChange = (selectedDate) => {
    let event = {
      target: {
        value: null,
      },
    };
    event.target.value = selectedDate;
    onChange(event);
  };

  const dateValue = value ? new Date(value) : value;

  useEffect(() => {
    try {
      let dtEle = document.getElementById("dateInput");
      if (dtEle) {
        dtEle.style.width = "100%";
      }
    } catch (err) {
      console.log({ err });
    }
  }, []);

  if (stateless) {
    return (
      <div className={`m-1 ${width}`}>
        <FormLabel required={required}>{label}</FormLabel>
        <DatePicker
          wrapperClassName={width}
          showIcon
          selected={date}
          onChange={(newDate) => {
            console.log(newDate);
            setDate(newDate);
          }}
          dateFormat="MM/dd/yyyy" // Set the desired date format here
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          disabled={disabled}
          placeholderText="  MM/DD/YYYY"
        />
      </div>
    );
  }

  return (
    <div className={`m-1 ${width}`}>
      <FormLabel required={required}>{label}</FormLabel>
      <DatePicker
        wrapperClassName="border w-full"
        style={{
          width: "100%",
        }}
        showIcon
        id="dateInput"
        selected={dateValue}
        onChange={handleChange}
        dateFormat="MM/dd/yyyy" // Set the desired date format here
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        disabled={disabled}
        placeholderText="  MM/DD/YYYY"
      />
    </div>
  );
}

export default DateInput;
