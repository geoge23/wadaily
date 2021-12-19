/* eslint-disable @next/next/no-img-element */
function Link({func = () => {}, text}) {
    return (<a className={"self-center ml-3 text-lg font-normal cursor-pointer"} onClick={func}>{text}</a>)
}

export default function Header() {
    return (
        <header className={"my-5 flex justify-between"}>
            <img src={"logo.png"} alt="Logo" className={"h-16"} />
            <div className={"flex"}>
                <Link func={() => {document.getElementById('header').scrollIntoView()}} text={"Today"}></Link>
                <Link func={() => {document.getElementById('lunch').scrollIntoView()}} text={"Food"}></Link>
                <Link func={() => {document.getElementById('schedule').scrollIntoView()}} text={"Events"}></Link>
            </div>
        </header>
    )
}
