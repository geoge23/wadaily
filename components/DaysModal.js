import { useContext, useState } from "react";
import CloseButton from "./CloseButton";
import Modal from "./Modal";
import { PreferencesContext } from "./PreferencesContext";

export default function DaysModal({ visible, setVisible }) {
    const ctx = useContext(PreferencesContext);
    const [classNames, setClassNames] = useState(ctx.preferences.classNames || {});

    function save() {
        ctx.updatePreferences({ classNames })
        setVisible(false)
    }

    return (visible && <Modal>
        <CloseButton onClick={() => setVisible(false)}></CloseButton>
        <p>Insert your class names</p>
        {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((e, i) =>
            <OptionBlock key={i} blockCode={e} classNames={classNames} setClassNames={setClassNames} />)}
        <p className="self-center mt-4 cursor-pointer" onClick={save}>Save</p>
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