export default function NewSiteModal() {
    return <div className="fixed z-50 top-0 left-0 h-screen w-screen flex justify-center items-center bg-gray-500 bg-opacity-40">
        <div className="rounded-lg bg-white dark:bg-gray-700 p-5 max-w-lg">
            <p className="text-2xl">We&apos;ve moved! 🎉🎉</p>
            <p className="mb-2">Since we were unable to acquire the original domain, we acquired wadaily.co, the new home of the WADaily site </p>
            <p className="mb-2">You have been automatically redirected, but you should update your bookmarks to avoid seeing this message again</p>
            <p className="mb-2">P.S. - Stay tuned, there&apos;s some cool new tech in the works from the WADaily team! 😁</p>
            <a className="cursor-pointer underline text-blue-500" href="./">Close this dialog</a>
        </div>
    </div>
}