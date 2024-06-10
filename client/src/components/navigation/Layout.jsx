import { Link, Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import "../../styles/Layout.css";
export default function Layout() {
    return (
        <>
            <header>
                <Link id="site-logo" to="/">
                    <div className="logo">
                        <img className="logo" src="/easy-itemizer-logo.jpg"/>
                        <span className="logo">EASY ITEMIZER</span>
                    </div>
                </Link>
                <NavBar/>
            </header>
            <Outlet/>
            <footer><b>&#169; 2024 #EASY_ITEMIZER</b></footer>
        </>
    )
}