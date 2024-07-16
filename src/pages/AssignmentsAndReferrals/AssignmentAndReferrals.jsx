import React, { useCallback, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/system";
import BasicTable from "../../components/react-table/BasicTable";
import { format } from "date-fns";
import { Link, useParams, useLocation } from "react-router-dom";
import { notifyError } from "../../helper/toastNotication";
import { protectedApi } from "../../services/api";
import EyeIcon from "../../components/images/eye.svg";
import EditIcon from "../../components/images/edit.svg";

const CustomTab = styled(Tab)(({ theme }) => ({
  "&.Mui-selected": {
    color: "#5BC4BF",
  },
  color: "#1A1F25",
  textTransform: "none",
}));

const CustomTabList = styled(TabList)(({ theme }) => ({
  ".MuiTabs-indicator": {
    backgroundColor: "#5BC4BF",
  },
}));

const pageIndexMapping = {
  referrals: "1",
  programs: "2",
  navigations: "3",
};

function AssignmentAndReferrals() {
  const { clientId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get("tab");
  const [value, setValue] = React.useState(pageIndexMapping[tabParam] || "1");
  const [referrals, setReferrals] = React.useState([]);
  const [programs, setPrograms] = React.useState([]);
  const [navigations, setNavigations] = React.useState([]);

  const fetchReferrals = useCallback(async () => {
    try {
      const response = await protectedApi.get(`/referrals/table/${clientId}`);
      setReferrals(response.data);
    } catch (err) {
      console.error("Error fetching referrals:", err);
      notifyError("Error fetching referrals");
    }
  }, []);
  const fetchPrograms = useCallback(async () => {
    try {
      const response = await protectedApi.get("/programs/");
      setPrograms(response.data);
    } catch (err) {
      console.error("Error fetching referrals:", err);
      notifyError("Error fetching referrals");
    }
  }, []);
  const fetchNavigations = useCallback(async () => {
    try {
      const response = await protectedApi.get("/assignments/");
      setNavigations(response.data);
    } catch (err) {
      console.error("Error fetching referrals:", err);
      notifyError("Error fetching referrals");
    }
  }, []);

  useEffect(() => {
    if (value === "1") {
      fetchReferrals();
    } else if (value === "2") {
      fetchPrograms();
    } else if (value === "3") {
      fetchNavigations();
    }
  }, [value]);

  const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  const title = useMemo(() => {
    if (value === "1") {
      return "Referrals";
    } else if (value === "2") {
      return "Programs";
    } else if (value === "3") {
      return "Navigation";
    }
  }, [value]);

  const buttonLink = useMemo(() => {
    if (value === "1") {
      return `/referral/add/${clientId}`;
    } else if (value === "2") {
      return `/program/add/${clientId}`;
    } else if (value === "3") {
      return `/navigation/add/${clientId}`;
    }
  }, [value]);

  const buttonTitle = useMemo(() => {
    if (value === "1") {
      return "New Referral";
    } else if (value === "2") {
      return "New Program";
    } else if (value === "3") {
      return "New Navigator";
    }
  }, [value]);

  const columns = useMemo(() => {
    if (value === "1") {
      return [
        {
          Header: "Referral to",
          accessor: "program",
          align: "left",
        },
        {
          Header: "Date Referred",
          accessor: "submitted_date",
          align: "center",
          headerAlign: "center",
          Cell: ({ value }) => {
            return value ? format(new Date(value), "MM-dd-yyyy") : "";
          },
        },
        {
          Header: "Referred by",
          accessor: "referred_by",
          align: "left",
        },
        // {
        //   Header: "View referral",
        //   accessor: "view_referral",
        //   align: "left",
        //   Cell: (value) => {
        //     return <a className="underline">Link View Referral</a>;
        //   },
        // },
        {
          Header: "Referral Comments",
          accessor: "referral_comments",
          align: "left",
        },
        {
          Header: "Status",
          accessor: "status",
          align: "center",
        },
        {
          Header: "Progress Comments",
          accessor: "progress_comments",
          align: "left",
        },
        {
          Header: "Date Closed",
          accessor: "date_closed",
          align: "center",
        },
        {
          Header: "Closed by",
          accessor: "closed_by",
          align: "left",
        },
        {
          Header: "Actions",
          accessor: "id",
          Cell: ({ value }) => (
            <div className="flex gap-x-3 items-center mx-auto justify-center">
              <Link
                to={`/referral/edit/${clientId}/?referralId=${value}&mode=edit`}
              >
                <img src={EditIcon} className="size-4" alt="edit" />
              </Link>
              <Link
                to={`/referral/edit/${clientId}/?referralId=${value}&mode=view`}
              >
                <img src={EyeIcon} className="size-4" alt="view" />
              </Link>
            </div>
          ),
        },
      ];
    } else if (value === "2") {
      return [
        {
          Header: "Program Name",
          accessor: "name",
          align: "left",
        },
        {
          Header: "Date Assigned",
          accessor: "date_assigned",
          align: "center",
          headerAlign: "center",
          Cell: ({ value }) => {
            return value ? format(new Date(value), "MM-dd-yyyy") : "";
          },
        },
        {
          Header: "Assigned by",
          accessor: "assigned_by",
          align: "left",
        },
        {
          Header: "Status",
          accessor: "status",
          align: "center",
        },
        {
          Header: "Notes",
          accessor: "notes",
          align: "left",
        },
        {
          Header: "Unassign Program",
          accessor: "unassign_program",
          Cell: ({ value }) => {
            return value ? "True" : "False";
          },
        },
        {
          Header: "Closed Reason",
          accessor: "closed_reason",
          align: "left",
        },
        {
          Header: "Date Closed",
          accessor: "date_closed",
          align: "center",
        },
        {
          Header: "Closed by",
          accessor: "closed_by",
          align: "left",
        },
        {
          Header: "Actions",
          accessor: "id",
          Cell: ({ value }) => (
            <div className="flex gap-x-3 items-center mx-auto justify-center">
              <Link
                to={`/program/add/${clientId}/?programId=${value}&mode=edit`}
              >
                <img src={EditIcon} className="size-4" alt="edit" />
              </Link>
              <Link
                to={`/program/add/${clientId}/?programId=${value}&mode=view`}
              >
                <img src={EyeIcon} className="size-4" alt="view" />
              </Link>
            </div>
          ),
        },
      ];
    } else if (value === "3") {
      return [
        {
          Header: "Navigator",
          accessor: "navigator_name",
          align: "left",
        },
        {
          Header: "Program",
          accessor: "program_name",
          align: "left",
        },
        {
          Header: "Date Assigned",
          accessor: "date_assigned",
          align: "center",
          headerAlign: "center",
          Cell: ({ value }) => {
            return value ? format(new Date(value), "MM-dd-yyyy") : "";
          },
        },
        {
          Header: "Assigned by",
          accessor: "assigned_by",
          align: "left",
        },
        {
          Header: "Status",
          accessor: "status",
          align: "center",
        },
        {
          Header: "Notes",
          accessor: "notes",
          align: "left",
        },
        {
          Header: "Unassign Navigator",
          accessor: "unassign_navigator",
          Cell: ({ value }) => {
            return value ? "True" : "False";
          },
        },
        {
          Header: "Closed Reason",
          accessor: "closed_reason",
          align: "left",
        },
        {
          Header: "Date Closed",
          accessor: "date_closed",
          align: "center",
        },
        {
          Header: "Closed by",
          accessor: "closed_by",
          align: "left",
        },
        {
          Header: "Actions",
          accessor: "id",
          Cell: ({ value }) => (
            <div className="flex gap-x-3 items-center mx-auto justify-center">
              <Link
                to={`/navigation/add/${clientId}/?navigationId=${value}&mode=edit`}
              >
                <img src={EditIcon} className="size-4" alt="edit" />
              </Link>
              <Link
                to={`/navigation/add/${clientId}/?navigationId=${value}&mode=view`}
              >
                <img src={EyeIcon} className="size-4" alt="view" />
              </Link>
            </div>
          ),
        },
      ];
    } else {
      return [];
    }
  }, [value]);

  const data = useMemo(() => {
    if (value === "1") {
      return referrals;
    } else if (value === "2") {
      return programs;
    } else if (value === "3") {
      return navigations;
    }
  }, [value, referrals, programs, navigations]);

  return (
    <div className="mx-6 grid gap-y-6">
      <div className="text-[#1A1F25] text-2xl">Assignment & Referrals</div>

      <TabContext value={value}>
        <Box
          className="bg-white border border-[#DBE0E5] rounded-[6px]"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            padding: "0px 15px",
          }}
        >
          <CustomTabList
            onChange={handleChange}
            aria-label="lab API tabs example"
          >
            <CustomTab label="Referrals" value="1" disableRipple />
            <CustomTab label="Programs" value="2" disableRipple />
            <CustomTab label="Navigation" value="3" disableRipple />
          </CustomTabList>
        </Box>
      </TabContext>

      <div className="bg-white border border-[#DBE0E5] rounded-[6px]">
        <div className="flex justify-between items-center my-4 px-4">
          <span className="font-medium text-xl">{title}</span>
          <Link to={buttonLink}>
            <button className="bg-[#5BC4BF] px-3 py-2 flex justify-center items-center gap-x-2 text-white text-base">
              <AddIcon />
              <span>{buttonTitle}</span>
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1">
          <div>
            <BasicTable type="referralsPage" columns={columns} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentAndReferrals;
