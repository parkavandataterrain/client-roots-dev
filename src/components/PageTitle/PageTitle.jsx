import React from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import { Link, useNavigate } from "react-router-dom";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import EditGreenPNG from "../images/edit-green.png";

const EditButton = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      <div className="flex space-x-2 items-center">
        <img src={EditGreenPNG} class={`w-6 h-6`} />
        <div className={"text-green-800 text-base font-medium"}>Edit</div>
      </div>
    </button>
  );
};

function PageTitle({ clientId, title, onClick, editUrl }) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-x-3">
        <div className="text-2xl font-medium">{title}</div>
        {editUrl && <EditButton onClick={() => navigate(editUrl)} />}
      </div>
      <button onClick={onClick} className="p-1 bg-[#EAECEB]">
        <Link to="/">
          <ReplyIcon className="px-auto py-auto" />
        </Link>
      </button>
    </div>
  );
}

export default PageTitle;
