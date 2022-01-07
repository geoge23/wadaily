import Header from "../components/Header";
import Hero from "../components/Hero";
import List from "../components/List";
import Footer from '../components/Footer'
import Schedule from "../components/Schedule";
import WeatherBar from "../components/WeatherBar";
import getScheduleDay from "../functions/day";
import getScheduleList from "../functions/schedule";
import getMenuList from "../functions/menuList";
import { useState } from "react";
import Head from 'next/head';
import getCalendarList from "../functions/calendar";
import Cache from "node-cache";

const weatherCache = new Cache();

export default function Home(props) {
  const [schedule, setSchedule] = useState(props.schedule);
  const [friendlyName, setFriendlyName] = useState(props.friendlyName);
  const [calendarList, setCalendarList] = useState(props.calendarList);
  const [menuList, setMenuList] = useState(props.menuList);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(props.date);

  function goForward() {
    setLoading(true);
    const dateArray = date.split('-').map(e => parseInt(e));
    const time = new Date();
    time.setMonth(dateArray[0] - 1)
    time.setDate(dateArray[1] + 1);
    time.setFullYear(dateArray[2] + 2000)
    updateUI(time)
  }

  function goBack() {
    setLoading(true);
    const dateArray = date.split('-').map(e => parseInt(e));
    const time = new Date();
    time.setMonth(dateArray[0] - 1)
    time.setDate(dateArray[1] - 1);
    time.setFullYear(dateArray[2] + 2000)
    updateUI(time)
  }

  async function updateUI(time) {
    const now = `${time.getMonth() + 1}-${time.getDate()}-${time.getFullYear() % 100}`
    const {schedule: newSchedule, friendlyName: newFriendlyName} = await (await fetch(`/api/schedule?date=${now}`)).json();
    const lunchList = await (await fetch(`/api/lunchList?date=${now}`)).json();
    const calendar = await (await fetch(`/api/calendar?date=${now}`)).json();
    setSchedule(newSchedule);
    setFriendlyName(newFriendlyName);
    setMenuList(lunchList);
    setCalendarList(calendar);
    setDate(now);
    setLoading(false);
  }

  return (
    <>
      {loading ? <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center bg-gray-500 bg-opacity-40">
          <div style={{borderTopColor: "transparent"}}
              className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin"></div>
      </div> : null}
      <Head>
        <title>WADaily</title>
      </Head>
      <Header />
      <span id="header"></span>
      <Hero day={friendlyName} isDifferentDay={date != props.date} />
      <WeatherBar temp={props.temp} icon={props.icon} name={friendlyName} date={date} forward={goForward} back={goBack} />
      {date == props.date ? null : <p className="text-center mb-4 mt-0">You are viewing info for {date} • <a className="cursor-pointer underline" onClick={() => {
        setLoading(true);
        updateUI(new Date())
      }}>See Today</a></p>}
      <div className={"grid box-border px-8 md:grid-cols-2 grid-cols-1"}>
        <Schedule items={schedule} />
        <div className={"md:mt-0 mt-4"}><span id="lunch"></span><List content={menuList} title="Lunch" /></div>
      </div>
      <div className={"my-4 mb-8 box-border px-8"}>
        <span id="schedule"></span>
        <List title="Scheduled for Today" content={calendarList}/>
      </div>
      <Footer />
    </>
  )
}

export async function getServerSideProps() {
  let weather = weatherCache.get('weather');
  if (weather == undefined) {
    let fetchedWeather = await fetch(`http://api.openweathermap.org/data/2.5/weather?zip=30337&appid=${process.env.WEATHER_KEY}&units=imperial`)
    weather = await fetchedWeather.json();
    weatherCache.set('weather', weather, 60);
  }
  const {main: wTemp, weather: conditions} = weather;
  const Now = new Date();
  const date = `${Now.getMonth() + 1}-${Now.getDate()}-${Now.getFullYear() % 100}`
  const day = await getScheduleDay(date);
  const scheduleList = await getScheduleList(day);
  const menuList = await getMenuList();
  const calendarList = await getCalendarList();
  
  return {
    props: {
      temp: Math.round(wTemp.temp),
      icon: conditions[0].id,
      ...scheduleList,
      menuList,
      date,
      calendarList
    }
  }
}
