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

function ProgramForm() {
  const { clientId } = useParams();
  const [formData, setFormData] = useState({
    id: Number(clientId),
    unassign_program: false,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [mode, setMode] = useState(queryParams.get("mode") || null);

  const [usersOptions, setUsersOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);

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
      const response = await protectedApi.get("/user-details/");
      setFormData((prev) => {
        return {
          ...prev,
          assigned_by: response.data.user_id,
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

  const fetchProgram = useCallback(async () => {
    try {
      const programId = queryParams.get("programId");
      if (!programId) {
        notifyWarn("Program ID not found");
        return;
      }
      const response = await protectedApi.get(`/programs/${programId}/`);
      setFormData(response.data);
    } catch {
      console.error("Error fetching program");
      notifyError("Error fetching program");
    }
  }, []);

  const handleCreate = useCallback(async () => {
    try {
      const payload = {
        // client_id: formData.client_id,
        program_id: formData.program_id,
        date_assigned: formData.date_assigned,
        status: formData.status,
        notes: formData.notes,
        unassign_program: formData.unassign_program,
        closed_reason: formData.closed_reason,
        date_closed: formData.date_closed,
      };
      const response = await protectedApi.post("/programs/", payload);
      if (response.status === 201) {
        notifySuccess("Program created successfully");
        navigate(`/clientchart/${clientId}`);
      }
    } catch (error) {
      console.error(error);
    }
  }, [formData]);

  const handleUpdate = useCallback(async () => {
    try {
      const programId = queryParams.get("programId");
      if (!programId) {
        notifyWarn("Program ID not found");
        return;
      }
      const payload = {
        // client_id: formData.client_id,
        program_id: formData.program_id,
        date_assigned: formData.date_assigned,
        status: formData.status,
        notes: formData.notes,
        unassign_program: formData.unassign_program,
        closed_reason: formData.closed_reason,
        date_closed: formData.date_closed,
      };
      const response = await protectedApi.put(
        `/programs/${programId}/`,
        payload
      );
      if (response.status === 200) {
        notifySuccess("Program updated successfully");
        navigate(`/clientchart/${clientId}`);
      }
    } catch (error) {
      console.error(error);
    }
  }, [formData]);

  const handleChange = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    fetchAllUser();
    fetchPrograms();
    
    if (mode === "edit" || mode === "view") {
      fetchProgram();
    } else {
      fetchUsername();
    }
  }, []);

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  // remove closed reason and date closed if status is not closed
  useEffect(() => {
    if (
      formData?.status !== "Closed" &&
      (formData?.closed_reason !== undefined ||
        formData?.date_closed !== undefined)
    ) {
      setFormData((prev) => {
        const data = { ...prev };
        delete data.closed_reason;
        delete data.date_closed;
        return data;
      });
    }
  }, [formData]);

  return (
    <div className="grid mx-4">
      <div className="bg-[#5BC4BF] text-white px-3 py-2">New Program</div>

      <div className="bg-white border border-[#DBE0E5]">
        <div className="grid grid-cols-3 m-10 gap-x-4 gap-y-6">
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

          <div className="col-span-1">
            <DropDown
              label="Assigned by"
              selectedOption={
                usersOptions.find((user) => user.id === formData?.assigned_by)
                  ?.label || ""
              }
              options={usersOptions}
              isEdittable
              className="h-[37.6px]"
              fontSize="14px"
              height="37.6px"
              borderColor="#5BC4BF"
            />
          </div>
          <div className="col-span-3">
            <TextAreaElement
              className="border-keppel h-32"
              value={formData?.notes || ""}
              disabled={mode === "view"}
              onChange={(e) => handleChange("notes", e.target.value)}
              addMargin={false}
              label="Notes"
            />
          </div>
          <div className="col-span-1">
            <DropDown
              label="Status"
              selectedOption={formData?.status}
              options={[
                { label: "Active", value: "Active" },
                { label: "Closed", value: "Closed" },
              ]}
              handleChange={(option) => {
                handleChange("status", option.value);
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
                  checked={formData?.unassign_program || false}
                  onChange={(e, checked) =>
                    handleChange("unassign_program", checked)
                  }
                />
              }
              disabled={mode === "view"}
              label="Unassign Program"
              labelPlacement="start"
            />
          </div>
          <div className="col-span-1">
            <DropDown
              label="Closed Reason"
              selectedOption={formData?.closed_reason || ""}
              isEdittable={formData?.status !== "Closed" || mode === "view"}
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
              isEdittable={formData?.status !== "Closed" || mode === "view"}
              value={
                formData?.date_closed
                  ? format(formData?.date_closed, "MM-dd-yyyy")
                  : ""
              }
              handleChange={(date) => handleChange("date_closed", date)}
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
                      (user) => user?.value === formData?.closed_by
                    )?.label
                  : ""
              }
              options={usersOptions}
              // handleChange={(option) => {
              //   handleChange("program", option.value);
              // }}
              isEdittable
              className="h-[37.6px]"
              fontSize="14px"
              height="37.6px"
              borderColor="#5BC4BF"
            />
          </div>
        </div>

        <div className="mx-auto flex justify-center items-center gap-x-4 my-8">
          <Link to={`/assignments-and-referrals/${clientId}?tab=programs`}>
            <button className="border border-keppel rounded-[3px] text-[#5BC4BF] w-32 py-2">
              Cancel
            </button>
          </Link>
          <button
            // disabled={disableSubmit || mode === "view"}
            disabled={mode === "view"}
            onClick={!mode ? handleCreate : handleUpdate}
            // onClick={handleCreate}
            className="border border-keppel rounded-[3px] disabled:cursor-not-allowed disabled:bg-[#6cd8d3] bg-[#5BC4BF] text-white w-32 py-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProgramForm;
