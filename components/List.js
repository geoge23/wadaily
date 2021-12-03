export function List({content = [{type: 'title', text: 'No data available'}], title}) {
    return <div className={"text-gray-700"}>
        {title ? <p className={"text-3xl font-bold mb-3"}>{title}</p> : null}
        {content.map((e) => {
        switch (e.type) {
            case 'title':
                return (<p className={"font-semibold mb-2 uppercase tracking-wider text-2xl"}>{e.text}</p>)
            case 'entry':
                return (<span className={"flex w-full"}>
                    <p className={"text-2xl mb-4 flex"}>{e.text}</p>
                    {e.sideText ? <p className={"text-2xl ml-auto"}>{e.sideText}</p> : null}
                </span>)
            case 'break':
            default:
                return <br />;
        }
    })}</div>
}