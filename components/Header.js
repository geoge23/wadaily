import { useContext, useState } from 'react'
import LoginModal from './LoginModal'
import { PreferencesContext } from './PreferencesContext'
import SettingsModal from './SettingsModal'
import { HeadsUp } from './HeadsUp'

/* eslint-disable @next/next/no-img-element */
function Link({func = () => {}, text}) {
    return (<a className={"self-center mr-3 text-lg font-normal cursor-pointer"} onClick={func}>{text}</a>)
}

function formatName(n) {
    //regex matches the .lastname@ of fn.ln@woodward.edu
    //sees if teacher essentially
    if (!n) return "?"
    if (/\..+@/.test(n)) {
        const names = n.split(".")
        return `${names[0].substring(0,1)}${names[1].substring(0,1)}`.toUpperCase()
    } else {
        return n.replace(/[0-9]{2}/, "").substring(0,2).toUpperCase()
    }
}

export default function Header() {
    const [settingsVisible, setSettingsVisible] = useState(false)
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const ctx = useContext(PreferencesContext)

    return (
        <header className={"my-5 flex justify-between"}>
            <img src={"logo.png"} alt="Logo" className={`h-16 ${ctx.preferences.theming ? "" : ""}`} />
            <div className={"flex items-center"}>
                <Link func={() => {document.getElementById('header').scrollIntoView()}} text={"Today"}></Link>
                <Link func={() => {document.getElementById('lunch').scrollIntoView()}} text={"Food"}></Link>
                <Link func={() => {document.getElementById('schedule').scrollIntoView()}} text={"Events"}></Link>
                <HeadsUp 
                    id="cta-add-classes" 
                    title={"Add your classes"} 
                    text={"With an account, you can add your classes to WADaily to see them in the schedule!"} 
                    actionText="Open Settings" 
                    action={() => setSettingsVisible(true)}
                    isVisible={ctx.user != null && Object.keys(ctx.preferences.classNames).length === 0}
                >
                    <div onClick={() => ctx.user != null ? setSettingsVisible(true) : setLoginModalVisible(true)} className={`cursor-pointer text-white rounded-full bg-gray-500 h-10 self-center ${ctx.loadingUser && "animate-pulse"} ${ctx.loggedIn && "overflow-hidden w-10"} flex justify-center items-center`}>
                        {ctx.user != null ? 
                            <p className='m-2'>{formatName(ctx.user.email)}</p> :
                            <p className="cursor-pointer mx-3" >🔑 Login</p>
                        }
                    </div>
                </HeadsUp>
            </div>
            <SettingsModal visible={settingsVisible} setVisible={setSettingsVisible} />
            <LoginModal visible={loginModalVisible} setVisible={setLoginModalVisible} />
        </header>
    )
}
