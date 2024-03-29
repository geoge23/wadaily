import { useContext, useState } from "react";
import CloseButton from "./CloseButton";
import DaysModal from "./DaysModal";
import Modal from "./Modal";
import { PreferencesContext } from "./PreferencesContext";

export default function SettingsModal({visible, setVisible}) {
    const ctx = useContext(PreferencesContext);
    const [daysModalVisible, setDaysModalVisible] = useState(false);

    return (visible && <Modal style={{minWidth: '30%'}}>
            <DaysModal setVisible={setDaysModalVisible} visible={daysModalVisible} />
            <CloseButton onClick={() => setVisible(false)}></CloseButton>
            <p className="text-2xl">Preferences</p>
            <div style={{maxHeight: 470, overflowY: 'scroll'}} className="scrollbar">
                <Checkbox text="Show progress across the day" checked={ctx.preferences.showProgressAcrossDays} onChange={() => ctx.updatePreferences({showProgressAcrossDays: !ctx.preferences.showProgressAcrossDays})}>
                    Shows progress along the red line next to the schedule as the day progresses
                </Checkbox>
                <Checkbox text="Holiday Theming" checked={ctx.preferences.theming} onChange={() => ctx.updatePreferences({theming: !ctx.preferences.theming})}>
                    Show themes and additions for the holidays.
                </Checkbox>
                <Checkbox text="Show Butterknife news" checked={ctx.preferences.butterknife} onChange={() => {ctx.updatePreferences({butterknife: !ctx.preferences.butterknife})}}>
                    Show news from the Butterknife on your WADaily homepage
                </Checkbox>
                <Checkbox text="Show School-Wide Announcements" checked={ctx.preferences.announcements} onChange={() => ctx.updatePreferences({announcements: !ctx.preferences.announcements})}>
                    Show or hide announcements that appear as modal messages. Not recommended to change.
                </Checkbox>
                <Checkbox text="West Commons" checked={ctx.preferences.westCommons} onChange={() => ctx.updatePreferences({westCommons: !ctx.preferences.westCommons})}>
                    Show West Commons over the cafeteria for lunch by default.
                </Checkbox>
                <Button text="Clear Announcement Cache" buttonText="Clear" onChange={() => {window.localStorage.setItem('seen-announcements', "[]")}}>
                    Clear cache of seen announcements if it overflows.
                </Button>
                <Button text="Update Class Names" onChange={() => {
                    setDaysModalVisible(true);
                    gtag('event','view_class_names');
                }}>
                    Set your class names so that they display on the schedule.
                </Button>
                <Button text="Log out" buttonText="Log out" onChange={() => {
                    window.localStorage.removeItem('token');
                    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname};`;
                    window.location.reload();
                }}>
                    Sign out of your account
                </Button>
                <p className="mt-4">From the WADaily Team ☕</p>
                <p className="opacity-70">But mostly George</p>
                <p className="opacity-70">Version {VERSION} from {LAST_COMMIT_DATE_TIME}</p>
            </div>
        </Modal>)
}

// A react component with a checkbox and text that runs a function on change
function Checkbox({text, children, checked, onChange}) {
    return (
        <div className="flex items-center mt-2">
            <input type="checkbox" checked={checked} onChange={onChange} className="mr-2 w-1/12" />
            <div onClick={onChange} className="w-11/12">
                <p>{text}</p>
                <p className="opacity-70 text-sm">{children}</p>
            </div>
        </div>
    )
}

function Button({text, children, onChange, buttonText = "Open"}) {
    return (
        <div className="flex items-center mt-2">
            <button onClick={onChange} className="mr-3 border-2 text-white px-3 py-1 bg-black">{buttonText}</button>
            <div onClick={onChange}>
                <p>{text}</p>
                <p className="opacity-70 text-sm">{children}</p>
            </div>
        </div>
    )
}
