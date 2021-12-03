/* eslint-disable @next/next/no-img-element */
function Link({func = () => {}, text}) {
    return (<a className={"self-center ml-3 text-gray-600 text-lg font-normal cursor-pointer"} onClick={func}>{text}</a>)
}

export default function Header() {
    return (
        <header className={"my-5 flex justify-between"}>
            <img src={"logo.png"} alt="Logo" className={"h-16"} />
            <div className={"flex"}>
                <Link func={() => {}} text={"Today"}></Link>
                <Link func={() => {}} text={"Events"}></Link>
                <Link func={() => {}} text={"Food"}></Link>
            </div>
        </header>
    )
}
