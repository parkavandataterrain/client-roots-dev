import React from 'react';
import { useState } from 'react';
import './css/Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBuilding, faArrowUpAZ, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import clientProfile from './images/client_profile.png';
import clientChart from './images/client_chart.png';
import encounterNotes from './images/encounter_notes.png';
import ClientProfilePNG from '../image/client-profile.png';
import ClientChartPNG from '../image/client-chart.png';
import EncounterNotesPNG from '../image/encounter-notes.png';

const Sidebar = ({ isMinimized }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside>
      {isMinimized ? (
        <div className="flex h-full shadow-lg w-[125px] justify-between transition-all ease-in-out duration-2000">
          <div className={`bg-white w-64 `}>
            <div className="py-4 px-6">
              <ul className="mt-6 text-lg">
                <li className=" flex items-center content-around mt-10">
                  <a href="/clientprofile">
                    <img src={ClientProfilePNG} className="h-[30px] w-[30px]" alt="client-profile" />
                  </a>
                </li>
                <li className=" flex items-center mt-10">
                  <img src={ClientChartPNG} className="h-[30px] w-[30px]" alt="client-chart" />
                </li>
                <li className=" flex items-center mt-10">
                  <img src={EncounterNotesPNG} className="h-[30px] w-[30px]" alt="encounter-notes" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full shadow-lg w-[250px] transition-all ease-in-out duration-2000">
          <div className={`bg-white w-64 `}>
            <div className="py-4 px-6">
              <ul className="mt-6 text-lg">
                <a href="/clientprofile">
                  <li className=" flex items-center mt-10">
                    <img src={ClientProfilePNG} className="h-[25px] w-[25px] mr-4" alt="client-profile" />
                    <p className='text-green-800'>Client Profile</p>
                  </li>
                </a>
                <li className=" flex items-center mt-10">
                  <img src={ClientChartPNG} className="h-[25px] w-[25px] mr-4" alt="client-chart" />
                  Client Chart
                </li>
                <li className=" flex items-center mt-10">
                  <img src={EncounterNotesPNG} className="h-[25px] w-[25px] mr-4" alt="encounter-notes" />
                  Encounter Notes
                </li>
              </ul>
            </div>
          </div>
        </div>)}


      {/* <div className="flex-1">
          <button
            onClick={toggleSidebar}
            className="bg-gray-800 text-white py-2 px-4 fixed top-4 left-4 rounded"
          >
            {isOpen ? 'Hide' : 'Show'} Sidebar
          </button>
          <div className="ml-64 p-6">
            <h1>Main Content</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
          </div>
        </div> */}
    </aside>
  );
  // <div className="sidebar p-4" style={{  height: '100%', boxShadow: 'rgb(24 17 17 / 49%) 0px 2px 20px' }}>
  //   <div className="row">
  //     <div className="col-6 col-md-12 text-center my-4 ">
  //       <a href="/" className="text-decoration-none"><img src={clientProfile} class="img-thumbnail" alt="..." size="2x" /></a>
  //     </div>
  //     <div className="col-6 col-md-12 text-center my-4">
  //       <a href="/" className="text-decoration-none"><img src={clientChart} class="img-thumbnail" alt="..." size="2x" /></a>
  //     </div>
  //   </div>
  //   <div className="row">
  //     <div className="col-6 col-md-12 text-center my-4 ">
  //       <a href="/" className="text-decoration-none"><img src={encounterNotes} class="img-thumbnail" alt="..." size="2x" /></a>
  //     </div>
  //     <div className="col-6 col-md-12 text-center my-4">
  //       <a href="/" className="text-decoration-none"><img src={clientChart} class="img-thumbnail" alt="..." size="2x" /></a>
  //     </div>
  //   </div>
  // </div>
}

export default Sidebar;
