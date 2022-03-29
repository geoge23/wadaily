export default function RadioSelector({options, state, setState}) {
    return <div className="flex mb-3">
      {options.map(e => 
        <p key={e} className={`mr-3 text-lg cursor-pointer ${state == e ? "font-bold text-red-900" : null}`}
            onClick={() => setState(e)}>
          {e}
        </p>
      )}
    </div>;
  }