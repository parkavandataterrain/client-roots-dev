import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./PopupCardStyles.css";
import { useParams } from "react-router-dom";
import { notifyError } from "../../helper/toastNotication";
import { protectedApi } from "../../services/api";

const urlMappings = {
  Housing: {
    url: "house",
    tag: "housing",
  },
  "Food Access": {
    url: "food",
    tag: "food_access",
  },
  "Financial Security": {
    url: "financial_security",
    tag: "financial_security",
  },
  "Education/Employment": {
    url: "education_employment",
    tag: "education_employment",
  },
  "Communication/Mobility": {
    url: "communication_mobility",
    tag: "communication_and_mobility",
  },
  "Preventive Care": {
    url: "healthcare_preventiative",
    tag: "healthcare_preventiative",
  },
  "Health Care - General Health": {
    url: "healthcare_general_health",
    tag: "healthcare_general_health",
  },
  "Health Care - Cardiovascular": {
    url: "healthcare_cardiovascular_risk",
    tag: "healthcare_cardiovascular_risk",
  },
};

function PopupCard({ popupInfo, handleClose }) {
  const { clientId } = useParams();
  const accordionStyles = useMemo(
    () => ({
      border: "1px solid #5bc4bf",
      boxShadow: "none",
      "&:not(:last-child)": {
        borderBottom: 0,
      },
      "&:before": {
        display: "none",
      },
      "&.Mui-expanded": {
        margin: "auto",
      },
      ".MuiAccordionSummary-root": {
        "&.Mui-expanded": {
          borderBottom: "1px solid #5bc4bf",
        },
      },
      ".MuiAccordionDetails-root": {
        padding: "20px 1.5rem",
      },
    }),
    []
  );
  const [accordionData, setAccordionData] = useState({});
  const [mapping, setMapping] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await protectedApi.get(`/api/clientsvsquestions/`);
        setMapping(response.data);
      } catch (err) {
        notifyError("Error fetching questions");
        console.error(err);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await protectedApi.get(
          `/client/${clientId}/risk/${urlMappings[popupInfo?.type]?.url}/${
            popupInfo?.timestamp
          }/`
        );
        setAccordionData(response.data);
      } catch (err) {
        notifyError("Error fetching client profile");
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const data = useMemo(() => {
    const result = {};

    mapping
      .filter((m) => m.svs_name === urlMappings[popupInfo?.type]?.tag)
      .forEach((m) => {
        const key = m.svs_column_name;
        if (m.svs_questions) {
          result[m.svs_questions] = accordionData[key];
        }
      });

    return result;
  }, [accordionData, mapping]);

  return (
    <Dialog
      open={popupInfo?.type}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
      fullWidth
    >
      <DialogContent>
        <div className="border border-keppel rounded-md">
          <div className="bg-[#89D6DE] text-lg font-medium bg-opacity-50 px-3 py-3 flex justify-between items-center">
            <div>{popupInfo?.type}</div>
            <img
              src="/cancel.svg"
              onClick={handleClose}
              className="w-6 hover:cursor-pointer"
              alt=""
            />
          </div>

          <div className="svs-popup-accordion mx-3 my-6 grid gap-y-6">
            {Object.entries(data).map(([key, value]) => (
              <div>
                <Accordion sx={accordionStyles}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{key}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{value || ""}</Typography>
                  </AccordionDetails>
                </Accordion>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center my-4">
            <button
              onClick={handleClose}
              className="text-[18px] font-medium bg-[#5BC4BF] border border-[#5BC4BF] rounded-sm text-white px-5 py-2"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PopupCard;
