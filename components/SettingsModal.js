import { useContext, useState } from "react";
import CloseButton from "./CloseButton";
import Modal from "./Modal";
import { PreferencesContext } from "./PreferencesContext";

export default function SettingsModal({ visible, setVisible }) {
    const ctx = useContext(PreferencesContext);
    const [classNames, setClassNames] = useState(ctx.preferences.classNames || {});

    function save() {
        //prevents users from saving empty class names
        const safeClassNames = Object.entries(classNames)
            .filter(([_, val]) => val)
            //reconstructs the object
            .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {})
        console.log(safeClassNames)
        ctx.updatePreferences({ classNames: safeClassNames })
        setVisible(false)
    }

    return (visible && <Modal>
        <p>WADaily by George Parks</p>
        <p className="opacity-70 w-72">Version {VERSION} from {LAST_COMMIT_DATE_TIME}</p>
        <br />
        <CloseButton onClick={() => setVisible(false)}></CloseButton>
        <p>Insert your class names</p>
        {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((e, i) =>
            <OptionBlock key={i} blockCode={e} classNames={classNames} setClassNames={setClassNames} />)}
        <button className="self-center mt-6 bg-blue-600 text-white p-2 w-36 rounded-md" onClick={save}>Save Settings</button>
    </Modal>)
}

function OptionBlock({ blockCode, classNames, setClassNames }) {
    return (
        <div className="flex items-center mt-4">
            <p className="mr-2 w-20">Block {blockCode}</p>
            <input className="border-2 dark:border-transparent dark:bg-gray-700 p-1" type="text" value={classNames[blockCode]} onChange={(e) => setClassNames({ ...classNames, [blockCode]: e.target.value })} />
        </div>
    )
}