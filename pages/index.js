import Header from "../components/Header";
import Hero from "../components/Hero";
import List from "../components/List";
import Footer from '../components/Footer'
import Schedule from "../components/Schedule";
import WeatherBar from "../components/WeatherBar";
import getScheduleDay from "../functions/day";
import getScheduleList from "../functions/schedule";

export default function Home(props) {
  //simulates what will be an incoming prop from the ISR stuff
  const s = [
    {
        type: 'title',
        text: 'Entrees'
    },
    {
        type: 'entry',
        text: 'Southern Chicken Tenders',
    },
    {
        type: 'entry',
        text: 'Vegetarian/Vegan “Chicken” Tenders with Deez?? '
    },
    {
        type: 'title',
        text: 'Desserts'
    },
    {
        type: 'entry',
        text: 'Ur mom??',
    },
    {
        type: 'entry',
        text: 'awefaw eaerger Tenders'
    },
];

  return (
    <>
      <p>Reload checker - {props.update}</p>
      <Header />
      <span id="header"></span>
      <Hero day={props.friendlyName} />
      <WeatherBar temp={props.temp} icon={props.icon}/>
      <div className={"grid box-border px-8 md:grid-cols-2 grid-cols-1"}>
        <Schedule items={props.schedule} />
        <div className={"md:mt-0 mt-4"}><span id="lunch"></span><List content={s} title="Lunch" /></div>
      </div>
      <div className={"my-4 mb-8 box-border px-8"}>
        <span id="schedule"></span>
        <List title="Scheduled for Today"/>
      </div>
      <Footer />
    </>
  )
}

export async function getStaticProps() {
  const weather = await fetch('http://wttr.in/ATL?format=j1');
  const {current_condition: conditions} = await weather.json();
  const day = await getScheduleDay();
  const scheduleList = await getScheduleList(day);
  
  return {
    props: {
      temp: conditions[0].temp_F,
      icon: conditions[0].weatherDesc[0].value,
      update: Math.random(),
      ...scheduleList
    },
    revalidate: 60
  }
}
