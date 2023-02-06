import { useContext, useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import CloseButton from "./CloseButton";
import Modal from "./Modal";
import { PreferencesContext } from "./PreferencesContext";

export default function NotificationModal() {
    const [visible, setVisible] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [viewing, setViewing] = useState(0)

    const ctx = useContext(PreferencesContext);

    useEffect(() => {
        fetch('/api/notification')
            .then(e => e.json())
            .then(x => {
                const seen = JSON.parse(window.localStorage.getItem('seen-announcements')) || []
                const e = x.filter(z => {
                    return !seen.includes(z._id) || z.sticky
                })
                if (e.length !== 0) {
                    setNotifications(x)
                    setVisible(true)
                }
            })

    }, [])

    useEffect(() => {
        const announcements = JSON.parse(window.localStorage.getItem('seen-announcements')) || []
        if (notifications[viewing]) {
            if (!announcements.includes(notifications[viewing]._id)) announcements.push(notifications[viewing]._id)
            window.localStorage.setItem('seen-announcements', JSON.stringify(announcements))
        }
    })

    const navigate = (n) => () => {
        console.log(viewing, n)
        if (viewing + n >= 0 && viewing + n <= notifications.length - 1) setViewing(viewing + n);
    }

    if (!ctx.preferences.announcements) return <></>

    return (visible && <Modal style={{minWidth: '30%'}}>
            <CloseButton onClick={() => setVisible(false)}></CloseButton>
            <p className="text-xl mr-5">{notifications[viewing].title}</p>
            <p dangerouslySetInnerHTML={{__html: notifications[viewing].text}}></p>
            {notifications[viewing].link && <a href={notifications[viewing].link} className="underline mt-2">Click here</a>}
            <div className={"flex items-center self-center mt-2"}>
                <IoIosArrowBack className={`mr-2 ${viewing === 0 ? "text-gray-300" : "cursor-pointer"}`} onClick={navigate(-1)} />
                <p>{viewing + 1} of {notifications.length}</p>
                <IoIosArrowForward className={`ml-2 ${viewing === (notifications.length - 1) ? "text-gray-300" : "cursor-pointer"}`} onClick={navigate(1)} />
            </div>
        </Modal>)
}