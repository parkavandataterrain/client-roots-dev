import React, { useMemo, Suspense } from "react";
import { useWindowSize } from "../../components/Utils/windowResize";

const GreetingCard = React.lazy(() => import("../../components/GreetingCard/GreetingCard"));
const TopStats = React.lazy(() => import("../../components/TopStatsCard/TopStatsCard"));
const SocialVital = React.lazy(() => import("../../components/SocialVital/SocialVital"));
const MyPanel = React.lazy(() => import("../../components/MyPanel/MyPanel"));
const CalendarCard = React.lazy(() => import("../../components/Calendar1/Calendar"));
const Appointments = React.lazy(() => import("../../components/Appointment/Appointment"));
const ClientGoal = React.lazy(() => import("../../components/ClientGoal/ClientGoal"));
const NotificationCard = React.lazy(() => import("../../components/NotificationCard/NotificationCard"));
const Activities = React.lazy(() => import("../../components/Activities/Activities"));
const PriorityListNew = React.lazy(() => import("../../components/PriorityListNew/PriorityListNew"));
const ReferralPrograms = React.lazy(() => import("../../components/ReferralPrograms/ReferralPrograms"));
const AppointmentCalendar = React.lazy(() => import("../../components/AppointmentCalendar/AppointmentCalendar"));
const Encounters = React.lazy(() => import("../../components/Encounters/Encounters"));

const Dashboard = ({ onLogout }) => {
  const { width } = useWindowSize();
  

  const isMidSizeScreen = useMemo(() => width > 600 && width < 1100, [width]);
  const isSmallOrLargeScreen = useMemo(() => width < 600 || width > 1100, [width]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {isMidSizeScreen && (
        <div className="mx-2.5 sm:mx-0 grid gap-y-7 !mr-3">
          <div className="grid sm:grid-cols-11 grid-cols-1 sm:gap-7 gap-y-3">
            <div className="sm:col-span-11 col-span-full">
              <GreetingCard />
            </div>
            <div className="sm:col-span-11 flex flex-wrap justify-between gap-4">
              <TopStats />
              <SocialVital />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:gap-7 gap-y-3">
            <MyPanel />
            <CalendarCard />
            <Appointments />
          </div>
          <div className="grid grid-cols-1 sm:gap-7 gap-y-3">
            <div className="col-span-8 grid grid-cols-1 gap-y-7">
              <ClientGoal />
              <PriorityListNew/>
              <ReferralPrograms />
              <AppointmentCalendar />
              <Encounters />
            </div>
            <div className="col-span-8 grid grid-cols-1 gap-y-7">
              <Activities />
              <NotificationCard />
            </div>
          </div>
        </div>
      )}
      {isSmallOrLargeScreen && (
        <div className="mx-2.5 sm:mx-0 grid gap-y-3">
          <div className="grid sm:grid-cols-11 grid-cols-1 sm:gap-4 gap-y-3">
            <GreetingCard />
            <TopStats />
            <SocialVital />
          </div>
          <div className="grid sm:grid-cols-11 grid-cols-1 sm:gap-4 gap-y-3">
            <MyPanel />
            <CalendarCard />
          </div>
          {width < 600 && <Appointments />}
          <div className="grid sm:grid-cols-11 grid-cols-1 sm:gap-4 gap-y-3">
            <div className="col-span-8 grid grid-cols-1 gap-y-4">
              <ClientGoal />
              <PriorityListNew/>
              <ReferralPrograms />
              <AppointmentCalendar />
              <Encounters />
            </div>
            <div className="col-span-3 grid grid-cols-1 gap-y-3">
              {width > 600 ? (
                <>
                  <NotificationCard />
                  <Appointments />
                  <Activities />
                </>
              ) : (
                <>
                  <Activities />
                  <NotificationCard />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Suspense>
  );
};

export default React.memo(Dashboard);
