export default function NoSchool() {
    return <div className="w-full flex flex-col items-center">
        <img src="./booked.svg" alt="No school today" className="h-40" />
        <p className="text-3xl mt-2 font-semibold">No school today!</p>
        <p>Enjoy your break or use the arrows to navigate to the next day</p>
        <p>If you think this is a mistake, click <a className="underline cursor-pointer" href="https://forms.gle/Cu7EjdmzA8BeM4yb8">here</a> to report</p>
        <br></br>
    </div>
}