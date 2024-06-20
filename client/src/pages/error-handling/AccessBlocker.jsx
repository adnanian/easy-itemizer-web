import StyledTitle from "../../components/StyledTitle";
import '../../styles/Error.css';

/**
 * Page to redirect a user to when he/she attempts to access a page that is
 * not authorized for him/her.
 * 
 * NOTE: THIS PAGE IS MEANT TO BE RENDERED AND ROUTED TO, WHEN A USER IS NOT LOGGED IN.
 * 
 * @returns a page with a message prohibiting access without logging int.
 */
export default function AccessBlocker() {
    return (
        <div className="error-page">
            <StyledTitle text="401 Permission Denied"/>
            <p>
                You must be logged in in order to access this page.
            </p>
        </div>
    )
}