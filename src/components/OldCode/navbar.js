import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar';
import CollapseButton1 from '.../image/collapse-button-1.png';
import CollapseButton2 from '.../image/collapse-button.png';
import RootsLogo from '.../image/root.png';
import MessagePNG from '.../image/message.png';
import NotificationPNG from '.../image/notification.png';
import ProfilePNG from '../images/avatar-man.png';
import apiURL from '../../apiConfig';

const Navbar = ({ onLogout, isMinimized, toggleSidebar }) => {
  const navigate = useNavigate(); // Initialize navigate function
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileType, setProfileType] = useState(null);

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
        console.log(data)
        setProfileType(data.user_type);

      } catch (error) {
        console.error('Error fetching profile type:', error);
      }
    };

    fetchProfileType();
  }, []);


  const handleDropdownToggle = (e) => {
    e.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };

  const logout = () => {
    localStorage.removeItem('access_token'); // Remove access token
    localStorage.removeItem('refresh_token');
    localStorage.setItem('isLoggedIn', false); // Set isLoggedIn to false
    onLogout(); // Call the onLogout function passed as a prop (if needed)
    navigate('/'); // Redirect to the login page
  };

  return (
    <nav className="bg-white h-32 w-screen shadow flex items-center justify-between px-4">
      <div className="flex items-center">
        <div className={`flex flex-row w-[250px] place-items-center ${isMinimized ? '' : 'justify-between'} pr-3`}>
          <img src={RootsLogo} className="w-24 h-20 ml-4" alt="Roots Logo" />
          {/* <button onClick={toggleSidebar}>
            {isMinimized && (<img src={CollapseButton1} className="h-5 w-5" alt="Collapse button" />)}
            {!isMinimized && (<img src={CollapseButton2} className="h-5 w-5 mr-4" alt="Collapse button" />)}
          </button> */}
        </div>
      </div>
      <div className="flex items-center">

        <div className="flex items-center justify-between border-b py-4">
          {profileType === 'admin' && (
            <div className="flex items-center">
              {/* <p className="text-gray-700">User Profile Type: {profileType}</p> */}
            </div>
          )}
          {profileType === 'admin12' && (
            <div>
              <button className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <a href={`${apiURL}/admin/`}>Admin</a>
              </button>
            </div>
          )}
        </div>


        <div className='flex space-x-16'>
          <SearchBar />

          <img src={MessagePNG} className="h-8 w-8" alt="messages" />
          <img src={NotificationPNG} className="h-8 w-8" alt="notifications" />


          <div className="dropdown pr-2">
            <a href="#" role="button" id="navbarDropdown" onClick={handleDropdownToggle}>
              <img src={ProfilePNG} alt="Profile" className="h-8 w-8 rounded-full border-1 border-green-800" />
            </a>
            <div className={`dropdown-menu${dropdownOpen ? ' show' : ''} absolute origin-top-right right-0`} aria-labelledby="navbarDropdown">
              <a className="dropdown-item" href="/UserProfile"><i className="fas fa-sliders-h fa-fw"></i> Account</a>
              <a className="dropdown-item" href="#"><i className="fas fa-cog fa-fw"></i> Settings</a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="#" onClick={logout}><i className="fas fa-sign-out-alt fa-fw"></i> Log Out</a>
            </div>
          </div>


        </div>
      </div>
    </nav>
  );
}

export default Navbar;
