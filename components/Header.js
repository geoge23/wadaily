import { useContext, useState } from 'react'
import { PreferencesContext } from './PreferencesContext'
import SettingsModal from './SettingsModal'
import { BsFillGearFill } from 'react-icons/bs'

/* eslint-disable @next/next/no-img-element */
function Link({func = () => {}, text}) {
    return (<a className={"self-center mr-3 text-lg font-normal cursor-pointer"} onClick={func}>{text}</a>)
}

export default function Header() {
    const [settingsVisible, setSettingsVisible] = useState(false)
    const ctx = useContext(PreferencesContext)

    return (
        <header className={"my-5 flex justify-between"}>
            <img src={"logo.png"} alt="Logo" className={`h-16 ${ctx.preferences.theming ? "" : ""}`} />
            <div className={"flex items-center"}>
                <Link func={() => {document.getElementById('header').scrollIntoView()}} text={"Today"}></Link>
                <Link func={() => {document.getElementById('lunch').scrollIntoView()}} text={"Food"}></Link>
                <Link func={() => {document.getElementById('schedule').scrollIntoView()}} text={"Events"}></Link>
                <BsFillGearFill className={"self-center text-lg cursor-pointer"} onClick={() => setSettingsVisible(true)} />
            </div>
            <SettingsModal visible={settingsVisible} setVisible={setSettingsVisible} />
        </header>
    )
}
