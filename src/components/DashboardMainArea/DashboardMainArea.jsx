import GreetingCard from "../GreetingCard/GreetingCard";
import MyPanel from "../MyPanel/MyPanel";
import TopStats from "../TopStatsCard/TopStatsCard";
import ClientGoal from "../ClientGoal/ClientGoal";
import NotificationCard from "../NotificationCard/NotificationCard";
import PriorityList from "../PriorityList/PriorityList";
import ReferralPrograms from "../ReferralPrograms/ReferralPrograms";
import { useWindowSize } from "../Utils/windowResize";
import Panel from "../Panel/Panel";
import PriorityListMyPrograms from "../PriorityListMyPrograms/PriorityListMyPrograms";
import AppointmentCalendar from "../AppointmentCalendar/AppointmentCalendar";
import Encounters from "../Encounters/Encounters";

const DashboardMainArea = () => {
  const { width } = useWindowSize();
  return (
    <div className="space-y-8 flex flex-col justify-between">
      <div className="flex justify-between">
        <GreetingCard />
        <TopStats />
      </div>
      {width < 1280 && (
        <div>
          {" "}
          <Panel />
        </div>
      )}
      <div>
        <MyPanel />
      </div>
      <div className="flex justify-between  xl:flex-row min-[320px]:flex-col min-[320px]:gap-y-4">
        <ClientGoal />
      </div>
      <div className="flex justify-between  xl:flex-row min-[320px]:flex-col min-[320px]:gap-y-4">
        <PriorityList />
        <PriorityListMyPrograms />
      </div>
      <div>
        <ReferralPrograms />
      </div>
      <AppointmentCalendar />
      <Encounters />
    </div>
  );
};

export default DashboardMainArea;
