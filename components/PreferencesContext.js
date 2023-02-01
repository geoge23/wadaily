import { createContext, useState, useEffect } from "react";

//a react component that creates a context for the preferences
export const PreferencesContext = createContext({});

export function PreferencesContextComponent({children}) {
    const [preferences, setPreferences] = useState({
        showProgressAcrossDays: true,
        theming: true,
        announcements: true,
        westCommons: false,
        classNames: {}
    })

    const [userDoc, setUserDoc] = useState(null)
    
    useEffect(() => {
        pullUser()
    }, [])
    
    function updatePreferences(newPreferences, fromServer = false) {
        setPreferences({...preferences, ...newPreferences})
        if (!fromServer) {
            //Update server
            fetch("/api/user/config", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + window.localStorage.getItem("token")
                },
                method: "POST",
                body: JSON.stringify({
                    preferences: newPreferences
                }
            )})
            //Record config for analytics
            for (const [key, val] of Object.entries(newPreferences)) {
                gtag('event','config_change', {change: key, to: val})
            }
        }
    }

    async function pullUser() {
        if (window.localStorage.getItem("token")) {
            const userReq = await fetch("/api/user/login", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    token: window.localStorage.getItem("token")
                })
            })

            if (userReq.status == 200) {
                const body = await userReq.json()
                setUserDoc(body.user)
                updatePreferences(body.user.preferences, true)
            }
        }
    }

    function setUser(doc) {
        gtag('config', 'G-18065K9X6D', {
            'user_id': doc._id
        })
        setUserDoc(doc)
        updatePreferences(doc.preferences, true)
    }
            

    return (
        <PreferencesContext.Provider value={{preferences, updatePreferences, user: userDoc, setUser}}>
            {children}
        </PreferencesContext.Provider>
    )
}