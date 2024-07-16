import React from "react";
import GraphPNG from "../images/graph.png";

function Graph() {
  return (
    <div className="bg-white flex flex-col border-1 border-[#5BC4BF] rounded">
      <div className="bg-[#89D6DE] bg-opacity-50 px-4 py-2 border-b border-[#5BC4BF]">
        Housing Risk
      </div>
      <img src={GraphPNG} className="mx-auto p-4" alt="graph" />
    </div>
  );
}

export default Graph;
