import { useState, useContext } from "react";
import "../../styles/components/ItemViewer.css";
import ItemCardDetail from "./ItemCardDetail";
import ItemList from "./ItemList";
import ItemFilter from "./ItemFilter";
import { ItemContext, SelectedItemContext } from "../../SuperContext";

export default function ItemViewer({ user, allowEdits=false }) {
    const { items, setItems } = useContext(ItemContext);
    const {selectedItem, setSelectedItem} = useContext(SelectedItemContext);
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

    function updateItem(itemToUpdate) {
        setItems(items.map((item) => {
            return item.id === itemToUpdate.id ? itemToUpdate : item;
        }));
        setSelectedItem(itemToUpdate);
    }

    function deleteItem(itemToDelete) {
        setItems(items.filter((item) => {
            return item.id !== itemToDelete.id
        }));
        setSelectedItem(null);
    }

    //console.log(filters);

    return (
        <>
            <div id="item-card-container">
                <ItemCardDetail user={user} item={selectedItem} onUpdate={allowEdits ? updateItem : null} onDelete={deleteItem}/>
                <div>
                    <ItemFilter filters={filters} onChange={handleChange}/>
                    <ItemList user={user} items={items} filters={filters} onSelectItem={setSelectedItem}/>
                </div>
            </div>
        </>
    );
};