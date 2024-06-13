import { useContext, useState } from "react";
import StyledTitle from "../components/StyledTitle";
import "../styles/Home.css";
import { ItemContext, UserContext } from "../SuperContext";
import BigText from "../components/BigText";

export default function Home() {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const { items, setItems } = useContext(ItemContext);
    const [filters, setFilters] = useState({
        text: "",
        userItemsOnly: false
    });

    const filteredItems = () => {
        if (filters.text === "" && !filters.userItemsOnly) {
            return items;
        } else {
            return items.filter((item) => {
                return (filters.text === "" ? true : item.name.toLowerCase().includes(filters.text.toLowerCase())) && (!filters.userItemsOnly ? true : item.user_id === currentUser.id);
            });
        }
    }

    const welcomeTitle = currentUser ? `Hello, ${currentUser.first_name}! Here Are the Items You Added!` : "Welcome to Easy Itemizer";
    const itemList = filteredItems()?.map((item) => {
        return (
            <li key={item.id}>{item.name}</li>
        )
    });

    function handleChange(e) {
        if (e.target.type === "text") {
            setFilters({
                ...filters,
                text: e.target.value
            });
        } else if (e.target.type === "checkbox") {
            setFilters({
                ...filters,
                userItemsOnly: e.target.checked
            });
        } else {
            throw new Error("Invalid input detected.");
        }
    }

    return (
        <main id="home-page">
            <StyledTitle text={welcomeTitle} />
            {currentUser ? (
                <>
                    <div>
                        <label htmlFor="showUserItemsOnly">Show My Items Only</label>
                        <input 
                            id="showUserItemsOnly"
                            name="showUserItemsOnly"
                            type="checkbox"
                            checked={filters.userItemsOnly}
                            onChange={handleChange}
                        />
                        <label htmlFor="filterText">Filter Text</label>
                        <input
                            id="filterText"
                            name="filterText"
                            type="text"
                            value={filters.text}
                            onChange={handleChange}
                        />
                    </div>
                    <ul>
                        {itemList || (
                            <BigText id="no-items">
                                <p>You don't have any added items yet. Go to your organizations to add items.</p>
                            </BigText>
                        )}
                    </ul>
                </>
            ) : <h1>Log in to manage items and organizations!</h1>}
        </main>
    )
}