/* eslint-disable react/jsx-no-target-blank */
import Image from "next/image";
import { useContext, useEffect, useRef } from "react";
import { PreferencesContext } from "./PreferencesContext";

function ButterknifeTray({articles = []}) {
    const ctx = useContext(PreferencesContext);

    function hide() {
        gtag('event','hide_butterknife', {
            'event_category': 'engagement',
            'event_label': 'hide_butterknife'
        });

        ctx.updatePreferences({butterknife: false});
    }

    if (ctx.preferences.butterknife === false) return null;
    if (articles.length == 0) return null;
    return <div className={"rounded-2xl shadow-lg bg-gray-400 w-full dark:bg-gray-600 p-4 my-4 relative text-white"}>
        <div className="font-thin mb-2 flex md:justify-between md:flex-row flex-col">
            <p>From the Butterknife</p>
            <p onClick={hide} role="button" className="cursor-pointer underline">Not helpful? Hide this panel</p>
        </div>
        <div className="flex overflow-x-auto flex-grow-0 scrollbar overflow-y-hidden">
            {articles.map((article, index) => <ButterknifeArticle key={index} {...article} />)}
        </div>
    </div>;
}

function ButterknifeArticle({image, title, url}) {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current) {
            if (ref.current.scrollHeight > ref.current.clientHeight) {
                ref.current.classList.add("scroll-text");
            }
        }
    }, [ref])

    return <a href={url} target="_blank"><div className="h-52 bg-gray-300 text-gray-600 dark:text-current dark:bg-gray-400 w-44 rounded-2xl p-4 mr-3 flex-shrink-0 mb-4">
        <div className="rounded-2xl h-28 w-36 relative overflow-hidden">
            <Image src={image} alt="Butterknife Article" fill className="object-cover" />
        </div>
        <div className="h-16 mt-1 overflow-hidden">
            <p className="font-semibold pb-4 h-16" ref={ref}>{title}</p>
        </div>
    </div></a>
}

export default ButterknifeTray;