import { useState } from "react";
import LoginModal from "./LoginModal";

/* eslint-disable @next/next/no-img-element */
function Link({func = () => {}, text, className}) {
    return (<a className={`self-center ml-3 text-lg font-normal cursor-pointer ${className}`} onClick={func}>{text}</a>)
}

export default function Header({updateUI}) {
    const [viewLoginModal, setViewLoginModal] = useState(false)

    return (
        <header className={"my-5 flex justify-between"}>
            <img src={"logo.png"} alt="Logo" className={"h-16"} />
            <div className={"flex"}>
                <Link func={() => {
                    document.getElementById('header').scrollIntoView()
                    updateUI(new Date());
                }} text={"Today"}></Link>
                <Link func={() => {document.getElementById('lunch').scrollIntoView()}} text={"Food"}></Link>
                <Link func={() => {document.getElementById('schedule').scrollIntoView()}} text={"Events"}></Link>
                <Link className="underline text-red-700" func={() => setViewLoginModal(true)} text={"Sign in"}></Link>
            </div>
            {viewLoginModal && <LoginModal close={() => setViewLoginModal(false)} />}
        </header>
    )
}
