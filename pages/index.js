/* eslint-disable @next/next/no-img-element */

import Header from "../components/Header";
import Hero from "../components/Hero";
import List from "../components/List";
import Footer from '../components/Footer'
import Schedule from "../components/Schedule";
import WeatherBar from "../components/WeatherBar";
import getScheduleDay from "../functions/day";
import getScheduleList from "../functions/schedule";
import getMenuList from "../functions/menuList";
import { useContext, useEffect, useState } from "react";
import Head from 'next/head';
import getCalendarList from "../functions/calendar";
import Cache from "node-cache";
import { useRouter } from "next/dist/client/router";
import Loader from "../components/Loader";
import NoSchool from "../components/NoSchool";
import NotificationModal from "../components/NotificationModal";
import RadioSelector from "../components/RadioSelector";
import {PreferencesContext} from "../components/PreferencesContext";

const weatherCache = new Cache();

export default function Home(props) {
  const [schedule, setSchedule] = useState(props.schedule);
  const [friendlyName, setFriendlyName] = useState(props.friendlyName);
  const [calendarList, setCalendarList] = useState(props.calendarList);
  const [menuList, setMenuList] = useState(props.menuList);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(props.date);
  const [selectedCafeteria, setSelectedCafeteria] = useState("Cafeteria");
  const router = useRouter()

  const ctx = useContext(PreferencesContext);

  useEffect(() => {
    window.addEventListener('focus', () => {
      const Now = new Date();
      const currentDate = `${Now.getMonth() + 1}-${Now.getDate()}-${Now.getFullYear() % 100}`
      if (props.date != currentDate) {
        router.reload()
      }
    })
  }, [props.date, router])

  useEffect(() => {
    if (ctx.preferences.westCommons) {
      setSelectedCafeteria("West Commons")
    }
  }, [ctx.preferences.westCommons])

  function parseWaDate(dateText) {
    const dateArray = dateText.split('-').map(e => parseInt(e));
    return new Date(dateArray[2] + 2000, dateArray[0] - 1, dateArray[1]);
  }

  function progressByDays(num) {
    setLoading(true);
    const time = parseWaDate(date)
    time.setDate(time.getDate() + num)
    updateUI(time)
  }

  function handleChangeCafeteria(e) {
    setSelectedCafeteria(e)
    const time = parseWaDate(date)
    const now = `${time.getMonth() + 1}-${time.getDate()}-${time.getFullYear() % 100}`
    switch (e) {
      case "Cafeteria":
        setLoading(true)
        fetch(`/api/lunchList?date=${now}`)
          .then(e => e.json())
          .then(e => setMenuList(e))
          .then(() => setLoading(false))
        break;
      case "West Commons":
        setLoading(true)
        fetch(`/api/westCommonsList?date=${now}`)
          .then(e => e.json())
          .then(e => setMenuList(e))
          .then(() => setLoading(false))
        break;
    }
  }

  async function updateUI(time) {
    const now = `${time.getMonth() + 1}-${time.getDate()}-${time.getFullYear() % 100}`
    const {schedule: newSchedule, friendlyName: newFriendlyName, name} = await (await fetch(`/api/schedule?date=${now}`)).json();
    if (name != "NONE") {
      const lunchList = await (await fetch(`/api/lunchList?date=${now}`)).json();
      const calendar = await (await fetch(`/api/calendar?date=${now}`)).json();
      setMenuList(lunchList);
      setCalendarList(calendar);
    }
    setSelectedCafeteria("Cafeteria")
    setSchedule(newSchedule);
    setFriendlyName(newFriendlyName);
    setDate(now);
    setLoading(false);
  }

  return (
    <div>
      {loading && <Loader />}
      <Head>
        <title>WADaily</title>
        <meta name="description" content="View your schedule, menu, and announcements for Woodward Academy quicky and efficiently!"></meta>
      </Head>

      <Header />
      <span id="header"></span>

      <Hero 
        day={friendlyName} 
        isDifferentDay={date != props.date} 
      />

      <WeatherBar 
        temp={props.temp} 
        icon={props.icon} 
        date={date} 
        forward={() => progressByDays(1)} 
        back={() => progressByDays(-1)} 
      />

      <NotificationModal />

      {date == props.date ? null : <p className="text-center mb-4 mt-0">You are viewing info for {date} • <a className="cursor-pointer underline" onClick={() => {
        setLoading(true);
        updateUI(new Date())
      }}>See Today</a></p>}

      {friendlyName != "No School Day" ?
      <>
        <div className={"grid box-border px-8 md:grid-cols-2 grid-cols-1"}>
          <Schedule 
            items={schedule}
            isDifferentDay={date != props.date} 
          />
          <div className={"md:mt-0 mt-4"}>
            <span id="lunch"></span>
            <List content={menuList} title="Lunch">
              <RadioSelector 
                options={["Cafeteria", "West Commons"]} 
                className="mt-1"
                state={selectedCafeteria} 
                setState={handleChangeCafeteria} 
              />
            </List>
          </div>
        </div>
        <div className={"my-4 mb-8 box-border px-8"}>
          <span id="schedule"></span>
          <List 
            title="Scheduled for Today" 
            itemsCollapsible={true} 
            content={calendarList}
          />
        </div>
      </> : <NoSchool />}

      <Footer />
    </div>
  )
}

export async function getServerSideProps(ctx) {
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
