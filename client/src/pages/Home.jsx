import { useContext } from "react";
import StyledTitle from "../components/StyledTitle";
import "../styles/Home.css";
import { ItemContext, UserContext } from "../SuperContext";
import ItemList from "../components/items/ItemList";

export default function Home() {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const { items, setItems } = useContext(ItemContext);
    

    const welcomeTitle = currentUser ? `Hello, ${currentUser.first_name}!` : "Welcome to Easy Itemizer";
    

    return (
        <main id="home-page">
            <StyledTitle text={welcomeTitle} />
            {currentUser ? (
                <ItemList user={currentUser} items={items}/>
            ) : <h1>Log in to manage items and organizations!</h1>}
        </main>
    )
}