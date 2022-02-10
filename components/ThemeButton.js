export default function ThemeButton({children, className, onClick}) {
    return <button className={`${className} bg-gray-500 hover:bg-gray-400 transition text-white text-xl py-2 px-6`} onClick={onClick}>
        {children}
    </button>
}