import Cache from 'node-cache';

const weatherCache = new Cache();

export default async function getWeather() {
    let weather = weatherCache.get('weather');
    if (weather == undefined) {
        try {
            let fetchedWeather = await fetch(`http://api.openweathermap.org/data/2.5/weather?zip=30337&appid=${process.env.WEATHER_KEY}&units=imperial`)
            weather = await fetchedWeather.json();
            weatherCache.set('weather', weather, 60);
        } catch (_) {
            return {temp: 'N/A', icon: 'N/A'}
        }
    }
    return {
        temp: Math.round(weather.main.temp),
        icon: weather.weather[0].id
    }
}