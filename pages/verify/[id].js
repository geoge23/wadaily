import { LoginEvent } from "../../functions/mongo";
import Head from 'next/head';

const UUIDRegex = /[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12}/

export default function VerifyPage({state, message}) {
    return <div className="flex items-center flex-col">
        <Head><title>✨ Magic Login Link!</title></Head>
        <p className="mt-8 text-9xl mb-5">{state == 'success' ? '✅' : '❌' }</p>
        <p className="text-3xl mb-2">{state == 'success' ? "Login success!" : "There was an error"}</p>
        <p>{message}</p>
        <a className="underline cursor-pointer" onClick={() => close()}>Close Tab</a>
    </div>
}

export async function getServerSideProps({params}) {
    const props = {
        state: 'success',
        message: "Return to your other window to complete sign-in"
    }

    const { id } = params;
    if (id == undefined || !UUIDRegex.test(id)) {
        props.state = 'error'
        props.message = "Missing or invalid ID in URL"
        return {props}
    }

    const loginDoc = await LoginEvent.findOne({id})
    if (loginDoc === null) {
        props.state = 'error'
        props.message = "Supplied ID is expired or nonexistant"
        return {props}
    }

    loginDoc.completed = true;
    await loginDoc.save()

    return {props}
}