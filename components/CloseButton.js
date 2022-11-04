export default function CloseButton({onClick}) {
    return (<p className="absolute top-3 right-4 cursor-pointer text-2xl" onClick={onClick}>x</p>);
}