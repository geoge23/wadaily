import { useState } from "react";
import Loader from "./Loader";
import Modal from "./Modal";
import TextEntry from "./TextEntry";
import ThemeButton from "./ThemeButton";

export default function LoginModal({close}) {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [currentEmail, setCurrentEmail] = useState("")

    function handleLogin() {
        console.log('running')
        setError('')
        setLoading(true)
        if (currentEmail && /.+@.+\.edu/.test(currentEmail)) {
            const login = new EventSource(`/api/login?email=${currentEmail}`)
            login.addEventListener('message', (e) => {
                console.log(e)
            })
        } else {
            return setError('Email missing or invalid')
        }
    }

    return <Modal>
        <div className="flex justify-between">
            <p className="text-xl">Sign into your account</p>
            <a className="underline cursor-pointer" onClick={close}>x</a>
        </div>
        <p>Access custom features and data with a WADaily account</p>
        <TextEntry onChange={(e) => setCurrentEmail(e.target.value)} title={"Your Woodward Email"} placeholder={"23eeagle@woodward.edu"} />
        {error && <p className="text-red-600">{error}</p>}
        <ThemeButton onClick={handleLogin} className={"mt-4 w-full "}>{loading ? <Loader /> : "Log in"}</ThemeButton>
    </Modal>
}