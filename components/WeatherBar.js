import { IconContext } from "react-icons";
import { BsCircleFill, BsQuestion, BsCloudRainFill, BsCloudFill, BsCloudSnowFill, BsLightningFill } from 'react-icons/bs';
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

function WeatherIconSelector({icon}) {
    function IconSwitch(icon) {
        switch (icon) {
            case 'Clear':
            case 'Sunny':
                return (<IconContext.Provider value={{ color: "#E8E84A", size: '20px' }}>
                    <BsCircleFill />
                </IconContext.Provider>);
            case 'Mist':
                return (<RiMistFill />);
            case 'Rainy':
            case 'Rain':
                return (<BsCloudRainFill />);
            case 'Thunderstorm':
                return (<IconContext.Provider value={{ color: "#E8E84A", size: '20px' }}>
                <BsLightningFill />
            </IconContext.Provider>);
            case 'Cloudy':
                return (<BsCloudFill />);
            case 'Snowy':
                return (<BsCloudSnowFill />);
            default:
                return (<BsQuestion />);
        }
    }
    return (<IconContext.Provider value={{ color: "grey", size: '20px' }}>
        {IconSwitch(icon)}
    </IconContext.Provider>)
}
