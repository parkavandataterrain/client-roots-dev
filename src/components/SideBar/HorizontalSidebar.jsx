import React, { useState, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleSidebar,
  selectIsSidebarExpanded,
} from "../../store/slices/utilsSlice";

import MenuDropDownArrow from "../images/side_bar/menu-down-arrow.svg";

import DashboardActive from "../images/side_bar/dashboard-active.png";
import DashboardInActive from "../images/side_bar/dashboard-inactive.png";

import CalendarActive from "../images/side_bar/calendar-active.png";
import CalendarInActive from "../images/side_bar/calendar-inactive.png";

import FormBuilderActive from "../images/side_bar/formbuilder-active.png";
import FormBuilderInActive from "../images/side_bar/formbuilder-inactive.png";

import NewClientActive from "../images/side_bar/newclient-active.png";
import NewClientInActive from "../images/side_bar/newclient-inactive.png";

import DirectoryActive from "../images/side_bar/directory-active.png";
import DirectoryInActive from "../images/side_bar/directory-inactive.png";

import YetAnotherLinkActive from "../images/side_bar/yetanotherlink-active.png";
import YetAnotherLinkInActive from "../images/side_bar/yetanotherlink-inactive.png";

const sidebarLinks = [
  {
    id: "dashboard-page",
    to: "/",
    title: "Dashboard",
    activeImageSrc: DashboardActive,
    inactiveImageSrc: DashboardInActive,
    isActive: false,
  },
  {
    id: "calendar-page",
    to: "/calendar",
    title: "Calendar",
    activeImageSrc: CalendarActive,
    inactiveImageSrc: CalendarInActive,
    isActive: false,
  },
  {
    id: "form-builder-page",
    to: "/form_builder",
    title: "Form Builder",
    activeImageSrc: FormBuilderActive,
    inactiveImageSrc: FormBuilderInActive,
    isActive: false,
  },
  {
    id: "directory-page",
    to: "#",
    title: "Directory",
    activeImageSrc: DirectoryActive,
    inactiveImageSrc: DirectoryInActive,
    isActive: false,
    children: [
      {
        id: "staff-directory",
        to: "/staff-directory",
        title: "Staff Directory",
      },
      {
        id: "program-directory",
        to: "/program-directory",
        title: "Program  Directory",
      },
      {
        id: "client-directory",
        to: "/client-directory",
        title: "Client  Directory",
      },
      {
        id: "encounter-directory",
        to: "/encounter-directory",
        title: "Encounter Directory",
      },
      {
        id: "match-id-directory",
        to: "/match-id-directory",
        title: "Match ID Directory",
      },
      {
        id: "facility",
        to: "/facility",
        title: "Facility",
      },
      {
        id: "department",
        to: "/department",
        title: "Department",
      },
      {
        id: "listview",
        to: "/table-list-view",
        title: "List View",
      },

      // {
      //   id: "derived-fields",
      //   to: "/derived-fields",
      //   title: "Derived Fields",
      // },

    ],
  },
  {
    id: "client-profile-new",
    to: "/clientprofilenew",
    title: "Add New Client",
    activeImageSrc: NewClientActive,
    inactiveImageSrc: NewClientInActive,
    isActive: false,
  },
  // {
  //   title: 'Log out',
  //   to: '/#',
  //   activeImageSrc: YetAnotherLinkActive,
  //   inactiveImageSrc: YetAnotherLinkInActive,
  //   isActive: false,
  // },
];

const HorizontalSidebar = () => {
  console.log("SideBar re-rendered");
  const location = useLocation();
  const [showNested, setShowNested] = useState([]);
  const isSidebarExpanded = useSelector(selectIsSidebarExpanded);
  const dispatch = useDispatch();

  return (
    <nav className="sticky top-0 left-0 right-0">
      <div className="flex justify-center items-center space-x-11 py-3">
        {sidebarLinks.map((link, index) => {
          const isActive = location.pathname === link.to;
          const bgColor = isActive ? "#D4EDEC" : "#EAECEB";

          return (
            <div key={index} className="relative group">
              <Link to={link.to} className="flex items-center gap-2">
                {/* <img
                  className={`p-1 bg-[${bgColor}] w-6 h-6`}
                  src={isActive ? link.activeImageSrc : link.inactiveImageSrc}
                  alt={`icon${index + 1}`}
                  title={link.title}
                /> */}
                <span className="text-xs truncate">{link.title}</span>
                {link.title === "Directory" && (
                  <img
                    src={MenuDropDownArrow}
                    className="w-2 h-2"
                    alt="dropdown"
                  />
                )}
              </Link>
              {link.title === "Directory" && (
                <div className="absolute hidden group-hover:block top-full left-1/2 transform -translate-x-1/2 bg-white shadow-md mt-1 py-2 rounded">
                  <div className="absolute top-0 left-0 w-full h-3 bg-transparent -translate-y-full"></div>
                  {link.children.map((child, childIndex) => (
                    <Link
                      key={childIndex}
                      to={child.to}
                      className="block px-4 py-2 text-xs hover:bg-gray-100 whitespace-nowrap"
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default HorizontalSidebar;
