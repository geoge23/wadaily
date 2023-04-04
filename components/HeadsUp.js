import { useEffect, useState } from "react";

export function HeadsUp({ children, id, title, text, isVisible = true, action = () => {}, actionText = "Try it" }) {
    const [hidden, setHidden] = useState(true);

    function hide() {
        localStorage.setItem(`dismissed-headsup-${id}`, true);
        setHidden(true);
    }

    useEffect(() => {
        if (isVisible && localStorage.getItem(`dismissed-headsup-${id}`) !== "true") {
            setHidden(false);
        }
    }, [isVisible, id])

    if (hidden) return <>{children}</>;
    return <div className='relative'>
        {children}
        <div style={{ top: "145%" }} className='absolute right-0 z-50 bg-blue-600 p-2 rounded w-72 shadow-lg animate-slide-in text-gray-200'>
            <p className='text-white text-lg'>{title}</p>
            <p>{text}</p>
            <div className='flex'>
                <button className='bg-transparent hover:bg-blue-700 hover:border-opacity-0 transition border text-white rounded px-2 py-1 m-1' onClick={() => {
                    action();
                    setHidden(true);
                }}>{actionText}</button>
                <button className='bg-blue-500 text-white rounded px-2 py-1 m-1' onClick={hide}>Dismiss</button>
            </div>
            <svg height={10} width={20} className="absolute bottom-full right-2 text-blue-600 fill-current">
                <polygon points="0,10 10,0 20,10" />
            </svg>

        </div>
    </div>;
}
