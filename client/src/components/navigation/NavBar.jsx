import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../SuperContext";
import { useScreenSize } from "../../helperHooks";

/**
 * A navigational bar. If there is no user currently logged in, then
 * only the navigational links for the About page and Login page will be 
 * rendered. Otherwise, the header will show a navigational link for
 * the About, Organizations, and Settings page. In addition to this,
 * a navigational link that says "Logout", which redirects the user
 * back to the login page, will be shown.
 * 
 * @returns a nav bar.
 */
export default function NavBar() {
    const navLinkClassName = 'nav-link';

    const {currentUser, logout} = useContext(UserContext);
    const {scaleByWidth, scaleByHeight, scaleByRatio} = useScreenSize();
    // console.log(currentUser);

    const navigationStyling = {
        marginRight: scaleByWidth(100, 'px')
    }

    const linkStyling = {
        padding: `0 ${scaleByWidth(40, 'px')}`,
        margin: `${scaleByHeight(5,'px')} ${scaleByWidth(30, 'px')}`,
        fontSize: scaleByRatio(40, 'px')
    };

    return (
        <nav className="navigation" style={navigationStyling}>
            <NavLink
                to="/about"
                className={navLinkClassName}
                style={linkStyling}
            >
                About
            </NavLink>
            {
                currentUser ? (
                    <>
                        <NavLink
                            to={"/organizations"}
                            className={navLinkClassName}
                            style={linkStyling}
                        >
                            Organizations
                        </NavLink>
                        <NavLink
                            to="/settings"
                            className={navLinkClassName}
                            style={linkStyling}
                        >
                            Settings
                        </NavLink>
                        <NavLink
                            to="/login"
                            className={navLinkClassName}
                            onClick={logout}
                            style={linkStyling}
                        >
                            Logout
                        </NavLink>
                    </>
                ) : (
                    <NavLink
                        to="/login"
                        className={navLinkClassName}
                        style={linkStyling}
                    >
                        Login
                    </NavLink>
                )
            }
        </nav>
    );
}