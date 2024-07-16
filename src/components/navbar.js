import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Logo2 from "./images/logo-full-h.jpg";
import MenuIcon from "./images/menuIcon.svg";
import GroupIcon from "./images/groupIcon.svg";
import GroupIcon2 from "./images/groupIcon2.svg";
import SettingIcon from "./images/settingIcon.svg";
import ProfileIcon from "./images/profileIcon.svg";
import apiURL from ".././apiConfig";
import { Link } from "react-router-dom";

const Navbar = ({ onLogout, isMinimized, toggleSidebar }) => {
  const navigate = useNavigate(); // Initialize navigate function
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileType, setProfileType] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchProfileType = async () => {
      try {
        const response = await fetch(`${apiURL}/profile-type/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile type");
        }
        const data = await response.json();
        console.log(data);
        setProfileType(data.user_type);
      } catch (error) {
        console.error("Error fetching profile type:", error);
      }
    };

    fetchProfileType();
  }, []);

  const handleDropdownToggle = (e) => {
    e.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };

  const logout = () => {
    localStorage.removeItem("access_token"); // Remove access token
    localStorage.removeItem("refresh_token");
    localStorage.setItem("isLoggedIn", false); // Set isLoggedIn to false
    onLogout(); // Call the onLogout function passed as a prop (if needed)
    navigate("/"); // Redirect to the login page
  };

  return (
    <nav id="navBar" className="px-4 shadow-lg bg-white z-20 relative w-full">
      <div className="flex justify-between">
        <div className="flex justify-center items-center">
          <Link to="/">
            <img src={Logo2} className="size-24 py-2" alt="logo" />
          </Link>
          <button className="mx-4">
            <img src={MenuIcon} className="size-5" alt="menu" />
          </button>
          <div className="flex items-center mx-2 bg-[#F5F5F5] p-3 py-2 space-x-3">
            <img src={GroupIcon} className="size-5" alt="search" />
            <input
              type="text"
              placeholder="Search here"
              className="bg-[#F5F5F5] text-sm text-[#1F4B51] p-1 font-medium w-44"
            />
          </div>
        </div>
        <div className="flex justify-center items-center space-x-12 mx-5">
          <button className="p-1 bg-[#EAECEB]">
            <img src={GroupIcon2} className="size-4" alt="no-idea" />
          </button>
          <button className="p-1 bg-[#EAECEB]">
            <img src={SettingIcon} className="size-4" alt="settings" />
          </button>
          <button className="p-1 bg-[#EAECEB]" onClick={handleClick}>
            <img src={ProfileIcon} className="size-4" alt="profile" />
          </button>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            className="mt-7"
          >
            <MenuItem onClick={() => navigate("/UserProfile")}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
