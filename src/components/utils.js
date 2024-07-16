import dayjs from "dayjs";

export function getMonth(date = dayjs()) {
  const currDate = dayjs(date);
  const month = Math.floor(currDate.month());
  const year = currDate.year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let counter = 0;

  const daysMatrix = new Array(6).fill([]).map((row, rowIndex) => {
    return new Array(7).fill(null).map(() => {
      if (rowIndex === 0) {
        return daysOfWeek[counter++];
      } else {
        currentMonthCount++;
        return dayjs(new Date(year, month, currentMonthCount));
      }
    });
  });
  return daysMatrix;
}

export function getWeek(date = dayjs()) {
  let startOfWeek = date.startOf("week");
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let counter = 0;

  const daysMatrix = new Array(1).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      return startOfWeek.add(counter++, "day");
    });
  });
  daysMatrix.unshift(daysOfWeek);
  return daysMatrix;
}

export function getYearMonths(date = dayjs()) {
  let year = dayjs(date).year();
  const months = [];
  for (let month = 0; month < 12; month++) {
    months.push(dayjs(new Date(year, month, 1)));
  }
  return months;
}

export function getTodayTime() {
  const today = dayjs().startOf("day");
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    times.push(today.add(hour, "hour"));
  }
  return times;
}

export function getUpcomingEvents(eventList) {
  // Get the current date and time
  const currentDate = new Date();

  // Filter the eventList to keep only upcoming events
  const upcomingEvents = eventList.filter((event) => {
    // Get the start date and time of the event
    const eventStartDate = new Date(event.start.dateTime);

    // Compare the start date and time of the event with the current date and time
    return eventStartDate > currentDate;
  });

  // Sort the upcomingEvents array in ascending order based on the start date and time
  upcomingEvents.sort((a, b) => {
    const dateTimeA = new Date(a.start.dateTime).getTime();
    const dateTimeB = new Date(b.start.dateTime).getTime();
    return dateTimeA - dateTimeB;
  });

  // return the upcomingEvents array
  return upcomingEvents;
}


export function getTodayUpcomingEvents(eventList) {
  
  // Get the current date
  const currentDate = new Date();
  
  // Get the start and end of the current day
  const startOfDay = new Date(currentDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(currentDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Filter the eventList to keep only events happening today
  const todaysEvents = eventList.filter((event) => {
    // Get the start date and time of the event
    const eventStartDate = new Date(event.start.dateTime);

    // Check if the event is today
    return eventStartDate >= startOfDay && eventStartDate <= endOfDay;
  });

  // Sort the todaysEvents array in ascending order based on the start date and time
  todaysEvents.sort((a, b) => {
    const dateTimeA = new Date(a.start.dateTime).getTime();
    const dateTimeB = new Date(b.start.dateTime).getTime();
    return dateTimeA - dateTimeB;
  });

  // return the todaysEvents array (it will be empty if there are no events today)
  return todaysEvents;
}