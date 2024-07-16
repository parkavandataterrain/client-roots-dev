import React, { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { protectedApi } from "../../../services/api";
import FormLabel from "./FormLabel";

function FileInput({
  title,
  className,
  label,
  files,
  setFiles,
  formData,
  setFormData,
  mode,
  deletedFilesKey,
  disabled,
  multiple = true,
  rounded = true,
  ...rest
}) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!multiple) {
        setFiles(acceptedFiles[0]);
      } else {
        setFiles([...files, ...acceptedFiles]);
      }
    },
    [formData, files]
  );

  const handleRemove = useCallback(
    (filePath, file_id) => {
      if (!multiple) {
        setFiles(null);
        return;
      } else {
        setFiles(
          files.filter(
            (file) => file.path !== filePath || file?.file_id !== file_id
          )
        );
        if (formData && mode === "edit") {
          setFormData((prev) => {
            const newFormData = { ...prev };
            if (typeof newFormData[deletedFilesKey] !== Array) {
              newFormData[deletedFilesKey] = [];
            }
            if (file_id) {
              newFormData[deletedFilesKey].push(file_id);
            }
            return newFormData;
          });
        }
      }
    },
    [files, formData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: multiple,
    disabled,
    // accept: {
    // "application/pdf": [".pdf"],
    // "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    //   [".docx"],
    // },
  });

  const extractFilenameFromHeader = useCallback((response) => {
    const contentDisposition = response.headers.get("Content-Disposition");
    const matches = contentDisposition.match(/filename="(.+)"/);
    if (matches && matches.length > 1) {
      return matches[1];
    }
  }, []);

  const downloadFile = useCallback(async (fileId) => {
    try {
      if (!fileId) return;
      const response = await protectedApi.get(`/download_document/${fileId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", extractFilenameFromHeader(response));

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }, []);

  const filesArr = useMemo(() => {
    if (Array.isArray(files)) {
      return files;
    } else if (files !== null) {
      return [files];
    } else {
      return [];
    }
  }, [files]);

  return (
    <>
      {label && <FormLabel>{label}</FormLabel>}
      <div
        className={`border flex ${
          rounded ? "rounded-[6px]" : ""
        } justify-between items-center pl-2 pr-2 ${
          !disabled ? "hover:cursor-pointer" : "bg-[#fafafa]"
        } ${className}`}
        {...getRootProps()}
      >
        <input {...getInputProps({ disabled })} />
        {!filesArr?.length  && (
          <div className="text-[#8C8C8C]">{title}</div>
        )}
        {filesArr?.length > 0 && (
          <div className="flex items-center gap-x-2 overflow-x-auto mr-3">
            {filesArr.map((file) => (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  downloadFile(file?.file_id);
                }}
                key={file.path}
                className="bg-[#D4EDEC] my-1 p-1 flex gap-x-2 rounded-sm justify-center items-center"
              >
                <div className="text-nowrap">{file.path || file.file_name}</div>
                <button
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleRemove(file.path, file?.file_id);
                  }}
                  className="size-4 disabled:cursor-not-allowed"
                >
                  <img src="/close.svg" className="size-4" alt="" />
                </button>
              </button>
            ))}
          </div>
        )}
        <img src="/attach.svg" className="size-8 my-0.5" alt="" />
      </div>
    </>
  );
}

export default FileInput;
