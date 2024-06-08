import { Link, useLocation } from "react-router-dom";
import StyledTitle from "../../components/StyledTitle";
import '../../styles/Error.css';

/**
 * Page to redirect a user to when a user attempts to naviagte to a URL
 * that does not exist in this application.
 * 
 * NOTE: IF A USER IS LOGGED IN AND ATTEMPTS TO ACCESS AN ORGANIZATION THAT 
 * HE/SHE DOES NOT BELONG TO, THIS PAGE WILL BE DISPLAYED! THIS IS TO PREVENT
 * ANYBODY FROM BREAKING INTO THAT ORGANIZATION REGARDLESS OF WHETHER AN
 * ORGANIZATION OF ENTERED ID ACTUALLY EXISTS OR NOT, THAT INFORMATION WOULD
 * NOT BE ENTIRELY CONFIRMED TO THE UNAUTHORIZED USER.
 * 
 * @returns a page showing that a user has navigated to an invalid route.
 */
export default function ErrorPage() {
    const location = useLocation();
    console.error("Ree! Invalid route: ", location.pathname);
    return (
        <div className="error-page">
            <StyledTitle text="Invalid Route!"/>
            <p>
                The page that you have navigated to does
                not exist.<br/>Please click on the link below to
                navigate back to the home page.
            </p>
            <Link to="/" className="link-button">Back to home page!</Link>
        </div>
    )
}