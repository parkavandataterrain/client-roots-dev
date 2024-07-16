import React, { useState } from "react";
import DataViewTransferList from "./DataViewTransferList";
import DataViewTable from "./DataViewTable";
import DataView from "./DataView";

function TableListView() {
  const [saveSuccess, setSaveSuccess] = useState(false);

  return (
    <div className="flex flex-column gap-10">
      <DataViewTransferList setSaveSuccess={setSaveSuccess} saveSuccess={saveSuccess} />
      <DataViewTable  saveSuccess={saveSuccess} setSaveSuccess={setSaveSuccess} />
    </div>
  );
}

export default TableListView;
