import { useContext, useState } from "react";
import Modal from "./Modal";
import { PreferencesContext } from "./PreferencesContext";

export default function DaysModal({visible, setVisible}) {
    const ctx = useContext(PreferencesContext);
    const [classNames, setClassNames] = useState(ctx.preferences.classNames || {});

    function save() {
        ctx.updatePreferences({classNames})
        setVisible(false)
    }

    return (visible && <Modal style={{minWidth: '30%'}}>
        <p className="absolute top-3 right-4 cursor-pointer" onClick={() => setVisible(false)}>x</p>
        <p>Insert your class names</p>
        {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((e,i) => 
            <OptionBlock key={i} blockCode={e} classNames={classNames} setClassNames={setClassNames} />)}
        <p className="self-center mt-4 cursor-pointer" onClick={save}>Save</p>
    </Modal>)
}

function OptionBlock({blockCode, classNames, setClassNames}) {
    return (
        <div className="flex items-center mt-4">
            <p className="mr-2">Block {blockCode}</p>
            <input className="border-2 text-black" type="text" value={classNames[blockCode]} onChange={(e) => setClassNames({...classNames, [blockCode]: e.target.value})} />
        </div>
    )
}