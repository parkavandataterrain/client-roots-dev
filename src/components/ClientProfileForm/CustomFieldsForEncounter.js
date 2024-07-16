import { useEffect, useMemo, useState } from "react";

import DnDCustomFields from "../DnDCustomFields";

import TextBox from "../common/TextBox";
import OpenAccordianPNG from "../images/open-accordion.png";
import ClosedAccordianPNG from "../images/closed-accordion.png";
import axios from "../../helper/axiosInstance";
import { notifySuccess } from "../../helper/toastNotication";

const CustomFieldsForEncounter = ({
  id,
  onChange,
  dndItems,
  viewMode,
  mode,
  refresh,
  setMode,
  encounterViewItems,
  tableColumns
}) => {
  
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    
    if (dndItems.length > 0) {
      if (!isOpen) {
        setIsOpen(true);
      }
    }
  }, [dndItems]);

  let customFieldsTags = useMemo(() => {
    return dndItems.map((field) => {
      
      let cf = {
        datatype: "text",
        question: field.column_fullname,
        answer: "",
      };

      if (field.type === "imageupload" || field.type === "fileupload") {
        cf.answer = field.props.base64;
      } else {
        cf.answer = field.column_fullname;
      }

      if (mode === "edit") {
        if (field.id) {
          cf.id = field.id;
        }
      }

      return cf;
    });
  }, [dndItems]);

  const handleCreatePayload = () => {
    const formDataPayload = new FormData();
    formDataPayload.append("tags", JSON.stringify(customFieldsTags || []));
    return formDataPayload;
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const formDataPayload = await handleCreatePayload();
      const response = await axios.put(
        "/client/update_custom_field/",
        formDataPayload
      );
      if (response.status === 200) {
        notifySuccess("Custom fields updated successfully");
        refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const convertToSample = (input) => {
    return input.map(item => {
      console.log(item);
      return {
        "type": item?.type,
        "props": {
          "label": item?.column_fullname,
          "value": "",
          "width": item.width,
          "type": item?.type,
          "disabled": true
        },
        "answer": "",
        "datatype": item?.type,
        "question": item?.column_fullname
      };
    });
  };

  const convertData = (array) => {
    return array.map(item => {
      switch (item.type) {
        case "character":
          return {
            ...item,
            type: "header",
            datatype: "character"
          };
        case "line":
          return {
            ...item,
            type: "divider",
            datatype: "line"
          };
        case "character varying":
          return {
            ...item,
            type: "text",
            datatype: "character varying"
          };
        case "timestamp without time zone":
          return {
            ...item,
            type: "datetime",
            datatype: "timestamp without time zone",
            props: {
              ...item.props,
              width: "1/3"
            }
          };
        case "json":
          return {
            ...item,
            type: "subheader",
            datatype: "json"
          };
        case "bytea":
          return {
            ...item,
            type: "fileupload",
            datatype: "bytea"
          };
        default:
          return item;
      }
    });
  };

  if (encounterViewItems) {
    // If encounterViewItems is true, handle as object with custom fields
    dndItems = dndItems.map(item => ({
      type: item.datatype,
      props: {
        label: item.question,
        value: item.answer,
        width: "w-full",
        type: item.datatype,
        disabled: true
      },
      answer: item.answer,
      datatype: item.datatype,
      question: item.question
    }));
  } else {
    // If encounterViewItems is false, handle as usual
    dndItems = convertToSample(dndItems);
    dndItems = convertData(dndItems);
  }

  console.log("convertedDndItems", dndItems);

  return (
    <div className="border border-gray-300 bg-gray-50 rounded-md" id={`accordian-${id}`}>
      {isOpen && (
        <>
          <div className="p-4 border-t border-gray-300">
            <div className="flex flex-col justify-between space-y-6">
              <DnDCustomFields
                onChange={onChange}
                dndItems={dndItems}
                viewMode={viewMode}
              />
            </div>
            <div className="flex justify-end items-center">
              <button
                onClick={handleSave}
                className="bg-teal-400 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-2 hidden"
                disabled={isLoading}
              >
                {isLoading ? "Loading" : "Save Custom Fields"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomFieldsForEncounter;
