import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Logo from '../images/logo-full-h.jpg';
import MenuIcon from '../images/menuIcon.svg';
import GroupIcon from '../images/groupIcon.svg';
import GroupIcon2 from '../images/groupIcon2.svg';
import SettingIcon from '../images/settingIcon.svg';
import ProfileIcon from '../images/profileIcon.svg';
import { useWindowSize } from '../Utils/windowResize';
import apiURL from '../../apiConfig';

import { useSelector, useDispatch } from 'react-redux';
import {
  toggleSidebar,
  selectIsSidebarExpanded,
} from '../../store/slices/utilsSlice';
import HorizontalSidebar from '../SideBar/HorizontalSidebar';
import { logout } from '../../store/slices/authSlice';

const Navbar = React.memo(({ onLogout, isMinimized }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileType, setProfileType] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const isSidebarExpanded = useSelector(selectIsSidebarExpanded);
  const dispatch = useDispatch();

  const handleToggleSidebar = useCallback(() => {
    let payload = isSidebarExpanded ? false : true;
    dispatch(toggleSidebar(payload));
  }, [isSidebarExpanded, dispatch]);

  const { width } = useWindowSize();

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  useEffect(() => {
    const fetchProfileType = async () => {
      try {
        const response = await fetch(`${apiURL}/profile-type/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile type');
        }
        const data = await response.json();
        setProfileType(data.user_type);
      } catch (error) {
        console.error('Error fetching profile type:', error);
      }
    };

    fetchProfileType();
  }, []);

  const handleDropdownToggle = useCallback((e) => {
    e.preventDefault();
    setDropdownOpen((prev) => !prev);
  }, []);

  // const logout = useCallback(() => {
  //   localStorage.removeItem('access_token');
  //   localStorage.removeItem('refresh_token');
  //   // onLogout();
  //   navigate('/');
  // }, [navigate]);

  const handleLogout = () => {
    dispatch(logout());
    // Optionally, you can also dispatch the logout thunk (if needed):
    // dispatch(logout());
  };

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (anchorEl && !anchorEl.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [anchorEl, handleClose]);

  return (
    <nav id="navBar" className="fixed max-w-full z-50">
      <div className="flex justify-between items-center shadow-xl bg-white px-8">
        <div className="flex justify-center items-center">
          <Link to="/">
            <img src={Logo} className="w-28 h-100 py-2" alt="logo" />
          </Link>
          {/* <button
            className="mx-4"
            style={{
              transform: isSidebarExpanded
                ? "rotateY(180deg)"
                : "rotateY(0deg)",
            }}
            onClick={handleToggleSidebar}
          >
            <img src={MenuIcon} className="size-4 sm:size-5" alt="menu" />
          </button> */}
          {width > 600 && (
            <div className="flex items-center mx-2 bg-[#F5F5F5] p-3 py-2 space-x-3">
              <img src={GroupIcon} className="size-5" alt="search" />
              <input
                type="text"
                placeholder="Search here"
                className="bg-[#F5F5F5] text-sm text-[#1F4B51] p-1 font-medium w-44"
              />
            </div>
          )}
        </div>

        {/* <div></div> */}

        <div className="flex justify-center items-center space-x-6 sm:space-x-12 mx-0.5">
          <HorizontalSidebar />
          <button className="p-1 bg-[#EAECEB]">
            <img src={GroupIcon2} className="size-4" alt="no-idea" />
          </button>
          <button className="p-1 bg-[#EAECEB]">
            <img src={SettingIcon} className="size-4" alt="settings" />
          </button>
          <button
            className="p-1 bg-[#EAECEB]"
            onClick={handleClick}
            id="profileButton"
          >
            <img src={ProfileIcon} className="size-4" alt="profile" />
          </button>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            className="mt-7"
          >
            <MenuItem
              onClick={() => navigate('/UserProfile')}
              id="user-profile-menu"
            >
              Profile
            </MenuItem>
            <MenuItem onClick={handleClose} id="my-account-menu">
              My account
            </MenuItem>
            <MenuItem onClick={handleLogout} id="logout-menu">
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
