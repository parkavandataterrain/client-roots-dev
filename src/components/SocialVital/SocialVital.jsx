"use client";

import React, { useMemo } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import CautionIcon from "../images/cautionIcon.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LineUpTeal from "../images/lineUpTeal.svg";
import { useWindowSize } from "../Utils/windowResize";
import "./SocialVitalStyles.css";

const data = [
  { value: 10, label: "High", color: "#1F4B51" },
  { value: 10, label: "Low", color: "#89D6DE" },
  { value: 15, label: "Medium", color: "#2F9384" },
];

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 15,
  color: "#1F4B51",
  fontWeight: "500",
}));

const PieCenterLabel = React.memo(({ children }) => {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
});

const SocialVital = () => {
  const { width } = useWindowSize();

  const size = useMemo(() => ({
    width: 360,
    height: width < 600 ? 150 : 100,
  }), [width]);

  return (
    <div id="social-vital-1" className="bg-white rounded-md shadow-md min-[320px]:h-full col-span-3 flex-1">
      <div className="flex justify-between items-center px-4 mt-6 mb-2">
        <div id="social-vital-2" className="text-lg font-medium">
          Social Vital Signs
        </div>
        <button id="social-vital-3" className="flex justify-center items-center space-x-2 border border-[#2F9384] px-2 py-0.5 rounded-sm">
          <span className="text-[#2F9384] text-sm ">Year</span>
          <ExpandMoreIcon id="social-vital-4" className="text-[#2F9384]" />
        </button>
      </div>
      <hr id="social-vital-5" className="w-11/12 mx-auto my-2" />
      <div className="mt-4 flex justify-around">
        <PieChart
          series={[{ data, innerRadius: 30, startAngle: 0 }]}
          {...size}
          margin={{ top: 0, right: 180, bottom: 0, left: 0 }}
          sx={{
            width: "100% !important",
            height: "auto",
          }}
        >
          <PieCenterLabel>100%</PieCenterLabel>
        </PieChart>
      </div>
      <div id="social-vital-6" className="flex justify-around items-center my-3 mx-0">
        {/* <div className="flex items-center">
          <img id="social-vital-7" src={LineUpTeal} className="size-4 mx-1" alt="lineup" />
          <div id="social-vital-8" className="text-xs">
            <span className="text-[#43B09C]">28% </span>vs Last Year
          </div>
          <img id="social-vital-9" src={CautionIcon} className="size-5 mx-2" alt="client" />
        </div> */}
        <button id="social-vital-10" className="px-2.5 text-white py-1.5 font-medium text-xs bg-[#7397B5] rounded-sm">
          View Details
        </button>
      </div>
    </div>
  );
};

export default React.memo(SocialVital);
