import { useState } from "react";
import "../../styles/components/ItemViewer.css";
import ItemCardDetail from "./ItemCardDetail";
import ItemList from "./ItemList";
import ItemFilter from "./ItemFilter";

export default function ItemViewer({ user, items }) {
    const [selectedItem, setSelctedItem] = useState(null);
    const [filters, setFilters] = useState({
        text: "",
        userItemsOnly: false
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

    //console.log(filters);

    return (
        <>
            <div id="item-card-container">
                <ItemCardDetail user={user} item={selectedItem}/>
                <div>
                    <ItemFilter filters={filters} onChange={handleChange}/>
                    <ItemList user={user} items={items} filters={filters} onSelectItem={setSelctedItem}/>
                </div>
            </div>
        </>
    );
};