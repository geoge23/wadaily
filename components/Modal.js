export default function Modal({children, className, style}) {
    return <div className="fixed z-50 top-0 left-0 h-screen w-screen flex justify-center items-center bg-gray-500 bg-opacity-40">
        <div style={style} className={`${className} rounded-lg bg-white dark:bg-gray-900 p-5 max-w-lg flex flex-col relative`}>
            {children}
        </div>
    </div>
}