import React, { useCallback, useEffect, useState } from "react";
import DropDown from "../../components/common/Dropdown";
import DateInput from "../../components/common/DateInput";
import TextAreaElement from "../../components/dynamicform/FormElements/TextAreaElement";
import InputElement from "../../components/dynamicform/FormElements/InputElement";
import { format } from "date-fns";
import TimeInput from "../../components/common/TimeInput";
import MultiSelectElement from "../../components/dynamicform/FormElements/MultiSelectElement";
import { protectedApi } from "../../services/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifyError, notifySuccess } from "../../helper/toastNotication";

function ReferralForm() {
  const { clientId } = useParams();
  const [formData, setFormData] = useState({
    client: Number(clientId),
    submitted_date: format(new Date(), "yyyy-MM-dd"),
    submitted_time: format(new Date(), "HH:mm:ss"),
  });
  const [usersOptions, setUsersOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [activityOptions, setActivityOptions] = useState([]);

  const navigate = useNavigate();

  const fetchAllUser = useCallback(async () => {
    try {
      const response = await protectedApi.get("/encounter-notes-users/");
      setUsersOptions(
        response.data.map((itm) => {
          return { ...itm, label: itm.username, value: itm.id };
        })
      );
    } catch (error) {
      // Handle errors here
      console.error("Error fetching all users:", error);
    }
  }, []);

  const fetchClientBirthDate = useCallback(async (clientId) => {
    try {
      const response = await protectedApi.get(`/clientinfo-api/${clientId}`);
      setFormData((prev) => {
        return {
          ...prev,
          dob: response.data.date_of_birth,
        };
      });
    } catch (error) {
      // Handle errors here
      notifyError("Error fetching client birth date");
      console.error("Error fetching client birth date:", error);
    }
  }, []);

  const fetchUsername = async () => {
    try {
      const response = await protectedApi.get("/api/username");
      setFormData((prev) => {
        return {
          ...prev,
          referred_by: response.data.username,
        };
      });
    } catch (error) {
      // Handle errors here
      console.error("Error fetching all users:", error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await protectedApi.get("/api/resources/all-programs");
      setProgramOptions(
        response.data.map((itm) => {
          return {
            ...itm,
            label: itm.name,
            value: itm.id,
          };
        })
      );
    } catch (error) {
      // Handle errors here
      console.error("Error fetching position titles:", error);
    }
  };

  const handleCreate = useCallback(async () => {
    try {
      console.log("formData", formData);
      const payload = {
        client: formData.client,
        program: formData.program,
        activity: formData.activity?.map((itm) => itm.value),
        comments: formData.comments,
      };
      const response = await protectedApi.post(
        `/referrals/create/${clientId}`,
        payload
      );
      if (response.status === 201) {
        notifySuccess("Referral created successfully");
        navigate(`/assignments-and-referrals/${clientId}?tab=referrals`);
      }
    } catch (error) {
      console.error(error);
    }
  }, [formData]);

  const handleFetchActivityOptions = useCallback(
    async (programId) => {
      try {
        const response = await protectedApi.get(
          `/programs/activities/${programId}`
        );
        setActivityOptions(
          response.data.activities.map((itm) => {
            return {
              ...itm,
              label: itm.name,
              value: itm.name,
            };
          })
        );
      } catch (error) {
        // Handle errors here
        notifyError("Error fetching activity options");
        console.error("Error fetching position titles:", error);
      }
    },
    [clientId]
  );

  const handleChange = useCallback((key, value) => {
    if (key === "program") {
      handleFetchActivityOptions(value);
      setFormData((prev) => ({ ...prev, [key]: value, activity: [] }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  }, []);

  useEffect(() => {
    fetchAllUser();
    fetchUsername();
    fetchPrograms();
  }, []);

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  return (
    <div className="grid mx-4">
      <div className="bg-[#5BC4BF] text-white px-3 py-2">Client Referral</div>

      <div className="bg-white border border-[#DBE0E5]">
        <div className="grid grid-cols-4 m-10 gap-x-4 gap-y-6">
          <div className="col-span-2">
            <DropDown
              label="Client Name"
              className="h-[37.6px]"
              options={usersOptions}
              selectedOption={
                formData?.id
                  ? usersOptions?.find((itm) => itm.id === formData.id)?.label
                  : null
              }
              handleChange={(option) => {
                fetchClientBirthDate(option.value);
                handleChange("id", option.value);
              }}
              fontSize="14px"
              height="37.6px"
              borderColor="#5BC4BF"
            />
          </div>

          <div className="col-span-2">
            <DropDown
              label="Program Name"
              selectedOption={
                formData?.program
                  ? programOptions.find(
                      (program) => program?.value === formData?.program
                    )?.label
                  : ""
              }
              options={programOptions}
              handleChange={(option) => {
                handleChange("program", option.value);
              }}
              className="h-[37.6px]"
              fontSize="14px"
              height="37.6px"
              borderColor="#5BC4BF"
            />
          </div>

          <div className="col-span-2">
            {/* <DropDown
              label="Referred To"
              className="h-[37.6px]"
              fontSize="14px"
              height="37.6px"
              borderColor="#5BC4BF"
              selectedOption={
                formData?.referred_to
                  ? programOptions.find(
                      (option) => option?.value === formData?.referred_to
                    )?.label
                  : ""
              }
              options={programOptions}
              handleChange={(option) => {
                handleChange("referred_to", option.value);
              }}
            /> */}

            <MultiSelectElement
              label={"Activity"}
              name={"activity"}
              className="border-keppel"
              disableHorizontalMargin={true}
              placeholder="Activity"
              value={formData?.activity || []}
              // disabled={mode === "view"}
              onChange={(data) => {
                // const updatedData = [];
                // if (mode === "edit") {
                //   let care_plans_deleted = [
                //     ...formData?.care_plans_deleted,
                //     ...formData?.care_plans,
                //   ];
                //   data.forEach((d) => {
                //     const old_length = formData?.care_plans_deleted?.length;
                //     care_plans_deleted = care_plans_deleted.filter(
                //       (carePlanId) => carePlanId !== d.value
                //     );
                //     if (care_plans_deleted.length !== old_length) {
                //       updatedData.push(d.value);
                //     } else {
                //       updatedData.push(d.value);
                //     }
                //   });
                //   handleFormDataChange(
                //     "care_plans_deleted",
                //     care_plans_deleted
                //   );
                //   handleFormDataChange("care_plans", updatedData);
                // } else {
                //   handleFormDataChange(
                //     "care_plans",
                //     data.map((d) => d.value)
                //   );
                // }
                console.log(data);
                handleChange("activity", data);
              }}
              // options={activityOptions}
              options={activityOptions}
            />

            {/* <InputElement
              value={formData?.activity || ""}
              label="Activity"
              className="border-keppel"
              addMargin={false}
              onChange={(e) => handleChange("activity", e.target.value)}
            /> */}
          </div>

          <div className="col-span-2">
            <DateInput
              label="DOB"
              className="border-keppel h-[37.6px]"
              value={formData?.dob ? format(formData?.dob, "MM-dd-yyyy") : ""}
              // handleChange={(value) => handleChange("dob", value)}
              isEdittable
              height="37.6px"
              borderColor="#5BC4BF"
            />
          </div>

          <div className="col-span-2">
            <DropDown
              label="Referred By"
              selectedOption={formData?.referred_by || ""}
              isEdittable
              className="h-[37.6px]"
              fontSize="14px"
              height="37.6px"
              borderColor="#5BC4BF"
            />
          </div>

          <div>
            <DateInput
              label="Submitted Date"
              className="border-keppel h-[37.6px]"
              value={
                formData?.submitted_date
                  ? format(new Date(formData?.submitted_date), "MM-dd-yyyy")
                  : ""
              }
              isEdittable
              height="37.6px"
              borderColor="#5BC4BF"
            />
          </div>

          <div>
            <InputElement
              label="Start TIme"
              className="border-keppel h-[37.6px]"
              value={formData?.submitted_time || ""}
              disabled
            />
          </div>

          <div className="col-span-4">
            <TextAreaElement
              className="border-keppel h-32"
              value={formData?.comments || ""}
              onChange={(e) => handleChange("comments", e.target.value)}
              addMargin={false}
              label="Comments"
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
            onClick={handleCreate}
            className="border border-keppel rounded-[3px] disabled:cursor-not-allowed disabled:bg-[#6cd8d3] bg-[#5BC4BF] text-white w-32 py-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReferralForm;
