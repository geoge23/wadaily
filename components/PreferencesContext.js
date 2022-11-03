import { createContext, useState } from "react";

//a react component that creates a context for the preferences
export const PreferencesContext = createContext({});

export function PreferencesContextComponent({children}) {
    const [preferences, setPreferences] = useState(
    typeof window != "undefined" && window.localStorage.getItem("preferences") ? JSON.parse(localStorage.getItem("preferences")) :    
    {
        showProgressAcrossDays: true,
        theming: true,
        announcements: true
    })

    function updatePreferences(newPreferences) {
        setPreferences({...preferences, ...newPreferences})
        window.localStorage.setItem("preferences", JSON.stringify({...preferences, ...newPreferences}))
    }

    return (
        <PreferencesContext.Provider value={{preferences, updatePreferences}}>
            {children}
        </PreferencesContext.Provider>
    )
}