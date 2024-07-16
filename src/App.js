import React, { useState, useEffect } from 'react';
import Footer from './components/footer';
import Home from './components/home';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Navbar from './components/NavBar/NavBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard'; // Import Dashboard component
// import ClientProfile from "./components/clientprofile"; // Import ClientProfile component
import LoginForm from './components/Login/Logins';
import SignupPage from './components/Signup';
import UserProfile from './components/UserProfile';
import ClientChart from './pages/ClientChart/ClientChart';
import MedicationTable from './components/medicationTable';
import DiagnosisTable from './components/diagnosisTable';
import EncounterNote from './components/encounternote';
import ClientProfileFull from './components/clientprofilefull';
import SideBar from './components/SideBar/SideBar';
import CalendarMain from './components/calendar/CalendarMain';
import PasswordReset from './components/Login/PasswordReset';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/slices/authSlice';
import './App.css';
import './tailwind.css';

import ClientProfileInputForm from './components/DemoPages/ClientProfielInputForm';

import Admin from './pages/AdminDashboard/AdminDashboard';
import Authorization from './components/Authorization';
import CareForm from './components/CareForm';
import EncounterForm from './components/EncounterForm';
import CreateForm from './components/CreateForm';
// import Dashboard from './components/Dashboard';

import CreateTableComponent from './components/dynamicform/createtable';
import CreateTableForm from './components/dynamicform/createtableform';
import AlterTable from './components/dynamicform/altertable';
import NewPage from './components/dynamicform/nepage';
import BulkUploadComponent from './components/dynamicform/BulkUploadComponent';
import ClientProfileNew from './components/clientprofilenew/clientprofile';
import { useWindowSize } from './components/Utils/windowResize';
import SocialVitalSignsMain from './components/SocialVitalSigns/SocialVitalSignsMain';

import Preview from './components/dynamicform/preview';
import YourComponent from './components/dynamicform/create';
import AddNewSocialVitalSigns from './components/SocialVitalSigns/AddNewSocialVitalSigns';
import FormView from './components/dynamicform/FormView';
import CarePlanView from './components/CarePlanView/CarePlan';

import FormBuilder from './components/dynamicform/FormBuilder';
import ProgramDirectory from './components/ProgramDirectory';
import StaffDirectory from './components/StaffDirectory';
import StaffRecord from './components/StaffDirectory/StaffRecord';
import ProgramRecord from './components/ProgramDirectory/ProgramRecord';
import { selectIsSidebarExpanded } from './store/slices/utilsSlice';
import EncounterNoteForm from './pages/EncounterNote/EncounterNoteForm';
import TheNewCarePlan from './pages/NewCarePlan/NewCarePlan';
import AddNewProgram from './components/ProgramDirectory/AddNewProgram';
import AddNewStaff from './components/StaffDirectory/AddNewStaff';

import ClientReferral from './components/ClientReferral';

// New Client Profile - Create/View/Edit
import ClientProfile from './components/ClientProfileForm';

import BulkUpload from './components/BulkUpload/BulkUpload';

import AddDocument from './pages/AddDocument/AddDocument';

import Master from './pages/Master';
import CreateGroup from './pages/Master/CreateGroup';
import { fetchPermissionList } from './store/slices/userInfoSlice';
import AssignmentAndReferrals from './pages/AssignmentsAndReferrals/AssignmentAndReferrals';
import ReferralForm from './pages/ReferralForm/ReferralForm';
import ProgramForm from './pages/ProgramForm/ProgramForm';
import NavigationForm from './pages/NavigationForm/NavigationForm';
import ReferralEdit from './pages/ReferralEdit/ReferralEdit';

import ClientDirectory from './components/ClientDirectory';
import EncounterDirectory from './components/EncounterDirectory';
import MatchIDDirectory from './components/MatchIDDirectory';

import TableListView from './components/TableListView';
import DataView from './components/TableListView/DataView';

import ScrollToTop from './components/ScrollToTop';
import Facility from './components/Facility';
import Department from './components/Department';
import Svs from './pages/svs/Svs';
import ModifyMatchID from './components/MatchIDDirectory/ModifyMatchID';

function App() {
  // Retrieve isLoggedIn state from localStorage on initial render
  // const [isLoggedIn, setIsLoggedIn] = useState(
  //   localStorage.getItem("isLoggedIn") === "true"
  // );

  // const handleLogin = () => {
  //   setIsLoggedIn(true);
  // };

  const { width } = useWindowSize();

  // window.addEventListener('beforeunload', () => {
  //   // Dispatch the logout action
  //   const StaySignedIn = localStorage.getItem("StaySignedIn");
  //   if (!StaySignedIn) {
  //     dispatch(logout());
  //   }
  // });

  const isLoggedIn = useSelector((state) => {
    return state.auth.isLoggedIn;
  });
  const dispatch = useDispatch();

  // useEffect(() => {
  //   localStorage.setItem("isLoggedIn", isLoggedIn);
  // }, [isLoggedIn]);

  const [isMinimized, setIsMinimized] = useState(true);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  const PERMISSIONS = {
    CAN_VIEW_ADMIN: 'admin',
    CAN_CREATE_FORM: 'create_form',
    CAN_VIEW_CARE_FORM: 'view_care_form',
    CAN_VIEW_ENCOUNTER_FORM: 'view_encounter_form',
  };

  const [user, setUser] = useState({
    username: 'admin',
    permissions: localStorage.getItem('permissions')
      ? localStorage.getItem('permissions').split(',')
      : ['admin'],
    // permissions: ["admin"],
  });

  useEffect(() => {
    dispatch(fetchPermissionList());
  }, [dispatch]);

  const isSidebarExpanded = useSelector(selectIsSidebarExpanded);

  return (
    <Router>
      <ScrollToTop />
      <div className="App w-full">
        {isLoggedIn ? (
          <>
            <Navbar
              // onLogout={() => setIsLoggedIn(false)}
              width={width}
              // onLogout={() => dispatch(logout())}
              isMinimized={isMinimized}
              toggleSidebar={toggleSidebar}
            />
            {/* <div className='flex min-h-screen'> */}
            {/* <Sidebar isMinimized={isMinimized} toggleSidebar={toggleSidebar} /> */}
            {/* <div className='flex-1'> */}
            <div className="flex justify-center w-100">
              {/*
               <>
              {width > 640 && (
                <div id="sideBarX" style={{ zIndex: 40 }} className="">
                  <SideBar />
                </div>
              )}
              </>
              */}

              <div
                id="app-container"
                data-expand={isSidebarExpanded ? 'true' : 'false'}
                className="mx-4 py-8 sm:py-10 space-y-7"
              >
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  {/* <Route path="/clientprofile" element={<Dashboard />} /> */}
                  <Route path="/clientprofile/" element={<ClientProfile />} />

                  <Route
                    path="/clientprofile/:clientId"
                    element={<ClientProfile />}
                  />
                  <Route path="/home" element={<Home />} />
                  <Route path="/clientchart" element={<ClientChart />} />
                  <Route
                    path="/clientchart/:clientId"
                    element={<ClientChart />}
                  />
                  <Route
                    path="/medication-details/:clientId"
                    element={<MedicationTable />}
                  />
                  <Route
                    path="/diagnosis_details/:clientId"
                    element={<DiagnosisTable />}
                  />
                  {/* <Route
                    path="/UserProfile"
                    element={
                      <UserProfile onLogout={() => setIsLoggedIn(false)} />
                    }
                  /> */}
                  <Route path="/calendar" element={<CalendarMain />} />
                  <Route path="/encounter_note" element={<EncounterNote />} />
                  <Route
                    path="/clientprofilefull"
                    element={<ClientProfileFull />}
                  />
                  <Route
                    path="/clientprofilefull/:clientId"
                    element={<ClientProfileFull />}
                  />
                  <Route
                    path="/clientprofilefull"
                    element={<ClientProfileFull />}
                  />
                  <Route
                    path="/clientprofilefull/:clientId"
                    element={<ClientProfileFull />}
                  />

                  <Route
                    path="/clientprofileform"
                    element={<ClientProfileInputForm />}
                  />
                  <Route path="/bulk-upload" element={<BulkUpload />} />

                  {/*  routes Completed */}
                  {/*  routes Completed */}
                  {/*  routes Completed */}

                  <Route
                    path="/create_form"
                    element={<CreateTableComponent />}
                  />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin-dashboard" element={<Admin />} />
                  {/* <Route element={<Authorization user={user} permissions={[PERMISSIONS.CAN_VIEW_ADMIN]} />}>
                    <Route path="/admin-dashboard" element={<Admin user={user} setUser={setUser} />} />
                  </Route>;

                  <Route element={<Authorization user={user} permissions={[PERMISSIONS.CAN_CREATE_FORM]} />}>
                    <Route path="/create-form" element={<CreateForm />} />
                  </Route>;

                  <Route element={<Authorization user={user} permissions={[PERMISSIONS.CAN_VIEW_CARE_FORM]} />}>
                    <Route path="/care-form" element={<CareForm />} />
                  </Route>;

                  <Route element={<Authorization user={user} permissions={[PERMISSIONS.CAN_VIEW_ENCOUNTER_FORM]} />}>
                    <Route path="/encounter-form" element={<EncounterForm />} />
                  </Route>; */}
                  <Route
                    path="/create_table"
                    element={<CreateTableComponent />}
                  />
                  <Route
                    path="/createtableform"
                    element={<CreateTableForm />}
                  />
                  <Route
                    path="/createtableform/:tableName"
                    element={<NewPage />}
                  />
                  <Route
                    path="/createtableform_new/:tableName"
                    element={<FormView />}
                  />
                  <Route path="/alterTable" element={<AlterTable />} />
                  <Route
                    path="/BulkUploadComponent/:tableName"
                    element={<BulkUploadComponent />}
                  />
                  <Route
                    path="/clientprofilenew"
                    element={<ClientProfile isNew />}
                  />
                  <Route
                    path="/encounter-template-new"
                    element={<EncounterNoteForm isTemplate={true} />}
                  />
                  <Route
                    path="/socialvitalsigns/:clientId"
                    element={<SocialVitalSignsMain />}
                  />
                  <Route
                    path="/addNewSocialVitalSigns/:clientId"
                    element={<AddNewSocialVitalSigns />}
                  />
                  <Route path="/form_builder" element={<FormBuilder />} />
                  <Route path="/form_builder_old" element={<YourComponent />} />
                  <Route path="/Preview" element={<Preview />} />
                  <Route
                    path="/care-plan/:clientId"
                    element={<CarePlanView />}
                  />
                  {/* Program Directory  */}
                  <Route
                    path="/program-directory"
                    element={<ProgramDirectory />}
                  />
                  <Route
                    path="/program-directory/:recordid"
                    element={<ProgramRecord />}
                  />
                  <Route
                    path="/add-new-program-directory/"
                    element={<AddNewProgram />}
                  />
                  <Route
                    path="/update-program-directory/:paramid"
                    element={<AddNewProgram />}
                  />
                  <Route path="/staff-directory" element={<StaffDirectory />} />
                  <Route
                    path="/staff-directory/:recordid"
                    element={<StaffRecord />}
                  />
                  <Route path="/table-list-view" element={<TableListView />} />
                  <Route path="/dataview/:dataviewid" element={<DataView />} />
                  <Route
                    path="/add-new-staff-directory/"
                    element={<AddNewStaff />}
                  />
                  <Route
                    path="/update-staff-directory/:paramid"
                    element={<AddNewStaff />}
                  />
                  {/* Encounter notes */}
                  <Route
                    path="/encounter-note/add/:clientId"
                    element={<EncounterNoteForm />}
                  />
                  <Route
                    path="/encounter-note/add/:clientId"
                    element={<EncounterNoteForm />}
                  />
                  <Route
                    path="/care-plan/add/:clientId"
                    element={<TheNewCarePlan />}
                  />
                  <Route path="/client-referral" element={<ClientReferral />} />
                  <Route path="/master" element={<Master />} />
                  <Route path="/create-new-group" element={<CreateGroup />} />
                  <Route
                    path="/update-permission-group/:paramid"
                    element={<CreateGroup />}
                  />
                  <Route
                    path="/document/add/:clientId"
                    element={<AddDocument />}
                  />
                  <Route path="/document/add" element={<AddDocument />} />
                  <Route
                    path="/client-directory"
                    element={<ClientDirectory />}
                  />
                  <Route
                    path="/encounter-directory"
                    element={<EncounterDirectory />}
                  />
                  <Route
                    path="/encounter-directory/add"
                    element={<EncounterNoteForm isTemplate />}
                  />

                  <Route
                    path="/assignments-and-referrals/:clientId"
                    element={<AssignmentAndReferrals />}
                  />
                  <Route
                    path="/referral/add/:clientId"
                    element={<ReferralForm />}
                  />
                  <Route
                    path="/program/add/:clientId"
                    element={<ProgramForm />}
                  />
                  <Route
                    path="/navigation/add/:clientId"
                    element={<NavigationForm />}
                  />
                  <Route
                    path="/referral/edit/:clientId"
                    element={<ReferralEdit />}
                  />
                  <Route path="/facility" element={<Facility />} />
                  <Route path="/department" element={<Department />} />
                  <Route path="/svs/:clientId" element={<Svs />} />

                  <Route
                    path="/match-id-directory"
                    element={<MatchIDDirectory />}
                  />
                  <Route
                    path="/update-match-id-directory/:paramid"
                    element={<ModifyMatchID />}
                  />
                </Routes>
              </div>
            </div>

            <Footer />
          </>
        ) : (
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/password/reset" element={<PasswordReset />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
