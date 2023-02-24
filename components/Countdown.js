import { useEffect, useState } from "react"

export default function Countdown({ endDate, title, completeMessage }) {
    const [timeLeft, setTimeLeft] = useState(null)
    const [timeElapsed, setTimeElapsed] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date()
            const difference = endDate - now

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    mins: Math.floor((difference / 1000 / 60) % 60),
                    secs: Math.floor((difference / 1000) % 60)
                })
            } else {
                setTimeElapsed(true)
                clearInterval(interval)
            }
        }, 1000)

        return () => clearInterval(interval)
    })

    if (!timeLeft) return undefined
    return <div className="flex flex-col items-end">
        {timeElapsed ? <>
            <p className="md:text-2xl text-lg font-semibold text-white">{completeMessage}</p>
        </> : <>
            <p className="text-white md:text-lg text-sm font-light tracking-wider">{title}</p>
            <div className="flex">
                {Object.entries(timeLeft).map(([key, value]) => {
                    return <div key={key} className="md:w-12 w-10 flex flex-col items-center text-white">
                        <div className="md:text-3xl text-xl font-bold">{value}</div>
                        <div className="md:text-sm text-xs">{key}</div>
                    </div>
                })}
            </div>
        </>}
    </div>
}