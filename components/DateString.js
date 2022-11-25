import { memo } from "react"


const nth = function (d) {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  
  const dateObj = new Date();
  const date = dateObj.getDate();
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][dateObj.getMonth()];
  
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let dayOfWeek = weekday[dateObj.getDay()];
  
  var dateString = dayOfWeek + ", " + month + " " + date + nth(date);


const DateString = (props) => {
    return(
            <p className={"text-white text-5xl py-9 md:text-5.5xl font-semibold"}>{dateString}</p>

    )
}
export default memo(DateString)