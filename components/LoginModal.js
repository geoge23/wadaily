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
    const [verifyCode, setVerifyCode] = useState("xxxxxx")
    const [verifyRequest, setVerifyRequest] = useState(null)
    const [loading, setLoading] = useState(false)

    const loginUser = async ({name, email, id, code}) => {
        setLoading(true)
        const res = await fetch(`/api/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    name,
                    email,
                },
                id,
                code
            })
        })
        
        const body = await res.json()
        if (res.status == 200) {
            const { user, token } = body;
            ctx.setUser(user)
            if (token) {
                localStorage.setItem('token', token)
            }
            setVisible(false)
        } else if (res.status == 400 && body.status == "missing_data") {
            setNeedDetails(true)
        } else if (res.status == 401 && body.status == "needs_verification") {
            setVerifyRequest("Get your verification code from your email")
        } else if (res.status == 401 && body.status == "needs_code") {
            setVerifyRequest("Get your login code from your email")
        } else {
            setLoading(false)
            setVerifyCode("xxxxxx")
            return alert(body.message)
        }
        setLoading(false)
    }

    return (visible && <Modal style={{minWidth: '30%'}}>
            <CloseButton onClick={() => setVisible(false)}></CloseButton>
            {loading && <Loader />}
            <p className="text-2xl">Sign in</p>
            <p className="text-gray-500">Sign in with your student ID to save your preferences</p>
            <div className="flex mt-2 items-center justify-center w-full mb-2">
                {
                    [...Array(6).keys()].map((_, i) => {
                        return <NumberBoxInput key={i} index={i} state={number} setState={setNumber} />
                    })
                }
            </div>
            <button id="login-submit" onClick={() => {
                loginUser({
                    id: number,
                    code: verifyCode.indexOf('x') == -1 ? verifyCode : undefined
                })
            }} className="mt-2 bg-blue-600 text-white p-1 rounded-md">Log in</button>
            <AddDetailsModal visible={needDetails} setVisible={setNeedDetails} loginUser={loginUser} number={number} />
            {verifyRequest && <Modal>
                <p className="text-2xl">Verification required</p>
                <p>{verifyRequest}</p>
                <div className="flex mt-2 items-center justify-center w-full mb-2">
                    {
                        [...Array(6).keys()].map((_, i) => {
                            return <NumberBoxInput key={i} index={i} state={verifyCode} setState={setVerifyCode} autoPaste={true} />
                        })
                    }
                </div>
                <button id="login-submit" onClick={() => {
                    if (verifyCode.indexOf('x') != -1) return alert("Please enter the verification code")
                    loginUser({
                        id: number,
                        code: verifyCode
                    })
                }} className="mt-2 bg-blue-600 text-white p-1 rounded-md">Submit</button>
                <button onClick={() => {
                    setVerifyRequest(null)
                    setVerifyCode("xxxxxx")
                }}>Cancel</button>
            </Modal>}
        </Modal>)
}


// input to take one number and then move to the next one
function NumberBoxInput({index, state, setState, autoPaste = false}) {
    return (
        <div>
            <input onKeyDown={(event) => {
                // trigger default if pasting
                if (event.key == "v" && event.ctrlKey) {
                    return console.log('qqq')
                };
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
            }} 
            // prevent annoying error
            onChange={() => {}}
            // store paste value in state
            onPasteCapture={(event) => {
                event.preventDefault()
                console.log('ding')
                const paste = (event.clipboardData || window.clipboardData).getData('text');
                setState(paste)
            }}
            onClick={async (event) => {
                if (!autoPaste) return
                try {
                    const text = await navigator.clipboard.readText()
                    if (/[0-9]{6}/.test(text)) {
                        setState(text)
                    }
                } catch (_) {}
            }}
            type="number" value={state[index] == "x" ? "" : state[index]} className="text-2xl tab-target mr-2 text-center number-input w-14 h-14 border-2 border-gray-300 rounded-md p-2 dark:bg-gray-900" />
        </div>
    )
}
