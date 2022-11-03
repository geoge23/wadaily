import { useEffect, useState, useContext } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Modal from "./Modal";
import { PreferencesContext } from "./PreferencesContext";

export default function SettingsModal({visible, setVisible}) {
    const ctx = useContext(PreferencesContext);

    return (visible && <Modal style={{minWidth: '30%'}}>
            <p className="absolute top-3 right-4 cursor-pointer" onClick={() => setVisible(false)}>x</p>
            <p className="text-2xl">Preferences</p>
            <Checkbox text="Show progress across the day" checked={ctx.preferences.showProgressAcrossDays} onChange={() => ctx.updatePreferences({showProgressAcrossDays: !ctx.preferences.showProgressAcrossDays})}>
                Shows progress along the red line next to the schedule as the day progresses
            </Checkbox>
            <Checkbox text="Holiday Theming" checked={ctx.preferences.theming} onChange={() => ctx.updatePreferences({theming: !ctx.preferences.theming})}>
                Ignore themes and additions for the holidays.
            </Checkbox>
            <Checkbox text="Upload Analytics" checked={true} onChange={() => {alert("Feature not supported!")}}>
                Opt out of analytics for service improvement. Not recommended to change.
            </Checkbox>
            <Checkbox text="Show School-Wide Announcements" checked={ctx.preferences.announcements} onChange={() => ctx.updatePreferences({announcements: !ctx.preferences.announcements})}>
                Show or hide announcements that appear as modal messages. Not recommended to change.
            </Checkbox>
            <Button text="Clear Announcement Cache" onChange={() => {window.localStorage.setItem('seen-announcements', "{}")}}>
                Clear cache of seen announcements if it overflows.
            </Button>
            <p className="mt-4">From the WADaily Team ☕</p>
            <p className="opacity-70">But mostly George</p>
            <p className="opacity-70">Version {VERSION} from {LASTCOMMITDATETIME}</p>
        </Modal>)
}

// A react component with a checkbox and text that runs a function on change
function Checkbox({text, children, checked, onChange}) {
    return (
        <div className="flex items-center mt-2">
            <input type="checkbox" checked={checked} onChange={onChange} className="mr-2" />
            <div onClick={onChange}>
                <p>{text}</p>
                <p className="opacity-70 text-sm">{children}</p>
            </div>
        </div>
    )
}

function Button({text, children, onChange}) {
    return (
        <div className="flex items-center mt-2">
            <button onClick={onChange} className="mr-3 border-2 text-white px-3 py-1 bg-black">Run</button>
            <div onClick={onChange}>
                <p>{text}</p>
                <p className="opacity-70 text-sm">{children}</p>
            </div>
        </div>
    )
}
