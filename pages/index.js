/* eslint-disable @next/next/no-img-element */

import Header, { Link } from "../components/Header";
import Hero from "../components/Hero";
import List from "../components/List";
import Footer from '../components/Footer'
import Schedule from "../components/Schedule";
import WeatherBar from "../components/WeatherBar";
import getScheduleDay from "../functions/day";
import getScheduleList from "../functions/schedule";
import getMenuList from "../functions/menuList";
import { createContext, useEffect, useState } from "react";
import Head from 'next/head';
import getCalendarList from "../functions/calendar";
import Cache from "node-cache";
import { useRouter } from "next/dist/client/router";
import NewSiteModal from "../components/NewSiteModal";
import Loader from "../components/Loader";
import NoSchool from "../components/NoSchool";
import { validateAndDecodeJwt } from "../functions/jwt";
import { User } from "../functions/mongo";

const weatherCache = new Cache();
const UserContext = createContext()
export {UserContext};

export default function Home(props) {
  const [schedule, setSchedule] = useState(props.schedule);
  const [friendlyName, setFriendlyName] = useState(props.friendlyName);
  const [calendarList, setCalendarList] = useState(props.calendarList);
  const [loggedIn, setLoggedIn] = useState(Object.keys(props.user).length !== 0);
  const [user, setUser] = useState(props.user);
  const [menuList, setMenuList] = useState(props.menuList);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(props.date);
  const router = useRouter()

  useEffect(() => {
    window.addEventListener('focus', () => {
      const Now = new Date();
      const currentDate = `${Now.getMonth() + 1}-${Now.getDate()}-${Now.getFullYear() % 100}`
      if (props.date != currentDate) {
        router.reload()
      }
    })
  })

  function parseWaDate(dateText) {
    const dateArray = dateText.split('-').map(e => parseInt(e));
    return new Date(dateArray[2] + 2000, dateArray[0] - 1, dateArray[1]);
  }

  function goForward() {
    setLoading(true);
    const time = parseWaDate(date)
    time.setDate(time.getDate() + 1)
    updateUI(time)
  }

  function goBack() {
    setLoading(true);
    const time = parseWaDate(date)
    time.setDate(time.getDate() - 1)
    updateUI(time)
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
    setSchedule(newSchedule);
    setFriendlyName(newFriendlyName);
    setDate(now);
    setLoading(false);
  }

  return (
    <UserContext.Provider value={{
      loggedIn,
      setLoggedIn,
      user,
      setUser
    }}>
      {loading && <Loader />}
      <Head>
        <title>WADaily</title>
      </Head>

      <Header>
        <Link func={() => {document.getElementById('header').scrollIntoView()}} text={"Today"}></Link>
        <Link func={() => {document.getElementById('lunch').scrollIntoView()}} text={"Food"}></Link>
        <Link func={() => {document.getElementById('schedule').scrollIntoView()}} text={"Events"}></Link>
      </Header>
      <span id="header"></span>

      <Hero day={friendlyName} isDifferentDay={date != props.date} />
      <WeatherBar temp={props.temp} icon={props.icon} date={date} forward={goForward} back={goBack} />

      {props.showSiteModal && <NewSiteModal />}

      {date == props.date ? null : <p className="text-center mb-4 mt-0">You are viewing info for {date} • <a className="cursor-pointer underline" onClick={() => {
        setLoading(true);
        updateUI(new Date())
      }}>See Today</a></p>}

      {friendlyName != "No School Day" ?
      <>
        <div className={"grid box-border px-8 md:grid-cols-2 grid-cols-1"}>
          <Schedule items={schedule} />
          <div className={"md:mt-0 mt-4"}><span id="lunch"></span>
            <List content={menuList} title="Lunch">
              <a className="underline cursor-pointer" onClick={() => router.push('/lunch')}>Vote for today</a>
            </List>
          </div>
        </div>
        <div className={"my-4 mb-8 box-border px-8"}>
          <span id="schedule"></span>
          <List title="Scheduled for Today" content={calendarList}/>
        </div>
      </> : <NoSchool />}

      <Footer />
    </UserContext.Provider>
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

  let user = {}
  if (ctx.req.cookies.jwt) {
    try {
      const { id } = await validateAndDecodeJwt(ctx.req.cookies.jwt)
      const currentUser = (await User.findById(id))
      user = {
        email: currentUser.email,
        meta: currentUser.meta
      }
    } catch (e) {}
  }
  
  return {
    props: {
      temp: Math.round(wTemp.temp),
      icon: conditions[0].id,
      ...scheduleList,
      menuList,
      date,
      calendarList,
      user,
      showSiteModal: ctx.query.movedDomains != undefined
    }
  }
}
