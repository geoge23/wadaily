import Cache from 'node-cache';

const weatherCache = new Cache();

export default async function getWeather() {
    let weather = weatherCache.get('weather');
    if (weather == undefined) {
        let fetchedWeather = await fetch(`http://api.openweathermap.org/data/2.5/weather?zip=30337&appid=${process.env.WEATHER_KEY}&units=imperial`)
        weather = await fetchedWeather.json();
        weatherCache.set('weather', weather, 60);
    }
    return {
        temp: Math.round(weather.main.temp),
        icon: weather.weather[0].id
    }
}