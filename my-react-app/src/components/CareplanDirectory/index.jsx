import React from "react";
import CareplanDirectoryTable from "./CareplanDirectoryTable";

function CareplanDirectory() {
  return (
    <div className="flex flex-column gap-2 items-center">
      <PageHeader title="Care Plan Directory" />

      <div className="flex flex-column gap-2 w-100 shadow-md rounded-md">
        <CareplanDirectoryTable />
      </div>
    </div>
  );
}

function PageHeader({ title }) {
  return (
    <div className="flex justify-start items-center w-100 mb-4">
      <p className="m-0 p-0 text-[20px] font-medium">{title}</p>
      {/* <Link className="p-2 bg-[#EAECEB]" to="/">
        <img
          src={BackArrowIcon}
          alt="back arrow"
          className="h-[15px] w-[100%]"
        />
      </Link> */}
    </div>
  );
}

export default CareplanDirectory;
