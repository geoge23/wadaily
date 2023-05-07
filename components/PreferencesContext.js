import { createContext, useState, useEffect } from "react";

//a react component that creates a context for the preferences
export const PreferencesContext = createContext({});

export function PreferencesContextComponent({children}) {
    const [preferences, setPreferences] = useState({
        classNames: {}
    })
    
    useEffect(() => {
        const storedPreferences = JSON.parse(localStorage.getItem("preferences"))
        if (storedPreferences) {
            setPreferences(storedPreferences)
        }
    }, [])
    
    function updatePreferences(newPreferences) {
        setPreferences({...preferences, ...newPreferences})
        localStorage.setItem("preferences", JSON.stringify({...preferences, ...newPreferences}))
    }     

    return (
        <PreferencesContext.Provider value={{preferences, updatePreferences}}>
            {children}
        </PreferencesContext.Provider>
    )
}