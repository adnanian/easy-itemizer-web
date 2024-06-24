import { useContext } from "react";
import StyledTitle from "../components/StyledTitle";
import "../styles/Home.css";
import { UserContext } from "../SuperContext";
import ItemViewer from "../components/item-viewer/ItemViewer";

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
            ) : <h1 id="login-prompt">Log in to manage items and organizations!</h1>}
        </div>
    )
}