import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginForm from './components/Login/Logins';
import SignupPage from './components/Signup';
import PasswordReset from './components/Login/PasswordReset';
import Dashboard from './pages/Dashboard/Dashboard';
import { routes } from './constants/routes';
import ClientProfile from './components/ClientProfileForm';
import RootLayout from './components/common/RootLayout';
import Home from './components/home';
import ClientChart from './pages/ClientChart/ClientChart';
import BulkUpload from './components/BulkUpload/BulkUpload';
import MedicationTable from './components/medicationTable';
import ClientProfileFull from './components/clientprofilefull';
import DiagnosisTable from './components/diagnosisTable';
import CalendarMain from './components/calendar/CalendarMain';
import EncounterNote from './components/encounternote';
import ClientProfileInputForm from './components/DemoPages/ClientProfielInputForm';
import CreateTableComponent from './components/dynamicform/createtable';
import Admin from './components/Unauthorized';
import CreateTableForm from './components/dynamicform/createtableform';
import NewPage from './components/dynamicform/nepage';
import FormView from './components/dynamicform/FormView';
import AlterTable from './components/dynamicform/altertable';
import BulkUploadComponent from './components/dynamicform/BulkUploadComponent';
import EncounterNoteForm from './pages/EncounterNote/EncounterNoteForm';
import SocialVitalSignsMain from './components/SocialVitalSigns/SocialVitalSignsMain';
import YourComponent from './components/dynamicform/create';
import AddNewSocialVitalSigns from './components/SocialVitalSigns/AddNewSocialVitalSigns';
import FormBuilder from './components/dynamicform/FormBuilder';
import Preview from './components/dynamicform/preview';
import CarePlanView from './components/CarePlanView/CarePlan';
import ProgramDirectory from './components/ProgramDirectory';
import ProgramRecord from './components/ProgramDirectory/ProgramRecord';
import AddNewProgram from './components/ProgramDirectory/AddNewProgram';
import StaffDirectory from './components/StaffDirectory';
import TableListView from './components/TableListView';
import DataView from './components/TableListView/DataView';
import AddNewStaff from './components/StaffDirectory/AddNewStaff';
import TheNewCarePlan from './pages/NewCarePlan/NewCarePlan';
import ClientReferral from './components/ClientReferral';
import Master from './pages/Master';
import CreateGroup from './pages/Master/CreateGroup';
import AddDocument from './pages/AddDocument/AddDocument';
import ClientDirectory from './components/ClientDirectory';
import EncounterDirectory from './components/EncounterDirectory';
import AssignmentAndReferrals from './pages/AssignmentsAndReferrals/AssignmentAndReferrals';
import ReferralForm from './pages/ReferralForm/ReferralForm';
import ProgramForm from './pages/ProgramForm/ProgramForm';
import NavigationForm from './pages/NavigationForm/NavigationForm';
import ReferralEdit from './pages/ReferralEdit/ReferralEdit';
import Facility from './components/Facility';
import Department from './components/Department';
import Svs from './pages/svs/Svs';
import MatchIDDirectory from './components/MatchIDDirectory';
import ModifyMatchID from './components/MatchIDDirectory/ModifyMatchID';
import ProtectedRoutes from './components/common/Protectedroutes';

import React, { useEffect } from 'react';
import { fetchPermissionList } from './store/slices/userInfoSlice';
import { useDispatch } from 'react-redux';

const Routers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPermissionList());
  }, [dispatch]);

  const router = createBrowserRouter([
    { path: routes.index, element: <LoginForm /> },
    {
      path: routes.signUp,
      element: <SignupPage />,
    },
    { path: routes.passwordReset, element: <PasswordReset /> },
    {
      element: <ProtectedRoutes />,
      children: [
        {
          element: <RootLayout />,
          children: [
            {
              path: routes.dashboard,
              element: <Dashboard />,
            },
            { path: routes.clientprofile, element: <ClientProfile /> },
            { path: '/clientprofile/:clientId', element: <ClientProfile /> },
            { path: routes.home, element: <Home /> },
            { path: routes.clientChart, element: <ClientChart /> },
            { path: '/clientchart/:clientId', element: <ClientChart /> },
            {
              path: '/medication-details/:clientId',
              element: <MedicationTable />,
            },
            {
              path: '/diagnosis_details/:clientId',
              element: <DiagnosisTable />,
            },
            { path: routes.calendar, element: <CalendarMain /> },
            { path: routes.encounterNote, element: <EncounterNote /> },
            { path: routes.clientprofilefull, element: <ClientProfileFull /> },
            {
              path: '/clientprofilefull/:clientId',
              element: <ClientProfileFull />,
            },
            {
              path: routes.clientprofileform,
              element: <ClientProfileInputForm />,
            },
            { path: routes.bulkUpload, element: <BulkUpload /> },
            { path: routes.createForm, element: <CreateTableComponent /> },
            { path: routes.adminDashboard, element: <Admin /> },
            { path: routes.createTable, element: <CreateTableComponent /> },
            { path: routes.createTableForm, element: <CreateTableForm /> },
            { path: '/createtableform/:tableName', element: <NewPage /> },
            { path: '/createtableform_new/:tableName', element: <FormView /> },
            { path: routes.alterTable, element: <AlterTable /> },
            {
              path: '/BulkUploadComponent/:tableName',
              element: <BulkUploadComponent />,
            },
            {
              path: routes.clientNewProfile,
              element: <ClientProfile isNew />,
            },
            {
              path: routes.encounterTemplateNew,
              element: <EncounterNoteForm isTemplate={true} />,
            },
            {
              path: '/socialvitalsigns/:clientId',
              element: <SocialVitalSignsMain />,
            },
            {
              path: '/addNewSocialVitalSigns/:clientId',
              element: <AddNewSocialVitalSigns />,
            },
            { path: routes.formBuilder, element: <FormBuilder /> },
            { path: routes.form_builder_old, element: <YourComponent /> },
            { path: routes.preview, element: <Preview /> },
            { path: '/care-plan/:clientId', element: <CarePlanView /> },
            { path: routes.programDirectory, element: <ProgramDirectory /> },
            {
              path: '/program-directory/:recordid',
              element: <ProgramRecord />,
            },
            { path: routes.addNewProgramDirectory, element: <AddNewProgram /> },
            {
              path: '/update-program-directory/:paramid',
              element: <AddNewProgram />,
            },
            { path: routes.staffDirectory, element: <StaffDirectory /> },
            { path: routes.tableListView, element: <TableListView /> },
            { path: '/dataview/:dataviewid', element: <DataView /> },
            { path: routes.addNewStaffDirectory, element: <AddNewStaff /> },
            {
              path: '/update-staff-directory/:paramid',
              element: <AddNewStaff />,
            },
            {
              path: '/encounter-note/add/:clientId',
              element: <EncounterNoteForm />,
            },
            { path: '/care-plan/add/:clientId', element: <TheNewCarePlan /> },
            { path: routes.clientReferral, element: <ClientReferral /> },
            { path: routes.master, element: <Master /> },
            { path: routes.createNewGroup, element: <CreateGroup /> },
            {
              path: '/update-permission-group/:paramid',
              element: <CreateGroup />,
            },
            { path: '/document/add/:clientId', element: <AddDocument /> },
            { path: routes.documentAdd, element: <AddDocument /> },
            { path: routes.clientDirectory, element: <ClientDirectory /> },
            { path: '/encounter-directory', element: <EncounterDirectory /> },
            {
              path: routes.addEncounterDirectory,
              element: <EncounterNoteForm isTemplate />,
            },
            {
              path: '/assignments-and-referrals/:clientId',
              element: <AssignmentAndReferrals />,
            },
            { path: '/referral/add/:clientId', element: <ReferralForm /> },
            { path: '/program/add/:clientId', element: <ProgramForm /> },
            { path: '/navigation/add/:clientId', element: <NavigationForm /> },
            { path: '/referral/edit/:clientId', element: <ReferralEdit /> },
            { path: routes.facility, element: <Facility /> },
            { path: routes.department, element: <Department /> },
            { path: '/svs/:clientId', element: <Svs /> },
            { path: '/match-id-directory', element: <MatchIDDirectory /> },
            {
              path: '/update-match-id-directory/:paramid',
              element: <ModifyMatchID />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routers;
