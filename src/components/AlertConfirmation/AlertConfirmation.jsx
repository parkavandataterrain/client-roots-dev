import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import CancelRoundedIcon from "../../image/Cancel.svg";

import "./AlertConfirmation.css";

const AlertConfirmation = ({
  open,
  handleClose,
  label = "Are you sure you sent this for approval?",
  onConfirm,
  onDiscard,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xs"
      fullWidth
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div className="w-full px-3 py-2.5 text-xl font-medium flex justify-end">
            <img
              src={CancelRoundedIcon}
              onClick={handleClose}
              className="cursor-pointer"
              alt="CloseIcon"
            />
          </div>
          <div className="flex items-center justify-center mt-4 gap-2 flex-col">
            <div className="label pb-4">{label}</div>
            <div className="flex">
              <button
                className="border border-[#5BC4BF] w-[150px] font-normal text-base rounded-sm p-2 mr-3"
                onClick={onDiscard}
              >
                No
              </button>
              <button
                onClick={onConfirm}
                className="bg-[#5BC4BF] text-white p-2 w-[150px] font-normal text-base rounded-sm "
              >
                Yes
              </button>
            </div>
          </div>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default AlertConfirmation;
