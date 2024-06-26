import { Link, Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import "../../styles/components/Layout.css";
import { useScreenSize } from "../../helperHooks";
export default function Layout() {
    const {scaleByWidth, scaleByHeight, scaleByRatio} = useScreenSize();

    const headerSizing = {
        fontSize: scaleByRatio(40, 'px')
    };

    const siteLogoSizing = {
        margin: `0 ${scaleByWidth(30, 'px')}`
    };

    const logoSizing = {
        width: scaleByWidth(80, 'px'),
        height: scaleByHeight(40, 'px')
    }

    const logoDivSizing = {
        margin: `0 ${scaleByHeight(5, 'px')}`,
        fontSize: `${scaleByRatio(40, 'px')}`,
        padding: `0 ${scaleByWidth(15, 'px')} 0`
    }

    // console.log(logoDivSizing);
    // console.log(logoSizing);

    return (
        <>
            <header style={headerSizing}>
                <Link id="site-logo" to="/" style={siteLogoSizing}>
                    <div className="logo" style={logoDivSizing}>
                        <img 
                            className="logo" 
                            src="/easy-itemizer-logo.jpg"
                            style={{...logoSizing, ...logoDivSizing}}
                        />
                        <span className="logo">EASY ITEMIZER</span>
                    </div>
                </Link>
                <NavBar/>
            </header>
            <main><Outlet/></main>
            <footer><b>&#169; 2024 #EASY_ITEMIZER</b></footer>
        </>
    )
}