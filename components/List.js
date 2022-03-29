import { useEffect, useRef, useState } from "react";

export default function List({content = [{type: 'title', text: 'No data available'}], title, itemsCollapsible, children}) {
    return <div className={""}>
        {title ? <p className={`text-3xl font-bold ${children ? null : "mb-3"}`}>{title}</p> : null}
        {children}
        {content.map((e, i) => {
        switch (e.type) {
            case 'title':
                return (<p key={i} className={"font-semibold mb-2 uppercase tracking-wider text-2xl"}>{e.text}</p>)
            case 'entry':
                return (<TextItem i={i} element={e} itemsCollapsible={itemsCollapsible}></TextItem>)
            case 'break':
            default:
                return <br />;
        }
    })}</div>
}

function TextItem({i, element: e, itemsCollapsible}) {
    const [visible, setVisible] = useState(!itemsCollapsible)
    const [isOverflowing, setIsOverflowing] = useState(false)
    const ref = useRef(null)
    useEffect(() => {
        setIsOverflowing((ref.current.offsetWidth < ref.current.scrollWidth))
    }, [])

    return <span key={i} className={`flex w-full relative`} onClick={() => setVisible(!visible)}>

        <p ref={ref} className={`
            text-2xl mb-4 
            ${itemsCollapsible && isOverflowing ? 'cursor-pointer mr-4' : ''} 
            ${itemsCollapsible && !visible ? "overflow-hidden whitespace-nowrap block" : "flex"}
        `} style={{textOverflow: itemsCollapsible ? 'ellipsis' : 'initial'}}>
            {e.text}
        </p>

        {e.sideText ? <p className={"text-2xl ml-auto"}>{e.sideText}</p> : null}
        {itemsCollapsible && isOverflowing ? <p className={`absolute right-0 top-1 cursor-pointer ${visible ? "transform rotate-180" : ""}`}>↓</p> : null}
    </span>;
}
