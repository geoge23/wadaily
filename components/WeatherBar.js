import { IconContext } from "react-icons";
import { BsCircleFill, BsQuestion, BsCloudRainFill, BsCloudFill, BsCloudSnowFill, BsLightningFill, BsCloudSleetFill } from 'react-icons/bs';
import { RiMistFill } from 'react-icons/ri'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

export default function WeatherBar({icon, temp, name, date: currentDate, forward, back}) {
    const date = new Date();
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const dateString = `${months[date.getMonth()]} ${date.getDate()}`

    return (<div className={"flex md:flex-row flex-col my-3 mx-4 items-center justify-between"}>
        <div className={"flex"}>
            <WeatherIconSelector icon={icon}></WeatherIconSelector>
            <p className={"ml-2 text-gray-600 font-medium"}>{temp}°F • {dateString}</p>
        </div>
        <div className={"flex items-center"}>
            <IoIosArrowBack className={"mr-2 cursor-pointer"} onClick={back}/>
            <p className={"text-gray-700"}>{name} - {currentDate}</p>
            <IoIosArrowForward className={"ml-2 cursor-pointer"} onClick={forward} />
        </div>
    </div>)
}

/*
Possibilities
weather_code_map = { 
            "clearsky": 113, X
            "cloudy": 119, X
            "fair": 116, X
            "fog": 143, X
            "heavyrain": 302, X
            "heavyrainandthunder": 389, X
            "heavyrainshowers": 305, X
            "heavyrainshowersandthunder": 386, X
            "heavysleet": 314,  # There's a ton of 'LightSleet' in WWO_CODE... X
            "heavysleetandthunder": 377, X
            "heavysleetshowers": 362, X
            "heavysleetshowersandthunder": 374, X
            "heavysnow": 230, X
            "heavysnowandthunder": 392, X
            "heavysnowshowers": 371, X
            "heavysnowshowersandthunder": 392, X
            "lightrain": 266, X
            "lightrainandthunder": 200,
            "lightrainshowers": 176, X
            "lightrainshowersandthunder": 386, X
            "lightsleet": 281, X
            "lightsleetandthunder": 377, X
            "lightsleetshowers": 284, X
            "lightsnow": 320, X
            "lightsnowandthunder": 392, X
            "lightsnowshowers": 368, X
            "lightssleetshowersandthunder": 365, X
            "lightssnowshowersandthunder": 392, X
            "partlycloudy": 116, X
            "rain": 293, X
            "rainandthunder": 389, X
            "rainshowers": 299, X
            "rainshowersandthunder": 386, X
            "sleet": 185, X
            "sleetandthunder": 392, X
            "sleetshowers": 263, X
            "sleetshowersandthunder": 392, X
            "snow": 329, X
            "snowandthunder": 392, X
            "snowshowers": 230,
            "snowshowersandthunder": 392, X
    }
*/

function WeatherIconSelector({icon}) {
    function IconSwitch(icon) {
        switch (icon) {
            //sun
            case 113:
            case 116:
                return (<IconContext.Provider value={{ color: "#E8E84A", size: '20px' }}>
                    <BsCircleFill />
                </IconContext.Provider>);
            //mist
            case 'Mist':
                return (<RiMistFill />);
            //rain
            case 302:
            case 305:
            case 266:
            case 176:
            case 293:
            case 299:
                return (<BsCloudRainFill />);
            //thunderstorm
            case 389:
            case 386:
                return (<IconContext.Provider value={{ color: "#E8E84A", size: '20px' }}>
                <BsLightningFill />
            </IconContext.Provider>);
            //cloud
            case 119:
            case 116:
            case 143:
                return (<BsCloudFill />);
            //snow
            case 230:
            case 392:
            case 329:
            case 320:
                return (<BsCloudSnowFill />);
            //sleet
            case 314:
            case 377:
            case 362:
            case 374:
            case 371:
            case 281:
            case 284:
            case 368:
            case 365:
            case 263:
            case 185:
                return (<BsCloudSleetFill />);
            //unknown
            default:
                return (<BsQuestion />);
        }
    }
    return (<IconContext.Provider value={{ color: "grey", size: '20px' }}>
        {IconSwitch(icon)}
    </IconContext.Provider>)
}
