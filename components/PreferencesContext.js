import { createContext, useState } from "react";

//a react component that creates a context for the preferences
export const PreferencesContext = createContext({});

export function PreferencesContextComponent({children}) {
    const [preferences, setPreferences] = useState(
    typeof window != "undefined" && window.localStorage.getItem("preferences") ? JSON.parse(localStorage.getItem("preferences")) :    
    {
        showProgressAcrossDays: true,
        theming: true,
        announcements: true,
        westCommons: false,
        classNames: {}
    })

    const [user, setUser] = useState(null)

    function updatePreferences(newPreferences) {
        setPreferences({...preferences, ...newPreferences})
        window.localStorage.setItem("preferences", JSON.stringify({...preferences, ...newPreferences}))
        //Record config for analytics
        for (const [key, val] of Object.entries(newPreferences)) {
            gtag('event','config_change', {change: key, to: val})
        }
    }

    function loginUser(id) {

    }

    return (
        <PreferencesContext.Provider value={{preferences, updatePreferences, user, loginUser}}>
            {children}
        </PreferencesContext.Provider>
    )
}