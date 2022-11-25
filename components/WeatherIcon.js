import { IconContext } from "react-icons";
import { BsCircleFill, BsCloudFill, BsCloudRainFill, BsCloudSnowFill, BsLightningFill, BsQuestion } from 'react-icons/bs';
import { RiMistFill, RiTornadoFill } from 'react-icons/ri';

export default function WeatherIcon({icon}) {
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
