import { useContext, useState } from "react";
import AddDetailsModal from "./AddDetailsModal";
import CloseButton from "./CloseButton";
import Loader from "./Loader";
import Modal from "./Modal";
import { PreferencesContext } from "./PreferencesContext";

export default function LoginModal({visible, setVisible}) {
    const ctx = useContext(PreferencesContext);
    const [needDetails, setNeedDetails] = useState(false)
    const [number, setNumber] = useState("xxxxxx");
    const [loading, setLoading] = useState(false)

    const loginUser = async () => {
        setLoading(true)
        const res = await fetch(`/api/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: number})
        })
        const body = await res.json()

        ctx.updatePreferences(body.preferences)
        delete body.preferences
        ctx.setUser(body)
        if (body.missingDetails) {
            setNeedDetails(true)
        } else {
            setVisible(false)
        }

        setLoading(false)
    }

    return (visible && <Modal style={{minWidth: '30%'}}>
            <CloseButton onClick={() => setVisible(false)}></CloseButton>
            {loading && <Loader />}
            <p className="text-2xl">Sign in</p>
            <p className="text-gray-500">Sign in with your student ID to save your preferences</p>
            <div className="flex mt-2 items-center justify-center w-full">
                {
                    [...Array(6).keys()].map((_, i) => {
                        return <NumberBoxInput key={i} index={i} state={number} setState={setNumber} />
                    })
                }
            </div>
            <button id="login-submit" onClick={loginUser} className="mt-2">Log in</button>
            <AddDetailsModal visible={needDetails} setVisible={setNeedDetails} setLoginModal={setVisible} />
        </Modal>)
}


// input to take one number and then move to the next one
function NumberBoxInput({index, state, setState}) {
    return (
        <div>
            <input onKeyDown={(event) => {
                event.preventDefault()
                if (event.key == "Backspace") {
                    event.target.value = ""
                    try {
                        event.target.parentElement.previousElementSibling.children[0].focus()
                    } catch (_) {}
                } else if (event.key >= 0 && event.key <= 9) {
                    event.target.value = event.key
                    setState(state.substring(0, index) + event.key + state.substring(index + 1))
                    try {
                        event.target.parentElement.nextElementSibling.children[0].focus()
                    } catch (_) {
                        document.getElementById('login-submit').focus()
                    }
                }
            }} type="number" maxLength={1} className="text-2xl tab-target mr-2 text-center number-input w-14 h-14 border-2 border-gray-300 rounded-md p-2 dark:bg-gray-900" />
        </div>
    )
}
