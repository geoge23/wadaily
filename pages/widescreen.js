/* eslint-disable @next/next/no-img-element */

import Head from 'next/head';

import BottomLogo from "../components/BottomLogo";
import Hero from "../components/Hero";
import List from "../components/List";
import NoSchool from "../components/NoSchool";
import Schedule from "../components/Schedule";
import getCalendarList from "../functions/calendar";
import getScheduleDay from "../functions/day";
import getMenuList from "../functions/menuList";
import getScheduleList from "../functions/schedule";
import getWeather from '../functions/weather';


export default function Home({schedule, friendlyName, calendarList, menuList, date, ...props}) {

  return (
    <div>
      <Head>
        <title>WADaily</title>
        <meta name="description" content="View your schedule, menu, and announcements for Woodward Academy quicky and efficiently!"></meta>
      </Head>


      <Hero 
        day={friendlyName} 
        isDifferentDay={date != props.date} 
        widescreen={true}
        showWeather={true}
        temp={props.temp}
        icon={props.icon}
        sticky={true}
      />

      {friendlyName != "No School Day" ?
      <>
      
        <div className={"grid box-border py-5 px-24 md:grid-cols-2 grid-cols-1 center"}>
          <Schedule 
            items={schedule}
            widescreen ={true} 
          />
          <div className={"md:mt-0 mt-4"}>
            
            <span id="lunch"></span>
            <List content={menuList} title="Lunch Menu" truncate={7}>
            </List>
          </div>
        </div>
        <div className={"my-4 mx-16 mb-8 box-border px-8"}>
          <span id="schedule"></span>
          
          
          <List 
            title="Scheduled for Today" 
            itemsCollapsible={true} 
            content={calendarList}
          />
        </div>
      </> : <NoSchool />}
      <BottomLogo></BottomLogo>
    </div>
  )
}

export async function getServerSideProps() {
  
  const Now = new Date();
  const date = `${Now.getMonth() + 1}-${Now.getDate()}-${Now.getFullYear() % 100}`
  const day = await getScheduleDay(date);
  const scheduleList = await getScheduleList(day);
  const menuList = await getMenuList();
  const calendarList = await getCalendarList();
  const weather = await getWeather();
  
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
