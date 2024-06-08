import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../UserContext";

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

    const {currentUser, setCurrentUser} = useContext(UserContext);

    return (
        <nav className="navigation">
            <NavLink
                to="/about"
                className={navLinkClassName}
            >
                About
            </NavLink>
            {
                currentUser ? (
                    <>
                        <NavLink
                            to={"/organizations"}
                            className={navLinkClassName}
                        >
                            Organizations
                        </NavLink>
                        <NavLink
                            to="/settings"
                            className={navLinkClassName}
                        >
                            Settings
                        </NavLink>
                        <NavLink
                            to="/login"
                            className={navLinkClassName}
                            onClick={() => setCurrentUser(null)}
                        >
                            Logout
                        </NavLink>
                    </>
                ) : (
                    <NavLink
                        to="/login"
                        className={navLinkClassName}
                    >
                        Login
                    </NavLink>
                )
            }
        </nav>
    );
}