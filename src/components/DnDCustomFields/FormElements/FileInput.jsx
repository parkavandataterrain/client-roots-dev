import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function handleRemove(filePath, files, setFiles) {
  setFiles(files.filter((file) => file.path !== filePath));
}

function FileInput({ title, className, files, setFiles, formData, ...rest }) {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    console.log(acceptedFiles);
    setFiles(acceptedFiles);
  }, [formData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // accept: {
    // "application/pdf": [".pdf"],
    // "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    //   [".docx"],
    // },
  });

  return (
    <div
      className={`border flex rounded-[6px] justify-between items-center pl-4 pr-2 ${className}`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {!files?.length && <div className="text-[#8C8C8C]">{title}</div>}
      {files?.length > 0 && (
        <div className="flex items-center gap-x-2 overflow-x-auto mr-3">
          {files.map((file) => (
            <div key={file.path} className="bg-[#D4EDEC] my-1 p-1 flex gap-x-2 rounded-sm justify-center items-center">
              <div className="text-nowrap">{file.path}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleRemove(file.path, files, setFiles);
                }}
                className="size-4"
              >
                <img src="/close.svg" className="size-4" alt="" />
              </button>
            </div>
          ))}
        </div>
      )}
      <img src="/attach.svg" className="size-8 my-0.5" alt="" />
    </div>
  );
}

export default FileInput;
