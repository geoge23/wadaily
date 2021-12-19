import { useState, useEffect } from "react";

export default function HeadsUp() {
    const [available, setAvailable] = useState(false);
    const [title, setTitle] = useState();
    const [message, setMessage] = useState();

    useEffect(() => {
        fetch('/api/notification')
        .then(r => r.status == 200 ? r.json() : 'No')
        .then(({title: t, message: m}) => {
            setTitle(t);
            setMessage(m);
            setAvailable(true);
        })
    }, [])

    return (
        <>
            {available ? <div className="w-full flex justify-center mt-2 md:flex-row flex-col text-center md:leading-normal leading-5 text-white">
                <span className="font-bold mr-2">{title}</span><span> {message}</span>
            </div> : null}
        </>
    )
}