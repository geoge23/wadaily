export default function TextEntry({title, placeholder, name, type = "text", inlineText, content = "", onChange}) {
    return <div className="mt-2">
        <label htmlFor={name}>{title}</label>
        <div className="rounded-xl border-2 border-gray-300 py-2 px-1 overflow-hidden focus-within:border-gray-400 transition flex">
            {inlineText ? <p className="ml-2">{inlineText}</p> : null}
            <input type={type} onChange={onChange} placeholder={placeholder} className="w-full h-full mx-2 focus:outline-none" name={name} defaultValue={content} />
        </div>
    </div>
}