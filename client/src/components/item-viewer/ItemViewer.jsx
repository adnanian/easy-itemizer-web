import { useState, useContext } from "react";
import "../../styles/components/ItemViewer.css";
import ItemCardDetail from "./ItemCardDetail";
import ItemList from "./ItemList";
import ItemFilter from "./ItemFilter";
import { ItemContext, SelectedItemContext } from "../../SuperContext";

/**
 * Displays a sub-page of all the public and user-owned items that
 * can be browsed, clicked on, and modified.
 * 
 * @param {Object} props 
 * @param {Object} props.user the current user.
 * @param {Boolean} props.allowEdits if true, then the current user can edit/delete items that he/she added.
 * @returns a directory of all public and owned items.
 */
export default function ItemViewer({ user, allowEdits = false }) {
    const { items, setItems } = useContext(ItemContext);
    const { selectedItem, setSelectedItem } = useContext(SelectedItemContext);
    const [filters, setFilters] = useState({
        text: "",
        userItemsOnly: false
    });

    /**
     * Updates the filters state value according to the type
     * of event.
     * 
     * @param {Event} e the event. 
     */
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

    /**
     * Updates an item element from the item array
     * state.
     * 
     * @param {Object} itemToUpdate the item.
     */
    function updateItem(itemToUpdate) {
        setItems(items.map((item) => {
            return item.id === itemToUpdate.id ? itemToUpdate : item;
        }));
        setSelectedItem(itemToUpdate);
    }

    /**
     * Removes an item element from the item array
     * state.
     * 
     * @param {Object} itemToDelete the item. 
     */
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
                <ItemCardDetail user={user} item={selectedItem} onUpdate={allowEdits ? updateItem : null} onDelete={deleteItem} />
                <div>
                    <ItemFilter filters={filters} onChange={handleChange} />
                    <ItemList user={user} items={items} filters={filters} onSelectItem={setSelectedItem} />
                </div>
            </div>
        </>
    );
};