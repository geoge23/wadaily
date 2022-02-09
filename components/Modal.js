export default function Modal({children}) {
    return <div className="fixed z-50 top-0 left-0 h-screen w-screen flex justify-center items-center bg-gray-500 bg-opacity-40">
        <div className="rounded-lg bg-white dark:bg-gray-900 p-5 max-w-lg">
            {children}
        </div>
    </div>
}