import { useEffect, memo, useRef } from "react"

export default function Hero({day, isDifferentDay = false}) {
    const ref = useRef(null)

    return (<div name="home" className={`
        justify-between box-border
        items-end shadow-lg flex bg-gradient-to-r 
        dark-bg-none dark:bg-gray-500
        w-full relative overflow-hidden
        rounded-2xl h-56 py-5 px-6
        from-yellow-400 via-red-500 to-pink-500
    `} ref={ref}>
        <div className="z-10">
            <p className={"text-white text-2xl font-light tracking-wider"}>{isDifferentDay ? "This day is a" : "Today is a"}</p>
            <p className={"text-white text-4xl md:text-6xl font-bold"}>{day}</p>
        </div>
        {/* {ctx.preferences.theming && <Leaves divRef={ref} />} */}
    </div>)
}


const Leaves = memo(function Leaves({divRef}) {
    function Leaf() {
        /** @type {import("react").RefObject<HTMLParagraphElement>} */
        const ref = useRef(null)
        
        useEffect(() => {
            ref.current.style.left = Math.random() * 100 + "%"
            const bound = divRef.current.getBoundingClientRect().bottom - divRef.current.getBoundingClientRect().top
            let y = Math.random() * -bound;
            let x = 1;
            let q = Math.random() * 5 + 10
            ref.current.innerText = ["🎄", "✨", "❄️", "☃️", "⭐️"][Math.floor(Math.random() * 5)]
            let interval = setInterval(() => {
                y += 1
                x = Math.sin(y / q) * q
                ref.current.style.transform = `translate(${x}px, ${y}px)`
                if (y > bound) {
                    y = -40 * Math.random() - 10
                    q = Math.random() * 15
                    ref.current.style.left = Math.random() * 100 + "%"
                }
            }, 50)
            return () => clearInterval(interval)
        }, [])

        return <p ref={ref} className="w-1 absolute top-1 z-0 text-xl">🍁</p>
    }

    return (<div className="absolute top-0 left-0 w-full">
        {Array.from({length: 20}).map((_, i) => <Leaf key={i} />)}
    </div>)
})