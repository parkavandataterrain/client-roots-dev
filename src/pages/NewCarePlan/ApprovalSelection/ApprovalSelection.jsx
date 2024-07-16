import React, { useMemo, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import BasicTable from "../../../components/react-table/BasicTable";
import CancelRoundedIcon from "../../../image/Cancel.svg";
import AlertConfirmation from "../../../components/AlertConfirmation/AlertConfirmation";

const ApprovalSelection = ({
  open,
  handleClose,
  handleDiscard,
  userOptions,
  handleFormData,
}) => {
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});

  const onConfirmClick = () => {
    handleFormData("approver_name", selectedRecord);
    setOpenAlert(false)
    handleClose();
  };

  const columns = useMemo(
    () => [
      {
        Header: "s.no",
        accessor: "srNo",
        align: "left",
      },
      {
        Header: "Name",
        accessor: "label",
        align: "left",
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div
            className="mx-auto flex justify-around space-x-2 items-center"
            onClick={() => {
                setSelectedRecord({ name: row.original.label, id: row.original.value })
                setOpenAlert(true);
            }
            }
          >
            <button className="bg-[#5BC4BF] text-white p-2 w-[150px] font-normal text-base rounded-sm">
              Select
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const closeAlret = () => setOpenAlert(false);

  const onDiscardClick = () => {
    setOpenAlert(false);
    setSelectedRecord({});
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="w-full px-3 py-2.5 text-xl font-medium flex justify-between">
              Request Approval
              <img
                src={CancelRoundedIcon}
                onClick={handleDiscard}
                alt="CloseIcon"
                className="cursor-pointer"
              />
            </div>
            <div className="mt-4 gap-2 flex-col">
              <BasicTable
                type={"referralPrograms"}
                columns={columns}
                data={userOptions.map((record, index) => ({
                  ...record,
                  srNo: `${index}`,
                }))}

              />
              <div className="flex item-center justify-center">
              <button
                onClick={handleDiscard}
                className="border border-[#5BC4BF] w-[150px] font-normal text-base text-black rounded-[3px] p-2 mr-3"
              >
                Close
              </button>
              </div>
            </div>
            {openAlert && (
              <AlertConfirmation
                open={openAlert}
                handleClose={closeAlret}
                onConfirm={onConfirmClick}
                onDiscard={onDiscardClick}
              />
            )}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApprovalSelection;
