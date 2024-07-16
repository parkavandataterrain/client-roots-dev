import React, { useCallback, useEffect, useState } from "react";
import DropDown from "../../components/common/Dropdown";
import DateInput from "../../components/common/DateInput";
import TextAreaElement from "../../components/dynamicform/FormElements/TextAreaElement";
import InputElement from "../../components/dynamicform/FormElements/InputElement";
import { format } from "date-fns";
import TimeInput from "../../components/common/TimeInput";
import { protectedApi } from "../../services/api";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Checkbox, FormControlLabel } from "@mui/material";
import {
  notifyError,
  notifySuccess,
  notifyWarn,
} from "../../helper/toastNotication";

function NavigationForm() {
  const { clientId } = useParams();
  const [formData, setFormData] = useState({
    id: Number(clientId),
    submitted_date: format(new Date(), "yyyy-MM-dd"),
    submitted_time: format(new Date(), "HH:mm:ss"),
  });
  const [usersOptions, setUsersOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [mode, setMode] = useState(queryParams.get("mode") || null);

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

  const handleChange = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const fetchNavigation = useCallback(async () => {
    try {
      const navigationId = queryParams.get("navigationId");
      if (!navigationId) {
        notifyWarn("Navigation ID not found");
        return;
      }
      const response = await protectedApi.get(
        `/navigator-assignments/${navigationId}/`
      );
      setFormData(response.data);
    } catch {
      console.error("Error fetching navigation");
      notifyError("Error fetching navigation");
    }
  }, []);

  const handleCreate = useCallback(async () => {
    try {
      const payload = {
        // client_id: formData.client_id,
        navigator_id: formData.navigator_id,
        program_id: formData.program_id,
        date_assigned: formData.date_assigned,
        notes: formData.notes,
        assigned_by: formData.assigned_by,
        unassign_navigator: formData.unassign_navigator,
        closed_reason: formData.closed_reason,
      };
      const response = await protectedApi.post("/assignments/", payload);
      if (response.status === 201) {
        notifySuccess("Navigation created successfully");
        navigate(`/clientchart/${clientId}`);
      }
    } catch (error) {
      console.error(error);
    }
  }, [formData]);

  const handleUpdate = useCallback(async () => {
    try {
      const navigationId = queryParams.get("navigationId");
      if (!navigationId) {
        notifyWarn("Navigation ID not found");
        return;
      }
      const payload = {
        // client_id: formData.client_id,
        navigator_id: formData.navigator_id,
        program_id: formData.program_id,
        date_assigned: formData.date_assigned,
        notes: formData.notes,
        assigned_by: formData.assigned_by,
        unassign_navigator: formData.unassign_navigator,
        closed_reason: formData.closed_reason,
      };
      const response = await protectedApi.put(
        `/navigator-assignments/${navigationId}/`,
        payload
      );
      if (response.status === 200) {
        notifySuccess("Navigation updated successfully");
        navigate(`/clientchart/${clientId}`);
      }
    } catch (error) {
      console.error(error);
    }
  }, [formData]);

  useEffect(() => {
    fetchAllUser();
    fetchUsername();
    fetchPrograms();

    if (mode === "view" || mode === "edit") {
      fetchNavigation();
    }
  }, []);

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  return (
    <div className="grid mx-4">
      <div className="bg-[#5BC4BF] text-white px-3 py-2">Navigation</div>

      <div className="bg-white border border-[#DBE0E5]">
        <div className="grid grid-cols-3 m-10 gap-x-4 gap-y-6">
          <div className="col-span-1">
            <DropDown
              label="User Name"
              className="h-[37.6px]"
              options={usersOptions}
              selectedOption={
                formData?.navigator_id
                  ? usersOptions?.find((itm) => itm.id === formData.navigator_id)
                      ?.label
                  : null
              }
              handleChange={(option) => {
                handleChange("navigator_id", option.value);
              }}
              isEdittable={mode === "view"}
              fontSize="14px"
              height="37.6px"
              borderColor="#5BC4BF"
            />
          </div>
          <div className="col-span-1">
            <DropDown
              label="Program Name"
              selectedOption={
                formData?.program_id
                  ? programOptions.find(
                      (program) => program?.value === formData?.program_id
                    )?.label
                  : ""
              }
              options={programOptions}
              handleChange={(option) => {
                handleChange("program_id", option.value);
              }}
              isEdittable={mode === "view"}
              className="h-[37.6px]"
              fontSize="14px"
              height="37.6px"
              borderColor="#5BC4BF"
            />
          </div>

          <div className="col-span-1">
            <DateInput
              label="Date Assigned"
              className="border-keppel h-[37.6px]"
              value={
                formData?.date_assigned
                  ? format(formData?.date_assigned, "MM-dd-yyyy")
                  : ""
              }
              handleChange={(date) => handleChange("date_assigned", date)}
              isEdittable={mode === "view"}
              height="37.6px"
              borderColor="#5BC4BF"
            />
          </div>
          <div className="col-span-3">
            <TextAreaElement
              className="border-keppel h-32"
              value={formData?.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              disabled={mode === "view"}
              addMargin={false}
              label="Notes"
            />
          </div>
          <div className="col-span-1">
            <DropDown
              label="Assigned by"
              selectedOption={
                formData?.assigned_by
                  ? usersOptions.find(
                      (program) => program?.value === formData?.assigned_by
                    )?.label
                  : ""
              }
              options={usersOptions}
              handleChange={(option) => {
                handleChange("assigned_by", option.value);
              }}
              isEdittable={mode === "view"}
              className="h-[37.6px]"
              fontSize="14px"
              height="37.6px"
              borderColor="#5BC4BF"
            />
          </div>
          <div className="col-span-1 flex items-end pl-5 text-sm text-gray-500 fill-gray-500 ">
            <FormControlLabel
              value="start"
              control={
                <Checkbox
                  checked={formData?.unassign_navigator || false}
                  onChange={(e, checked) =>
                    handleChange("unassign_navigator", checked)
                  }
                  disabled={mode === "view"}
                />
              }
              label="Unassign Program"
              labelPlacement="start"
            />
          </div>
          <div className="col-span-1">
            <DropDown
              label="Closed Reason"
              selectedOption={formData?.closed_reason || ""}
              options={[
                {
                  label: "Goals Achieved/Graduated",
                  value: "Goals Achieved/Graduated",
                },
                {
                  label: "Client declined further service",
                  value: "Client declined further service",
                },
                {
                  label: "Client moved or changed service providers",
                  value: "Client moved or changed service providers",
                },
                {
                  label: "Non-eligible health insurance",
                  value: "Non-eligible health insurance",
                },
                {
                  label: "Unreachable/Lost Contact",
                  value: "Unreachable/Lost Contact",
                },
                {
                  label: "Violation of community code",
                  value: "Violation of community code",
                },
                { label: "Deceased", value: "Deceased" },
              ]}
              handleChange={(option) => {
                handleChange("closed_reason", option.value);
              }}
              isEdittable={mode === "view"}
              className="h-[37.6px]"
              fontSize="14px"
              height="37.6px"
              borderColor="#5BC4BF"
            />
          </div>
          <div className="col-span-1">
            <DateInput
              label="Date Closed"
              className="border-keppel h-[37.6px]"
              value={
                formData?.date_closed
                  ? format(formData?.date_closed, "MM-dd-yyyy")
                  : ""
              }
              isEdittable
              height="37.6px"
              borderColor="#5BC4BF"
            />
          </div>
          <div className="col-span-2">
            <DropDown
              label="Closed by"
              selectedOption={
                formData?.closed_by
                  ? usersOptions.find(
                      (option) => option?.value === formData?.usersOptions
                    )?.label
                  : ""
              }
              isEdittable
              // options={programOptions}
              // handleChange={(option) => {
              //   handleChange("program", option.value);
              // }}
              className="h-[37.6px]"
              fontSize="14px"
              height="37.6px"
              borderColor="#5BC4BF"
            />
          </div>
        </div>

        <div className="mx-auto flex justify-center items-center gap-x-4 my-8">
          <Link to={`/assignments-and-referrals/${clientId}?tab=navigations`}>
            <button className="border border-keppel rounded-[3px] text-[#5BC4BF] w-32 py-2">
              Cancel
            </button>
          </Link>
          <button
            disabled={mode === "view"}
            onClick={!mode ? handleCreate : handleUpdate}
            className="border border-keppel rounded-[3px] disabled:cursor-not-allowed disabled:bg-[#6cd8d3] bg-[#5BC4BF] text-white w-32 py-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default NavigationForm;
