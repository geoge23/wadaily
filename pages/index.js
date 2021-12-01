import Header from "../components/Header";
import Hero from "../components/Hero";
import WeatherBar from "../components/WeatherBar";

export default function Home(props) {
  return (
    <>
      <p>Reload checker - {props.update}</p>
      <Header />
      <Hero />
      <WeatherBar temp={props.temp} icon={props.icon}/>
    </>
  )
}

export async function getStaticProps() {
  const weather = await fetch('http://wttr.in/ATL?format=j1');
  const {current_condition: conditions} = await weather.json();
  return {
    props: {
      temp: conditions[0].temp_F,
      icon: conditions[0].weatherDesc[0].value,
      update: Math.random()
    },
    revalidate: 60
  }
}
