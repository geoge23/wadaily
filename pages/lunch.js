import { UserContext } from ".";
import Header, { Link } from "../components/Header";
import List from "../components/List";
import ThemeButton from "../components/ThemeButton";
import { validateAndDecodeJwt } from "../functions/jwt"
import getMenuList from "../functions/menuList";
import { User } from "../functions/mongo"
import { useRouter } from "next/dist/client/router";


export default function Lunch(props) {
    const router = useRouter()

    return <UserContext.Provider value={{
        loggedIn: true,
        user: props.user
    }}>
        <Header>
            <Link text={"Return home"} func={() => router.push('/')} />
        </Header>
        <div className="mt-6 flex md:flex-row flex-col justify-between">
            <List content={props.menuList} title="Today's lunch" />
            <div className="md:ml-10">
                <p className="text-xl font-semibold mb-2">What do you think about this lunch?</p>
                <ThemeButton className={"block mb-2 w-full bg-green-800"}>I like it</ThemeButton>
                <ThemeButton className={"block w-full bg-red-400"}>I hate it</ThemeButton>
                <p className="mt-2 text-lg">Others today think</p>
                <div>
                    
                </div>
            </div>
        </div>
    </UserContext.Provider>
}

export async function getServerSideProps(ctx) {
    let user = {};
    if (ctx.req.cookies.jwt) {
        try {
          const { id } = await validateAndDecodeJwt(ctx.req.cookies.jwt)
          const currentUser = (await User.findById(id))
          user = {
            email: currentUser.email,
            meta: currentUser.meta
          }
        } catch (e) {
            ctx.res.writeHead(302, { Location: '/' });
            ctx.res.end();
        }
      }
      const menuList = await getMenuList();
      return {props:{user, menuList}}

}