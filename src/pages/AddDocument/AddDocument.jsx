import React, { useCallback, useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import DropDown from "../../components/common/Dropdown";
import InputElement from "../../components/dynamicform/FormElements/InputElement";
import DateInput from "../../components/common/DateInput";
import FileInput from "../../components/dynamicform/FormElements/FileInput";
import { protectedApi } from "../../services/api";
import { format } from "date-fns";
import { notifyError, notifySuccess } from "../../helper/toastNotication";

async function fetchProgramOptions() {
  try {
    const response = await protectedApi.get("/api/resources/program");
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

async function fetchClientDetails({ clientId }) {
  try {
    if (clientId === undefined) {
      notifyError("Client ID is required");
    }
    const respone = await protectedApi.get(
      `/encounter-note-client-details/?id=${clientId}`
    );

    if (respone.status === 200) {
      return respone.data;
    }
  } catch (error) {
    console.error(error.message);
  }
}

function AddDocument() {
  const [formData, setFormData] = useState();
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [programOptions, setProgramOptions] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchProgramOptions()
      .then((programOptionsResponse) => {
        const convertedProgramOptions = programOptionsResponse.map(
          (program) => ({ label: program.name, value: program.id })
        );
        setProgramOptions(convertedProgramOptions);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  useEffect(() => {
    fetchClientDetails({ clientId })
      .then((clientDetails) => {
        setFormData((prev) => ({
          ...prev,
          client: {
            id: clientId,
            name: `${clientDetails.first_name || ""} ${
              clientDetails.last_name || ""
            }`,
          },
        }));
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  const handleFormDataChange = useCallback(
    (fieldName, value) => {
      setFormData((prevData) => ({ ...prevData, [fieldName]: value }));
    },
    [formData]
  );

  const preparePayload = useCallback(() => {
    const {
      client,
      document_name,
      document_type,
      document_upload,
      program,
      form_completion_date,
    } = formData;

    const formDataPayload = new FormData();
    client && formDataPayload.append("client", client.id);
    document_name && formDataPayload.append("document_name", document_name);
    document_type && formDataPayload.append("document_type", document_type);
    program !== undefined && formDataPayload.append("program", program);
    form_completion_date &&
      formDataPayload.append("form_completion_date", form_completion_date);
    document_upload &&
      formDataPayload.append("document_upload", document_upload);

    return formDataPayload;
  }, [formData]);

  const handleCreate = useCallback(async () => {
    try {
      const payload = preparePayload();
      const response = await protectedApi.post("/documents/", payload);

      if (response.status === 201) {
        notifySuccess("Document created successfully");
        navigate(`/clientchart/${clientId}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [formData]);

  useEffect(() => {
    console.log({ formData });
  }, [formData]);

  return (
    <div className="mx-1" style={{ fontFamily: "poppins" }}>
      <PageTitle
        title="Add New Document"
        clientId={clientId}
        onClick={() => navigate(`/clientchart/${clientId}`)}
      />

      <div className="bg-white shadow rounded-[5px] my-6 py-8 px-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <DropDown
              label="Client Name"
              borderColor="#5BC4BF"
              rounded={false}
              fontSize="14px"
              isEdittable={clientId !== undefined}
              selectedOption={formData?.client?.name || ""}
              handleChange={(value) => handleFormDataChange("client", value)}
              options={[
                { value: "Option 1", label: "Option 1" },
                { value: "Option 2", label: "Option 2" },
                { value: "Option 3", label: "Option 3" },
                { value: "Option 4", label: "Option 4" },
              ]}
              height="16px"
            />
          </div>
          <div className="col-span-1">
            <DropDown
              label="Document Type"
              borderColor="#5BC4BF"
              rounded={false}
              fontSize="14px"
              selectedOption={formData?.document_type || ""}
              handleChange={(option) =>
                handleFormDataChange("document_type", option.value)
              }
              options={[{ value: "Encounter type", label: "Encounter type" }]}
              height="16px"
            />
          </div>
          <div className="col-span-1">
            <DateInput
              label="Form Completion Date"
              rounded={false}
              dateFormat="MM-dd-yyyy"
              className="h-[38px] border-keppel"
              height="38px"
              // isEdittable={mode === "view"}
              value={
                formData?.form_completion_date
                  ? format(formData?.form_completion_date, "MM-dd-yyyy")
                  : ""
              }
              handleChange={(date) =>
                handleFormDataChange("form_completion_date", date)
              }
            />
          </div>
          <div className="col-span-1">
            <DropDown
              label="Program"
              borderColor="#5BC4BF"
              rounded={false}
              fontSize="14px"
              selectedOption={
                programOptions?.find(
                  (program) => program.value === formData?.program
                )?.label || ""
              }
              handleChange={(program) =>
                handleFormDataChange("program", program.value)
              }
              options={programOptions}
              height="16px"
            />
          </div>
          <div className="col-span-2">
            <FileInput
              title="Select Document"
              label="Document Upload"
              rounded={false}
              multiple={false}
              className="border-keppel w-full"
              formData={formData}
              setFormData={setFormData}
              // disabled={mode === "view"}
              // mode={mode}
              deletedFilesKey="uploaded_documents_deleted"
              files={formData?.document_upload || []}
              setFiles={useCallback(
                (files) => {
                  setFormData({ ...formData, document_upload: files });
                },
                [formData]
              )}
            />
          </div>
        </div>

        <div className="mx-auto flex justify-center items-center gap-x-4 my-8">
          <button
            onClick={() => navigate(`/clientchart/${clientId}`)}
            className="border border-keppel rounded-[3px] text-[#5BC4BF] w-32 py-2"
          >
            Cancel
          </button>
          <button
            // disabled={disableSubmit || mode === "view"}
            // onClick={mode === "edit" ? handleUpdate : handleCreate}
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

export default AddDocument;
