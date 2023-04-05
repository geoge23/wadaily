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
                ref.current.classList.add("hover-scroll-text");
                ref.current.parentElement.classList.add("bottom-scroll-shadow");
            }
        }
    }, [ref])

    return <a href={url} target="_blank"><div className="h-52 bg-gray-300 text-gray-600 dark:text-current dark:bg-gray-400 w-44 rounded-2xl p-4 mr-3 flex-shrink-0 mb-4 overflow-hidden">
        <div className="rounded-2xl h-28 w-36 relative overflow-hidden">
            {/* the data URL is required, and it's just a 10x10px screenshot of the WADaily gradient */}
            <Image src={image} placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAzUExURe9ER+9ESe9ETO9ET+9FUe5FVO5FV+5FWe5FXO5FX+5FYe5FZO5GZu5Gae5Ga+5GbP///36wGKQAAAABYktHRBCVsg0sAAAACXBIWXMAABJ0AAASdAHeZh94AAAAB3RJTUUH5wQFFzgkNz46twAAAB9JREFUCNdjYGBkYmZhZWPn4OTi5uHlYxhafH5S1QMA0yAGKstgLugAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDQtMDVUMjM6NTY6MzYrMDA6MDBrZ135AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA0LTA1VDIzOjU2OjM2KzAwOjAwGjrlRQAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wNC0wNVQyMzo1NjozNiswMDowME0vxJoAAAAASUVORK5CYII=" alt="Butterknife Article" fill className="object-cover z-20" />
        </div>
        <div className="h-16 mt-1">
            <p className="font-semibold pb-4 h-16" ref={ref}>{title}</p>
        </div>
    </div></a>
}

export default ButterknifeTray;