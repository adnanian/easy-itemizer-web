import { Link, Outlet } from "react-router-dom";
import NavBar from "./NavBar";
export default function Layout() {
    return (
        <>
            <header>
                <Link className="site-logo" to="/">#EASY_ITEMIZER</Link>
                <NavBar/>
            </header>
            <Outlet/>
            <footer><b>&#169; 2024 #EASY_ITEMIZER</b></footer>
        </>
    )
}