import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormLabel from "../dynamicform/FormElements/FormLabel";

const TimeInput = ({
  name,
  id,
  placeholder,
  width = "340px",
  height = "7vh",
  label,
  isEdittable,
  value,
  className,
  handleChange,
  timeIntervals,
  selectedDate,
  required,
  register,
}) => {
  // const [selectedTime, setSelectedTime] = useState(value || null);
  const bgLabelDisabled = isEdittable ? "#F6F7F7" : "white";

  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const styles = {
    "react-datepicker__month-container": {
      backgroundColor: "#ffffff",
    },
  };
  const [selectedTime, setSelectedTime] = useState(null);

  if (!register) {
    register = () => {};
  }

  const [minTime, setMinTime] = useState(new Date());
  const [maxTime, setMaxTime] = useState(new Date());

  useEffect(() => {
    const currentDate = new Date();
    const selectedDateTime = new Date(selectedDate);
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentSecond = currentDate.getSeconds();

    if (
      selectedDateTime.getDate() === currentDate.getDate() &&
      selectedDateTime.getMonth() === currentDate.getMonth() &&
      selectedDateTime.getFullYear() === currentDate.getFullYear()
    ) {
      setMinTime(
        new Date(
          currentDate.setHours(currentHour, currentMinute, currentSecond)
        )
      );
      setMaxTime(new Date(currentDate.setHours(23, 59, 59))); // Max time for today is 23:59:59
    } else {
      setMinTime(new Date(selectedDateTime.setHours(0, 0, 0)));
      setMaxTime(new Date(selectedDateTime.setHours(23, 59, 59)));
    }
  }, [selectedDate]);

  useEffect(() => {
    const currentDate = new Date();
    const selectedDateTime = new Date(selectedDate);

    // Check if selected date is today's date
    if (
      selectedDateTime.getDate() === currentDate.getDate() &&
      selectedDateTime.getMonth() === currentDate.getMonth() &&
      selectedDateTime.getFullYear() === currentDate.getFullYear()
    ) {
      // If selected time is in the past, reset the time
      if (value && value < currentDate) {
        handleChange(null);
      }
    }
  }, [selectedDate, value]);

  return (
    <div className="relative flex-grow w-full">
      {label && <FormLabel required={required}>{label}</FormLabel>}
      <DatePicker
        name={name}
        id={id || name}
        // selected={selectedTime}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={isEdittable}
        value={value}
        onChange={handleChange}
        style={{ width: "100%", minWidth: "10rem" }}
        showTimeSelect
        showTimeSelectOnly
        dateFormat="h:mm aa"
        minDate={new Date()} // Disable past dates
        minTime={minTime} // Set minTime dynamically
        maxTime={maxTime} // Set maxTime dynamically
        timeIntervals={timeIntervals}
        className={`
                bg-${isEdittable ? "#F6F7F7" : "white"}
                px-2 border-1
                border-gray-300/50
                placeholder-gray-500 
                placeholder-opacity-50 
                rounded-md
                text-md
                z-50
                h-[${height}]
                w-[${width}]
                ${className}`}
        placeholderText=" "
        selected={value}
        // onChange={date => setSelectedTime(date)}
        // {...register(name)}
      />

      <label
        htmlFor={id}
        className={`absolute px-2 text-sm text-gray-500 duration-300 transform ${
          isFocused || value
            ? "-translate-y-6 scale-75 top-4"
            : "translate-y-1/2 scale-100 top-1.5"
        } z-0 origin-[0] start-2.5 peer-focus:text-gray-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto`}
        style={{ background: bgLabelDisabled }}
      >
        {placeholder}
      </label>
    </div>
  );
};

export default TimeInput;
