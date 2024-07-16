import React, { useCallback, useEffect, useState } from "react";
import DropDown from "../../components/common/Dropdown";
import DateInput from "../../components/common/DateInput";
import TextAreaElement from "../../components/dynamicform/FormElements/TextAreaElement";
import InputElement from "../../components/dynamicform/FormElements/InputElement";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Link, useNavigate, useParams } from "react-router-dom";
import { protectedApi } from "../../services/api";
import { notifyError, notifySuccess, notifyWarn } from "../../helper/toastNotication";
import { useLocation } from "react-router-dom";

function ReferralEdit() {
  const { clientId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const referralId = queryParams.get("referralId");

  const [mode, setMode] = useState(queryParams.get("mode") || "view");

  const [formData, setFormData] = React.useState({});

  const enableEditMode = useCallback(() => {
    navigate(`/referral/edit/${clientId}?referralId=${referralId}&mode=edit`);
    setMode("edit");
  }, []);

  const fetchReferral = useCallback(async () => {
    try {
      const referralId = queryParams.get("referralId");
      if (!referralId) {
        notifyWarn("Referral ID not found");
        return;
      }

      const response = await protectedApi.get(
        `/referral-screen/${referralId}/`
      );
      setFormData(response.data);
    } catch (error) {
      console.error(error);
      notifyError("Failed to fetch referral");
    }
  }, []);

  const handleUpdate = useCallback(async () => {
    try {
      const referralId = queryParams.get("referralId");

      const payload = {
        referred_to: formData.referral_to,
        referral_comments: formData.referral_comments,
        progress_comments: formData.progress_comments,
        status: 'Services provided (Closed)', // currently hard coded since we don't have the status dropdown
      }

      const response = await protectedApi.put(
        `/referrals-update/${referralId}/`,
        payload
      );
      if (response.status === 200) {
        notifySuccess("Referral updated successfully");
        navigate(`/clientchart/${clientId}`);
      }
    } catch (e) {
      console.error(e);
      notifyError("Failed to update referral");
    }
  }, [formData]);

  const handleChange = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    fetchReferral();
  }, []);

  return (
    <>
      <div className="grid gap-y-6 mx-4">
        <div className="bg-white rounded-[6px] border border-[#DBE0E5]">
          <div className="bg-[#5BC4BF] text-white px-3 py-2 flex gap-2 items-center">
            Referral
            {/* <button onClick={enableEditMode}>
              <EditOutlinedIcon className="!h-5 cursor-pointer" />
            </button> */}
          </div>
          <div className="grid grid-cols-3 m-10 gap-x-4 gap-y-6">
            <div className="col-span-1">
              <DropDown
                label={"Enter Referral to"}
                selectedOption={formData?.referral_to || ""}
                isEdittable={mode === "view"}
                className="h-[37.6px]"
                fontSize="14px"
                height="37.6px"
                borderColor="#5BC4BF"
              />
            </div>

            <div>
              <DateInput
                label={"Date Referred"}
                className="border-keppel h-[37.6px]"
                value={formData?.date_referred || ""}
                handleChange={(date) => handleChange("date_referred", date)}
                isEdittable={mode === "view"}
                height="37.6px"
                borderColor="#5BC4BF"
              />
            </div>

            <div className="col-span-1">
              <DropDown
                label={"Referred by"}
                selectedOption={formData?.referred_by || ""}
                handleChange={(option) =>
                  handleChange("referred_by", option.value)
                }
                isEdittable={mode === "view"}
                className="h-[37.6px]"
                fontSize="14px"
                height="37.6px"
                borderColor="#5BC4BF"
              />
            </div>

            <div className="col-span-3">
              <TextAreaElement
                className="border-keppel h-32"
                value={formData?.referral_comments || ""}
                onChange={(e) =>
                  handleChange("referral_comments", e.target.value)
                }
                disabled={mode === "view"}
                addMargin={false}
                label={"Referral Comments"}
              />
            </div>

            <div className="col-span-3">
              <TextAreaElement
                className="border-keppel h-32"
                value={formData?.progress_comments || ""}
                onChange={(e) =>
                  handleChange("progress_comments", e.target.value)
                }
                disabled={mode === "view"}
                addMargin={false}
                label={"Progress Comments"}
              />
            </div>

            <div>
              <InputElement
                type="text"
                className="border-keppel"
                addMargin={false}
                disabled={mode === "view"}
                onChange={(e) => handleChange("link", e.target.value)}
                label={"Link"}
              />
            </div>

            <div>
              <DateInput
                label={"Date Closed"}
                className="border-keppel h-[37.6px]"
                height="37.6px"
                isEdittable={mode === "view"}
                handleChange={(date) => handleChange("date_closed", date)}
                borderColor="#5BC4BF"
              />
            </div>

            <div className="col-span-1">
              <DropDown
                label={"Status"}
                className="h-[37.6px]"
                isEdittable={mode === "view"}
                handleChange={(option) => handleChange("status", option.value)}
                fontSize="14px"
                height="37.6px"
                borderColor="#5BC4BF"
              />
            </div>

            <div className="col-span-3">
              <InputElement
                type="text"
                className="border-keppel"
                disabled
                label={"Closed by"}
                addMargin={false}
              />
            </div>
          </div>

          <div className="mx-auto flex justify-center items-center gap-x-4 my-8">
            <Link to={`/assignments-and-referrals/${clientId}?tab=referrals`}>
              <button className="border border-keppel rounded-[3px] text-[#5BC4BF] w-32 py-2">
                Cancel
              </button>
            </Link>
            <button
              // disabled={disableSubmit || mode === "view"}
              // onClick={mode === "encounterMode" ? handleCreate :handleUpdate}
              disabled={mode === "view"}
              onClick={handleUpdate}
              className="border border-keppel rounded-[3px] disabled:cursor-not-allowed disabled:bg-[#6cd8d3] bg-[#5BC4BF] text-white w-32 py-2"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReferralEdit;
