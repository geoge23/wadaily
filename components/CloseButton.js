import { useEffect } from "react";

// the export keyword makes this variable persist across instantiations of the component
export let functionToCloseTopModal = null;

// a safe API to close the top modal from other components
export function closeTopModal() {
    if (functionToCloseTopModal) functionToCloseTopModal();
    functionToCloseTopModal = null;
}

export default function CloseButton({onClick}) {
    useEffect(() => {
        functionToCloseTopModal = onClick;
        const closeListener = (e) => {
            if (e.key == "Escape" && functionToCloseTopModal) {
                functionToCloseTopModal();
            }
        }
        window.addEventListener("keydown", closeListener);
        return () => window.removeEventListener("keydown", closeListener);
    }, [onClick]);

    return (<p className="absolute top-3 right-4 cursor-pointer text-2xl" onClick={onClick}>x</p>);
}