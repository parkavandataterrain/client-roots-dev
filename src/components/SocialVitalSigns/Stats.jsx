import React from "react";

function Stats() {
  return (
    <div className="bg-white border-1 border-[#5BC4BF] py-6 px-0 rounded space-y-4 text-xs">
      <div className="flex flex-col">
        <div className="flex flex-row items-center px-10 space-x-20">
          <div className="">0 - 25</div>
          <div className="size-3 bg-[#FFEE99]" />
          <div>Low</div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row items-center px-8 space-x-20">
          <div className="">25 - 75</div>
          <div className="size-3 bg-[#F19F35]" />
          <div className="text-end">Medium</div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row items-center px-7 space-x-20">
          <div>75 - 100</div>
          <div className="size-3 bg-[#EC211F]" />
          <div>High</div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
