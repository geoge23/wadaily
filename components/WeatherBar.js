import { IconContext } from "react-icons";
import { BsCircleFill, BsQuestion, BsCloudRainFill, BsCloudFill, BsCloudSnowFill, BsLightningFill, BsCloudSleetFill } from 'react-icons/bs';
import { RiMistFill, RiTornadoFill } from 'react-icons/ri'
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
        const iconClass = Math.floor(icon / 100);
        switch (iconClass) {
            case 2:
                return (<IconContext.Provider value={{ color: "#E8E84A", size: '20px' }}>
                            <BsLightningFill />
                        </IconContext.Provider>);
            case 3:
            case 5:
                return (<BsCloudRainFill />);
            case 6:
                return (<BsCloudSnowFill />);
            case 7:
                if (icon != 781) {
                    return (<RiMistFill />);
                } else {
                    return <RiTornadoFill />;
                }
            case 8:
                if (icon == 800) {
                    return (<IconContext.Provider value={{ color: "#E8E84A", size: '20px' }}>
                                <BsCircleFill />
                            </IconContext.Provider>);
                } else {
                    return (<BsCloudFill />);
                }
            default:
                return (<BsQuestion />);
        }
    }
    return (<IconContext.Provider value={{ color: "grey", size: '20px' }}>
        {IconSwitch(icon)}
    </IconContext.Provider>)
}
