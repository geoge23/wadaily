import { useContext } from "react";
import { UserContext } from "../pages";
import Modal from "./Modal";

export default function AccountModal({close}) {
    const ctx = useContext(UserContext)

    return <Modal>
        <div className="flex justify-between">
            <p>Account:</p>
            <a onClick={close} className="underline cursor-pointer">x</a>
        </div>
        <p className="text-xl">{ctx.user.email}</p>
        <p className="mt-2">Relevant Links</p>
        <Link>Account Preferences</Link>
        <Link>Admin Panel</Link>
        <p className="mt-4 text-center text-gray-500">Thanks for using WADaily! ☕</p>
    </Modal>
}

function Link({children}) {
    return <a className="underline cursor-pointer block">{children}</a>
}