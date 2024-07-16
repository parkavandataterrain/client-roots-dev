import React from "react";

import NextIcon from "../images/next.svg";

function SideBarForQA({
  contentToShow,
  setContentToShow,
  currentStage,
  stages,
  handleStage,
}) {
  return (
    <div className="bg-white flex flex-col border-1 border-[#5BC4BF] py-2 rounded">
      {stages.map((stage, idx) => {
        return (
          <div
            key={idx}
            id={stage.stageIndex}
            className={`flex flex-row justify-between items-center p-3 hover:cursor-pointer ${
              stages.length === idx + 1 ? "border-b-[0px]" : "border-b-[1px]"
            } border-[#5BC4BF] ${
              currentStage.title === stage.title ? "text-[#5BC4BF]" : ""
            }`}
            onClick={() => handleStage(stage.stageIndex)}
          >
            <div className="text-xs font-normal">{stage.title}</div>
            <div>
              <img
                src={NextIcon}
                className={`opacity-50 ${
                  currentStage.title === stage.title ? "rotate-90" : ""
                } hover:cursor-pointer mx-2`}
                alt="next"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SideBarForView({ contentToShow, setContentToShow }) {
  return (
    <div className="bg-white flex flex-col border-1 border-[#5BC4BF] py-2 rounded">
      <div
        id={1}
        className={`flex flex-row justify-between items-center p-3 hover:cursor-pointer ${
          contentToShow === "Housing" ? "text-[#5BC4BF]" : ""
        }`}
        onClick={() => setContentToShow("Housing")}
      >
        <div className="text-xs font-normal">Housing</div>
        <div>
          <img src={NextIcon} className="mx-auto opacity-50" alt="next" />
        </div>
      </div>
      <div className="w-[99.99%] mx-auto border-b border-[#5BC4BF] " />
      <div
        id={2}
        className={`flex flex-row justify-between items-center p-3 hover:cursor-pointer ${
          contentToShow === "Food Access" ? "text-[#43B09C]" : ""
        }`}
        onClick={() => setContentToShow("Food Access")}
      >
        <div className="text-xs font-normal">Food Access</div>
        <div>
          <img src={NextIcon} className="mx-auto opacity-50" alt="next" />
        </div>
      </div>
      <div className="w-[99.99%] mx-auto border-b border-[#5BC4BF] " />
      <div
        className={`flex flex-row justify-between items-center p-3 hover:cursor-pointer ${
          contentToShow === "Financial Security" ? "text-[#43B09C]" : ""
        }`}
        onClick={() => setContentToShow("Financial Security")}
      >
        <div className="text-xs font-normal">Financial Security</div>
        <div>
          <img src={NextIcon} className="mx-auto opacity-50" alt="next" />
        </div>
      </div>
      <div className="w-[99.99%] mx-auto border-b border-[#5BC4BF] " />
      <div
        className={`flex flex-row justify-between items-center p-3 hover:cursor-pointer ${
          contentToShow === "Education/Employment" ? "text-[#43B09C]" : ""
        }`}
        onClick={() => setContentToShow("Education/Employment")}
      >
        <div className="text-xs font-normal">Education/Employment</div>
        <div>
          <img src={NextIcon} className="mx-auto opacity-50" alt="next" />
        </div>
      </div>
      <div className="w-[99.99%] mx-auto border-b border-[#5BC4BF] " />
      <div
        className={`flex flex-row justify-between items-center p-3 hover:cursor-pointer ${
          contentToShow === "Communication and Mobility" ? "text-[#43B09C]" : ""
        }`}
        onClick={() => setContentToShow("Communication and Mobility")}
      >
        <div className="text-xs font-normal">Communication and Mobility</div>
        <div>
          <img src={NextIcon} className="mx-auto opacity-50" alt="next" />
        </div>
      </div>
      <div className="w-[99.99%] mx-auto border-b border-[#5BC4BF] " />
      <div
        className={`flex flex-row justify-between items-center p-3 hover:cursor-pointer ${
          contentToShow === "Healthcare - Preventive" ? "text-[#43B09C]" : ""
        }`}
        onClick={() => setContentToShow("Healthcare - Preventive")}
      >
        <div className="text-xs font-normal">Healthcare - Preventive</div>
        <div>
          <img src={NextIcon} className="mx-auto opacity-50" alt="next" />
        </div>
      </div>
      <div className="w-[99.99%] mx-auto border-b border-[#5BC4BF] " />
      <div
        className={`flex flex-row justify-between items-center p-3 hover:cursor-pointer ${
          contentToShow === "Healthcare - General Health"
            ? "text-[#43B09C]"
            : ""
        }`}
        onClick={() => setContentToShow("Healthcare - General Health")}
      >
        <div className="text-xs font-normal">Healthcare - General Health</div>
        <div>
          <img src={NextIcon} className="mx-auto opacity-50" alt="next" />
        </div>
      </div>
      <div className="w-[99.99%] mx-auto border-b border-[#5BC4BF] " />
      <div
        className={`flex flex-row justify-between items-center p-3 hover:cursor-pointer ${
          contentToShow === "Healthcare - Cardiovascular  risk"
            ? "text-[#43B09C]"
            : ""
        }`}
        onClick={() => setContentToShow("Healthcare - Cardiovascular risk")}
      >
        <div className="text-xs font-normal">
          Healthcare - Cardiovascular risk
        </div>
        <div>
          <img src={NextIcon} className="mx-auto opacity-50" alt="next" />
        </div>
      </div>
    </div>
  );
}

function SideBar({ isQA, ...props }) {
  if (isQA) {
    return <SideBarForQA {...props} />;
  }

  return <SideBarForView {...props} />;
}

export default SideBar;
