import React, { useState, useEffect } from "react";
import TrashIcon from "../../../images/form_builder/trash.svg";

export default function EnumOptionsComponent({ label = "", value, setValue }) {
  const [enumOptions, setEnumOptions] = useState([]);

  console.log({ enumOptions });

  const isEnumOptionsHasValue =
    enumOptions.length > 0
      ? enumOptions[enumOptions.length - 1].length > 0
        ? true
        : false
      : false;

  const onChangeVal = (e) => {
    if (e.target.value[e.target.value.length - 1] !== ",") {
      setEnumOptions((prev) => {
        const updatedItems = [...prev];
        updatedItems[e.target.name] = e.target.value;
        return [...updatedItems];
      });
    }
  };

  const onAddNewOption = () => {
    // console.log("..");
    // console.log({ enumOptions, isEnumOptionsHasValue });

    if (isEnumOptionsHasValue) {
      setEnumOptions((prev) => {
        let updatedEle = [...prev];
        updatedEle.push("");

        return updatedEle;
      });
    }
  };

  const onRemoveOption = (idx) => {
    if (enumOptions.length > 1) {
      if (enumOptions.length === 2 && idx === 0 && !enumOptions[1]) {
        alert("Unable to Delete, min 1 option required");
      } else {
        setEnumOptions((prev) => {
          let updatedEle = [...prev];
          updatedEle = updatedEle.filter((_, index) => {
            return idx !== index;
          });

          return updatedEle;
        });
      }
    } else {
      alert("Unable to Delete, min 1 option required");
    }
  };

  useEffect(() => {
    try {
      let arrayOfValues = [];
      if (value && value !== "") {
        arrayOfValues = value;
      }
      setEnumOptions(arrayOfValues);
    } catch (e) {
      console.log({ e });
    }
    return () => {};
  }, []);

  useEffect(() => {
    let hasValue = enumOptions.filter(Boolean);
    let uniqueValues = [...new Set(hasValue)];
    // setEnumOptions(uniqueValues);
    // console.log({ hasValue, uniqueValues });
    let arrayOfValues = uniqueValues.join(",");
    setValue(arrayOfValues);
  }, [enumOptions]);

  useEffect(() => {
    let uniqueValues = [...new Set(enumOptions)];
    if (uniqueValues.length !== enumOptions.length) {
      setEnumOptions(uniqueValues);
    }
  }, [enumOptions]);

  return (
    <div className="flex flex-column gap-2">
      {label && <label className="inline-flex items-center">{label}</label>}
      {enumOptions.length > 0
        ? enumOptions.map((item, idx) => (
            <div className="flex items-center gap-1">
              <input
                type="text"
                onChange={onChangeVal}
                value={enumOptions[idx]}
                name={idx}
                placeholder={`Enter Option ${idx + 1}`}
                className="border border-gray-300 rounded px-4 py-2 mr-4 w-100 placeholder:text-sm"
              />

              <button
                onClick={() => {
                  onRemoveOption(idx);
                }}
                className="flex items-center justify-center p-2 text-white rounded-full focus:outline-none hover:bg-red-100"
              >
                <img src={TrashIcon} alt="trash" className="w-4 h-4" />
              </button>
            </div>
          ))
        : ["newItem"].map((item, idx) => (
            <div className="flex items-center gap-1">
              <input
                type="text"
                onChange={onChangeVal}
                value={enumOptions[idx]}
                name={idx}
                placeholder={`Enter Option ${idx + 1}`}
                className="border border-gray-300 rounded px-4 py-2 mr-4 w-100 placeholder:text-sm"
              />

              <button
                onClick={() => {
                  onRemoveOption(idx);
                }}
                className="hidden flex items-center justify-center p-2 text-white rounded-full focus:outline-none hover:bg-red-100"
              >
                <img src={TrashIcon} alt="trash" className="w-4 h-4" />
              </button>
            </div>
          ))}
      <button
        className="mx-auto bg-[#5BC4BF] text-white hover:bg-teal-700 font-bold mt-2.5 p-2 px-4 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500  text-xs"
        onClick={onAddNewOption}
        disabled={!isEnumOptionsHasValue}
      >
        Add Option
      </button>
    </div>
  );
}
