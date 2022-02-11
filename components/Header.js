import { useContext, useState } from "react";
import { UserContext } from "../pages";
import AccountModal from "./AccountModal";
import LoginModal from "./LoginModal";

/* eslint-disable @next/next/no-img-element */

function formatName(n) {
    //regex matches the .lastname@ of fn.ln@woodward.edu
    //sees if teacher essentially
    if (/\..+@/.test(n)) {
        const names = n.split(".")
        return `${names[0].substring(0,1)}${names[1].substring(0,1)}`.toUpperCase()
    } else {
        return n.replace(/[0-9]{2}/, "").substring(0,2).toUpperCase()
    }
}

export function Link({func = () => {}, text, className}) {
    return (<a className={`self-center ml-3 text-lg font-normal cursor-pointer ${className}`} onClick={func}>{text}</a>)
  }

export default function Header({children}) {
    const [viewLoginModal, setViewLoginModal] = useState(false)
    const [viewAccountModal, setViewAccountModal] = useState(false)
    const ctx = useContext(UserContext)

    return (
        <header className={"my-5 flex justify-between"}>
            <img src={"logo.png"} alt="Logo" className={"h-16"} />
            <div className={"flex"}>
                {children}
                
                <div onClick={() => ctx.loggedIn ? setViewAccountModal(true) : setViewLoginModal(true)} className={`cursor-pointer text-white rounded-full bg-gray-500 h-10 self-center ml-4 ${ctx.loggedIn && "overflow-hidden w-10"} flex justify-center items-center`}>
                    {ctx.loggedIn ? 
                        <p>{formatName(ctx.user.email)}</p> :
                        <a className="cursor-pointer mx-3" >🔑 Login</a>
                    }
                </div>
            </div>
            {viewLoginModal && <LoginModal close={() => setViewLoginModal(false)} />}
            {viewAccountModal && <AccountModal close={() => setViewAccountModal(false)} />}
        </header>
    )
}
