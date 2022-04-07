export default function RadioSelector({options, state, setState, className}) {
    return <div className={`flex mb-3 ${className}`}>
      {options.map(e => 
        <p key={e} className={`mr-3 text-lg cursor-pointer ${state == e ? "font-bold text-red-900 dark:text-red-600" : "text-gray-600 dark:text-gray-400"}`}
            onClick={() => setState(e)}>
          {e}
        </p>
      )}
    </div>;
  }