import { useContext, useState } from "react";
import CloseButton from "./CloseButton";
import Modal from "./Modal";
import { PreferencesContext } from "./PreferencesContext";

export default function LoginModal({visible, setVisible}) {
    const ctx = useContext(PreferencesContext);
    const [number, setNumber] = useState("xxxxxx");
    const [needDetails, setNeedDetails] = useState(true);

    return (visible && <Modal style={{minWidth: '30%'}}>
            <CloseButton onClick={() => setVisible(false)}></CloseButton>
            <p className="text-2xl">Sign in</p>
            <p className="text-gray-500">Sign in with your student ID to save your preferences</p>
            <div class="flex mt-2 items-center justify-center w-full">
                {
                    [...Array(6).keys()].map((_, i) => {
                        return <NumberBoxInput key={i} index={i} state={number} setState={setNumber} />
                    })
                }
            </div>
            <button id="login-submit" className="mt-2">Log in</button>
            {needDetails && <Modal>
                <p className="text-2xl">Set up</p>
                <p className="mb-3">We&apos;ll need some extra details to register you</p>
                <p>Your Name</p>
                <input type="text" className="w-full border-2 mb-2 border-gray-300 rounded-md p-2" />
                <p>Your Woodward Email</p>
                <div className="flex items-center border-2 rounded-md border-gray-300">
                    <input type="text" className="0 p-2 w-max outline-none" />
                    <p className="mx-3">@woodward.edu</p>
                </div>
                <button id="login-submit" className="mt-3">Complete setup</button>
            </Modal>}
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
            }} type="number" maxLength={1} className="text-2xl tab-target mr-2 text-center number-input w-14 h-14 border-2 border-gray-300 rounded-md p-2" />
        </div>
    )
}
