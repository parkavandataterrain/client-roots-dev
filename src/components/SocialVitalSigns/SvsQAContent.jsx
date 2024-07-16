import React from "react";
import { useState } from "react";

import NextIcon from "../images/next.svg";

function SvsQAContent({
  title,
  questions,
  goToPreviousStage,
  goToNextStage,
  isStart,
  isEnd,
  sectionID,
  data: answers,
  handleAnswers,
  handleSubmit,
}) {
  const [open, setOpen] = useState({});

  const handleInputChange = (questionId, value) => {
    handleAnswers(sectionID, questionId, value);
    console.log({ sectionID, questionId, value });
  };

  // const handleGroupSelectChange = (parentQID, questionId, value) => {
  //   if (answers[parentQID]) {
  //     setAnswers((prev) => {
  //       return {
  //         ...prev,
  //         [parentQID]: { ...prev[parentQID], [questionId]: value },
  //       };
  //     });
  //   } else {
  //     let newValue = {};
  //     newValue[questionId] = value;

  //     setAnswers((prev) => {
  //       return {
  //         ...prev,
  //         [parentQID]: newValue,
  //       };
  //     });
  //   }
  // };

  const toggleOpen = (index) => {
    setOpen((prev) => {
      return { ...prev, [index]: !prev[index] };
    });
  };

  return (
    <div className="bg-white flex flex-col border-1 border-[#5BC4BF] rounded">
      <div className="bg-[#89D6DE] bg-opacity-50 px-4 py-2 mb-3 border-b border-[#5BC4BF]">
        {title}
      </div>
      {questions.map((question, index) => (
        <div
          className="flex flex-col border-1 border-[#5BC4BF] m-4 my-2 mt-3 rounded"
          key={index}
        >
          <div
            onClick={() => toggleOpen(index)}
            className={`flex flex-row justify-between items-center rounded-t ${
              open[index] ? "bg-[#89D6DE]" : ""
            } bg-opacity-50 cursor-pointer`}
          >
            <div className="p-3 text-xs text-wrap w-[80%]">
              {question.question}
            </div>
            <div className="mx-2">
              <img
                src={NextIcon}
                className={`opacity-50 ${
                  open[index] ? "-rotate-90" : "rotate-90"
                } p-2 hover:cursor-pointer`}
                alt="next"
              />
            </div>
          </div>

          {open[index] && (
            <>
              <div className="w-[99.99%] mx-auto border-b border-[#5BC4BF] " />
              <div className="p-3 text-xs">
                <form>
                  <div className="flex flex-column gap-3">
                    {question.inputType === "Radio" &&
                      question.options.map((option) => (
                        <RadioInput
                          key={option}
                          id={`${question.id}-${option}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={() =>
                            handleInputChange(question.id, option)
                          }
                          label={option}
                        />
                      ))}
                    {question.inputType === "Text" && (
                      <TextInput
                        id={question.id}
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          handleInputChange(question.id, e.target.value)
                        }
                        placeholder={question.question}
                      />
                    )}
                    {question.inputType === "Select" && (
                      <SelectInput
                        id={question.id}
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          handleInputChange(question.id, e.target.value)
                        }
                        options={question.options}
                        // label="Sample 01"
                      />
                    )}

                    {question.inputType === "GroupSelect" && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          {question.group.map((eachSelect) => {
                            return (
                              <div>
                                <SelectInput
                                  id={eachSelect.id}
                                  value={
                                    answers[eachSelect.id]
                                      ? answers[eachSelect.id]
                                      : ""
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      eachSelect.id,
                                      e.target.value
                                    )
                                  }
                                  options={eachSelect.options}
                                  label={eachSelect.question}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      ))}

      <div className="flex items-center justify-center gap-3 my-8 mt-4">
        <button
          disabled={isStart}
          onClick={goToPreviousStage}
          className={`${
            isStart
              ? "bg-opacity-75 border-slate-300 text-slate-300"
              : "border-[#2F9384] text-[#2F9384]"
          } w-[152px] h-[35px] px-3 py-1 border-1 sm:border-2 rounded-sm text-[13px] font-medium leading-5`}
        >
          Previous
        </button>
        {isEnd ? (
          <button
            onClick={handleSubmit}
            className=" w-[152px] h-[35px] px-3 py-1 text-[13px] font-medium leading-5 bg-[#5BC4BF] text-white rounded-sm font-medium"
          >
            Submit
          </button>
        ) : (
          <button
            disabled={isEnd}
            onClick={goToNextStage}
            className=" w-[152px] h-[35px] px-3 py-1 text-[13px] font-medium leading-5 bg-[#5BC4BF] text-white rounded-sm font-medium"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default SvsQAContent;

const RadioInput = ({ id, value, checked, onChange, label }) => {
  return (
    <div className="flex gap-2 items-center accent-teal-500">
      <input
        type="checkbox"
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label className="text-xs" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

const TextInput = ({ id, value, onChange, placeholder = "" }) => {
  return (
    <div>
      <input
        className="form-control px-3 py-2 text-xs placeholder-gray-400 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-teal-400 focus:border-teal-400"
        type="text"
        placeholder={placeholder}
        id={id}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

const SelectInput = ({ id, value, onChange, options, label }) => {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <div className="relative flex flex-column gap-2">
      <label htmlFor={id} className="text-xs ms-1">
        {label}
      </label>
      <div className="relative">
        <select
          className="form-control px-3 py-[0.8rem] text-xs placeholder-gray-400 border-1 border-teal-500 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-teal-400 focus:border-teal-400"
          id={id}
          value={value}
          onChange={onChange}
          onClick={toggleDropdown}
        >
          <option disabled value={""}>
            Select
          </option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <img
          src={NextIcon}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
            open ? "-rotate-90" : "rotate-90"
          } w-4 h-4 pointer-events-none`}
          alt="dropdown"
        />
      </div>
    </div>
  );
};
