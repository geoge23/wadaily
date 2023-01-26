/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/dist/client/router";
import Head from 'next/head';
import { useContext, useEffect, useState } from "react";
import Footer from '../components/Footer';
import Header from "../components/Header";
import Hero from "../components/Hero";
import List from "../components/List";
import Loader from "../components/Loader";
import LoginModal from "../components/LoginModal";
import NoSchool from "../components/NoSchool";
import NotificationModal from "../components/NotificationModal";
import { PreferencesContext } from "../components/PreferencesContext";
import RadioSelector from "../components/RadioSelector";
import Schedule from "../components/Schedule";
import WeatherBar from "../components/WeatherBar";
import getCalendarList from "../functions/calendar";
import getScheduleDay from "../functions/day";
import getMenuList from "../functions/menuList";
import getScheduleList from "../functions/schedule";
import getWeather from "../functions/weather";

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
      handleChangeCafeteria("West Commons")
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
    gtag('event','seek_days', {change: num})
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
    gtag('event','view_cafeteria', {to: e})
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
    <div className="main-page">
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
  const Now = new Date();
  const date = `${Now.getMonth() + 1}-${Now.getDate()}-${Now.getFullYear() % 100}`
  const day = await getScheduleDay(date);
  const scheduleList = await getScheduleList(day);
  const weather = await getWeather();
  const menuList = await getMenuList();
  const calendarList = await getCalendarList();
  
  return {
    props: {
      ...scheduleList,
      ...weather,
      menuList,
      date,
      calendarList
    }
  }
}
