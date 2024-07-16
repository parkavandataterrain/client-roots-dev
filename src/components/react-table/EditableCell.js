import React, { useState } from "react";

const EditableCell = ({
  data, // Pass the entire data object
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is the function to update the data
}) => {
  console.log(data);
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    setIsEditing(false);
    // Send the necessary information to updateMyData
    console.log(data, "data")
    updateMyData(data, value, initialValue, id);
  };

  return (
    <div
      onClick={toggleEditing}
      onBlur={onBlur}
      style={{ padding: "4px", width: "120px" }}
    >
      {isEditing ? (
        <input
          value={value}
          onChange={onChange}
          autoFocus
          style={{ outline: "none", border: "1px solid gray", width:"130px", padding:"2px" }}
        />
      ) : (
        value
      )}
    </div>
  );
};

export default EditableCell;