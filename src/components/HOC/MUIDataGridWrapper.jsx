import React from "react";
import { LinearProgress } from "@mui/material";

const CustomNoRowsOverlay = ({ noDataLabel }) => {
  return (
    <div
      className="flex items-center justify-center h-[100%]"
      style={{ textAlign: "center" }}
    >
      <h3
        className="text-muted"
        style={{
          fontFamily: "Roboto Mono",
        }}
      >
        {noDataLabel}
      </h3>
    </div>
  );
};

const MUIDataGridWrapper = ({
  children,
  noDataLabel = "No data available",
}) => {
  const { loading = false, rows = [] } = children.props;
  return (
    <div
      style={{
        height: loading || rows.length === 0 ? 250 : "auto",
        width: "100%",
      }}
    >
      {React.cloneElement(children, {
        slots: {
          loadingOverlay: () => (
            <LinearProgress
              sx={{
                height: "5px",
              }}
            />
          ),
          noRowsOverlay: () => (
            <CustomNoRowsOverlay noDataLabel={noDataLabel} />
          ),
          ...children?.props?.slots,
        },
      })}
    </div>
  );
};

export default MUIDataGridWrapper;
