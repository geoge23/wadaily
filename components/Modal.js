import { closeTopModal } from "./CloseButton"

export default function Modal({children, className, style}) {
    function handleClick(e) {
        if (e.target == e.currentTarget) {
            closeTopModal()
        }
    }

    return <div onClick={handleClick} className="modal fixed z-50 top-0 left-0 h-screen w-screen flex justify-center items-center bg-gray-500 bg-opacity-40">
        <div style={style} className={`rounded-lg bg-white dark:bg-gray-900 p-5 max-w-lg flex flex-col relative ${className}`}>
            {children}
        </div>
    </div>
}