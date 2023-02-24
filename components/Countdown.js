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
            <p className="text-2xl font-semibold text-white">{completeMessage}</p>
        </> : <>
            <p className="text-white text-lg font-light tracking-wider">{title}</p>
            <div className="flex">
                {Object.entries(timeLeft).map(([key, value]) => {
                    return <div key={key} className="w-12 flex flex-col items-center text-white">
                        <div className="text-3xl font-bold">{value}</div>
                        <div className="text-sm">{key}</div>
                    </div>
                })}
            </div>
        </>}
    </div>
}