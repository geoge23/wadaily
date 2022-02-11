import { useContext, useState } from "react";
import { UserContext } from "../pages";
import Loader from "./Loader";
import Modal from "./Modal";
import TextEntry from "./TextEntry";
import ThemeButton from "./ThemeButton";

export default function LoginModal({close}) {
    const ctx = useContext(UserContext)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [currentEmail, setCurrentEmail] = useState("")

    function handleLogin() {
        console.log('running')
        setError('')
        if (currentEmail && /^.+@.+\.edu$/.test(currentEmail)) {
            setLoading(true)
            let login;
            try {
                login = new EventSource(`/api/login?email=${currentEmail}`)
            } catch (e) {
                setError(e.toString())
                setLoading(false)
                return;
            }
            login.addEventListener('message', (e) => {
                const obj = JSON.parse(e.data)
                switch (obj.status) {
                    case 'success':
                        login.close()
                        document.cookie = `jwt=${obj.jwt}`
                        ctx.setUser(obj.user)
                        ctx.setLoggedIn(true)
                        setLoading(false)
                        close()
                        break;
                    case 'email_sent':
                        break;
                    case 'error':
                        login.close()
                        setError(obj.error)
                        setLoading(false)
                    default:
                        console.log(e)
                        break;
                }
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
        {loading && <Loader>
                <div className="dark:bg-black bg-white p-2 mt-4 rounded-lg text-center text-black dark:text-white">
                    <p className="">🧙‍♂️ Check your email for a magic sign-in link!<br></br>Return to this page once you've pressed it</p>
                    <a className="underline cursor-pointer" onClick={() => {
                        window.location.reload()
                    }}>Cancel login</a>
                </div>
            </Loader>}
        <ThemeButton onClick={handleLogin} className={"mt-4 w-full"}>Log in</ThemeButton>
    </Modal>
}