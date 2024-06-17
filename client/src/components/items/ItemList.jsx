import { useState } from "react";
import BigText from "../BigText";
import "../../styles/components/ItemList.css";
import ItemCard from "./ItemCard";
import Grid from "../Grid";

export default function ItemList( {user, items} ) {
    const [filters, setFilters] = useState({
        text: "",
        userItemsOnly: false
    });

    const filteredItems = () => {
        if (filters.text === "" && !filters.userItemsOnly) {
            return items;
        } else {
            return items.filter((item) => {
                return (filters.text === "" ? true : item.name.toLowerCase().includes(filters.text.toLowerCase())) && (!filters.userItemsOnly ? true : item.user_id === user.id);
            });
        }
    };

    const itemCards = filteredItems()?.map((item) => {
        return (
            <li key={item.id}>
                <ItemCard  item={item}/>
            </li>
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
        <>
            <BigText>
                <p>Browse Items!</p>
            </BigText>
            <div id="item-search">
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
            {
                itemCards ? (
                    <Grid blockId="item-list-container" intermediate={undefined}>
                        <ul id="item-list" className="grid">
                            {itemCards}
                        </ul>
                    </Grid>
                ) : (
                    <BigText id="no-items">
                        <p>No items found.</p>
                    </BigText>
                )
            }
        </>
    );
};