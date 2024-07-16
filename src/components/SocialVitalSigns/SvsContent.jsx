import React from "react";
import { useState } from "react";

import NextIcon from "../images/next.svg";

function SvsContent({ title, questions, data }) {
  const [open, setOpen] = useState();

  const svsType = {
    housing: "Housing",
    food_access: "Food Access",
    financial_security: "Financial Security",
    education_employment: "Education/Employment",
    communication_and_mobility: "Communication and Mobility",
    healthcare_preventiative: "Healthcare - Preventive",
    healthcare_general_health: "Healthcare - General Health",
    healthcare_cardiovascular_risk: "Healthcare - Cardiovascular risk",
  };

  /**
   * This function is used to get the key from the value passed to an object
   */
  function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }

  return (
    <div className="bg-white flex flex-col border-1 border-[#5BC4BF] rounded">
      <div className="bg-[#89D6DE] bg-opacity-50 px-4 py-2 border-b border-[#5BC4BF]">
        {title}
      </div>
      {questions
        .filter(
          (question) => question.svs_name === getKeyByValue(svsType, title)
        )
        .map((question, index) => (
          <div className="flex flex-col border-1 border-[#5BC4BF] m-4 rounded">
            <div
              key={index}
              className="flex flex-row justify-between items-center rounded"
            >
              <div className="p-3 text-xs text-wrap w-[80%]">
                {question.svs_questions}
              </div>
              <div>
                <img
                  src={NextIcon}
                  onClick={() => setOpen(open === index ? null : index)}
                  className={`mx-auto opacity-50 ${
                    open === index ? "-rotate-90" : "rotate-90"
                  } p-2 hover:cursor-pointer`}
                  alt="next"
                />
              </div>
            </div>

            {open === index && (
              <>
                <div className="w-[99.99%] mx-auto border-b border-[#5BC4BF] " />
                <div className="p-3 text-xs">
                  {data[question.svs_column_name]}
                </div>
              </>
            )}
          </div>
        ))}
    </div>
  );
}

export default SvsContent;
