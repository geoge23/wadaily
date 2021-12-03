import { IconContext } from "react-icons";
import { BsCircleFill, BsQuestion, BsCloudRainFill, BsCloudFill, BsCloudSnowFill } from 'react-icons/bs';

export default function WeatherBar({icon, temp}) {
    const date = new Date();
    const months = ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];

    const dateString = `${months[date.getMonth()]} ${date.getDate()}`

    return (<div className={"flex my-3 mx-4 items-center"}>
        <WeatherIconSelector icon={icon}></WeatherIconSelector>
        <p className={"ml-2 text-gray-600 font-medium"}>{temp}°F • {dateString}</p>
    </div>)
}

function WeatherIconSelector({icon}) {
    function IconSwitch(icon) {
        switch (icon) {
            case 'Clear':
                return (<IconContext.Provider value={{ color: "#E8E84A", size: '20px' }}>
                    <BsCircleFill />
                </IconContext.Provider>);
            case 'Rainy':
                return (<BsCloudRainFill />);
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
