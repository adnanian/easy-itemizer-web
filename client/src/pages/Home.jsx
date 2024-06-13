import { useContext } from "react";
import StyledTitle from "../components/StyledTitle";
import "../styles/Home.css";
import {UserContext} from "../SuperContext";
import BigText from "../components/BigText";

export default function Home() {
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const welcomeTitle = currentUser ? `Hello, ${currentUser.first_name}! Here Are the Items You Added!`: "Welcome to Easy Itemizer";
    const itemList = currentUser?.items.map((item) => {
        return (
            <li key={item.id}>{item.name}</li>
        )
    });

    return (
        <main id="home-page">
            <StyledTitle text={welcomeTitle}/>
            {currentUser ? (
                <ul>
                    {itemList.length ? itemList : (
                        <BigText id="no-items">
                            <p>You don't have any added items yet. Go to your organizations to add items.</p>
                        </BigText>
                    )}
                </ul>
            ) : <h1>Log in to manage items and organizations!</h1>}
        </main>
    )
}