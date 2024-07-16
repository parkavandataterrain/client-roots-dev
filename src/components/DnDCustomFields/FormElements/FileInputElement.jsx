import React, { useCallback } from "react";
import FormLabel from "./FormLabel";

import Attachments_Icon from "../../images/form_builder/attachments.svg";
import Image_upload_Icon from "../../images/form_builder/image_upload.svg";

const FileInputElement = (props) => {
  const {
    className,
    type,
    label,
    required,
    value,
    placeholder,
    disabled = false,
    width,
    isFile,
    base64,
    accept,
    viewMode,
    editMode,
    handleResetFile,
    uploadType,
    ...rest
  } = props;
  
  let IconSrc = isFile ? Attachments_Icon : Image_upload_Icon;

  const renderInput = () => {
    if (!viewMode && !editMode) {
      return <DnDRenderMode IconSrc={IconSrc} {...props} />;
    }
    if (viewMode && !editMode) {
      return <ViewMode IconSrc={IconSrc} {...props} />;
    }

    if (viewMode && editMode) {
      return <EditMode IconSrc={IconSrc} {...props} />;
    }

    return null;
  };

  return (
    <div className={`m-1 ${width}`}>
      {label && <FormLabel required={required}>{label}</FormLabel>}
      {renderInput()}
    </div>
  );
};

const ViewMode = ({ IconSrc, label, base64, isFile }) => {
  if (!base64) {
    
    return (
      <div className="rounded flex items-center gap-2 w-100 p-2 py-2.5 cursor-pointer">
        <img src={IconSrc} alt="Icon" className="h-[14.06px] w-[14.06px]" />
        <span className="text-xs font-medium">{`No ${
          isFile ? "File" : "Image"
        }`}</span>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      {isFile ? (
        <a
          className="border border-keppel rounded-[3px] disabled:cursor-not-allowed disabled:bg-[#6cd8d3] bg-[#5BC4BF] text-white p-1 px-2 text-xs"
          href={base64}
          download={label}
        >
          Download File
        </a>
      ) : (
        <img
          src={base64}
          style={{
            width: "100px",
            height: "auto",
          }}
        />
      )}
    </div>
  );
};
const EditMode = ({
  className,
  type,
  label,
  required,
  value,
  placeholder,
  disabled = false,
  width,
  isFile,
  base64,
  accept,
  viewMode,
  editMode,
  handleResetFile,
  ...rest
}) => {
  return base64 ? (
    <div className="flex gap-2 items-center">
      {isFile ? (
        <a
          className="border border-keppel rounded-[3px] disabled:cursor-not-allowed disabled:bg-[#6cd8d3] bg-[#5BC4BF] text-white p-1 px-2 text-xs"
          href={base64}
          download={label}
        >
          Download File
        </a>
      ) : (
        <img
          src={base64}
          style={{
            width: "100px",
            height: "auto",
          }}
        />
      )}

      <button
        className="border border-keppel rounded-[3px] text-[#5BC4BF] p-1 px-2 text-xs"
        onClick={handleResetFile}
      >
        Change
      </button>
    </div>
  ) : (
    <div className="rounded flex items-center gap-2 w-100 p-2 py-2.5 hover:bg-teal-400 cursor-pointer">
      <input type={type} accept={accept} disabled={disabled} {...rest} />
    </div>
  );
};
const DnDRenderMode = ({
  base64,
  isFile,
  label,
  disabled,
  IconSrc,
  handleResetFile,
}) => {
  
  let src = base64
  let isFallback = false
  const handleError = (e) => {
    isFallback = true;
    e.target.onerror = null; // Prevents looping in case fallback also fails
    e.target.src = Attachments_Icon;
    e.target.className = 'w-[50px] h-[50px]'
    
  };



  return base64 ? (

    <div className="flex gap-2 items-center">
      {isFile ? (
        <a
          className="border border-keppel rounded-[3px] disabled:cursor-not-allowed disabled:bg-[#6cd8d3] bg-[#5BC4BF] text-white p-1 px-2 text-xs"
          href={base64}
          download={label}
        >
          Download File
        </a>
      ) : (
        <img
          src={src}
          onError={handleError}
          className={isFallback ? 'w-[50px] h-[50px]' : 'w-[100px] h-auto'}
          alt="upload"
        />
      )}
    </div>
  ) : (
    <div className="rounded flex items-center gap-2 w-100 p-2 py-2.5 hover:bg-teal-400 cursor-pointer">
      <img src={IconSrc} alt="Icon" className="h-[14.06px] w-[14.06px]" />
      <span className="text-xs font-medium">{`No ${
        isFile ? "File" : "Image"
      } Choosen`}</span>
    </div>
  );
};

export default FileInputElement;

// {base64 ? (
//   <div className="flex gap-2 items-center">
//     {isFile ? (
//       <a
//         className="border border-keppel rounded-[3px] disabled:cursor-not-allowed disabled:bg-[#6cd8d3] bg-[#5BC4BF] text-white p-1 px-2 text-xs"
//         href={base64}
//         download={label}
//       >
//         Download File
//       </a>
//     ) : (
//       <img
//         src={base64}
//         style={{
//           width: "100px",
//           height: "auto",
//         }}
//       />
//     )}
//     {!disabled && (
//       <button
//         className="border border-keppel rounded-[3px] text-[#5BC4BF] p-1 px-2 text-xs"
//         onClick={handleResetFile}
//       >
//         Change
//       </button>
//     )}
//   </div>
// ) : viewMode ? (
//   <>
//     <input type={type} accept={accept} disabled={disabled} {...rest} />
//   </>
// ) : (
//   <div className="rounded flex items-center gap-2 w-100 p-2 py-2.5 hover:bg-teal-400 cursor-pointer">
//     <img src={IconSrc} alt="Icon" className="h-[14.06px] w-[14.06px]" />
//     <span className="text-xs font-medium">{`No ${
//       isFile ? "File" : "Image"
//     } Choosen`}</span>
//   </div>
// )}
