import { useContext } from "react";
import StyledTitle from "../components/StyledTitle";
import "../styles/Home.css";
import { UserContext } from "../SuperContext";
import ItemViewer from "../components/item-viewer/ItemViewer";

/**
 * The first page that a user sees, whether logged in or not.
 * If the user is logged in, the user will see all the items in the 
 * system and the ReportForm, along with all the navigational links.
 * 
 * Otherwise, a welcome message will be displayed on this page instead.
 * 
 * 
 * @returns the home page.
 */
export default function Home() {
    const { currentUser } = useContext(UserContext);

    const welcomeTitle = currentUser ? "Browse Items" : "Welcome to Easy Itemizer";
    
    return (
        <div id="home-page">
            <StyledTitle text={welcomeTitle} />
            {currentUser ? (
                <ItemViewer 
                    user={currentUser}
                    allowEdits={true}
                />
            ) : (
                <>
                    <h1 id="login-prompt">Log in to manage items and organizations!</h1>
                    <h1 style={{
                        backgroundColor: "red",
                        padding: "25px",
                        width: "fit-content",
                        marginTop: "25px"
                    }}>
                        Note: This website is currently in development and testing and is not
                        yet ready for official use.
                    </h1>
                </>
            )
            }
        </div>
    )
}