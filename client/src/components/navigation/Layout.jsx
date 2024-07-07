import { Link, Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import "../../styles/components/Layout.css";
import { useModalManager, useScreenSize } from "../../helperHooks";
import ContactForm from "../../modal-children/ContactForm";

/**
 * The header and the component tied to the route clicked.
 * The header contains all the navigational links and whatever page the user is currently viewing.
 * The page viewed is being rendered with an outlet context.
 * Also includes a footer, that needs further development.
 * Note: the home link is rendered DIRECTLY under the header element instead of in the NavBar component.
 * 
 * @returns the navigatinal header and the outlet page (the current page).
 */
export default function Layout() {
    const modalManager = useModalManager();
    const { scaleByWidth, scaleByHeight, scaleByRatio } = useScreenSize();

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

    /**
     * Displays the contact form modal.
     */
    function openContactForm() {
        modalManager.showView(<ContactForm onClose={modalManager.clearView} />)
    }

    return (
        <>
            <header style={headerSizing}>
                <Link
                    id="site-logo"
                    to="/" style={siteLogoSizing}
                    title="Home page."
                >
                    <div className="logo" style={logoDivSizing}>
                        <img
                            className="logo"
                            src="/easy-itemizer-logo.jpg"
                            style={{ ...logoSizing, ...logoDivSizing }}
                        />
                        <span className="logo">EASY ITEMIZER</span>
                    </div>
                </Link>
                <NavBar />
            </header>
            <main><Outlet /></main>
            <footer>
                <b id="copyright">&#169; 2024 #EASY_ITEMIZER</b>
                <button id="contact-button" onClick={openContactForm}>CONTACT SUPPORT</button>
            </footer>
            {modalManager.modal}
        </>
    )
}