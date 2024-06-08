import { NavLink } from "react-router-dom";

/**
 * A navigational bar. If there is no user currently logged in, then
 * only the navigational links for the About page and Login page will be 
 * rendered. Otherwise, the header will show a navigational link for
 * the About, Organizations, and Settings page. In addition to this,
 * a navigational link that says "Logout", which redirects the user
 * back to the login page, will be shown.
 * 
 * @param {Object} props 
 * @param {Object} props.user the current user.
 * @param {Function} props.onLogout the callback function to execute to logout of the current user's account.
 * @returns a nav bar.
 */
export default function NavBar({ user, onLogout }) {
    const navLinkClassName = 'nav-link';

    return (
        <nav className="navigation">
            <NavLink
                to="/about"
                className={navLinkClassName}
            >
                About
            </NavLink>
            {
                user ? (
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
                            onClick={onLogout}
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