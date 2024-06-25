import { correctRoute } from "../../helpers";
import DeletionWarning from "./DeletionWarning";

export default function ItemRemover({item, onDelete, onClose}) {

    function handleDeleteItem() {
        fetch(correctRoute(`/items/${item.id}`), {
            method: "DELETE"
        })
        .then((response) => {
            if (response.ok) {
                onDelete(item);
                alert("Item successfully removed from the system.");
            } else {
                throw new Error("An internal error occurred. Please contact support!");
            }
        })
        .catch((error) => {
            console.error(error);
            alert(error);
        })
        .finally(() => onClose());
    }

    return (
        <DeletionWarning
            buttonText={<p>Yes, delete item: <b>{item.name}</b>!</p>}
            preventDefault={true}
            onDelete={handleDeleteItem}
            onClose={onClose}
        >
            <p>
                &#9888; Warning! Deleting an item from the system will also
                remove all its assignments to organiations, and this cannot
                be undone! However, a log will be sent to each organization
                using this item with its name, part number, and their 
                inventory information at the time of deletion. By clicking
                the yellow button below, you agree to the terms and conditions
                and will not press charges against Easy Itemizer for such
                reasons.
            </p>
        </DeletionWarning>
    )
}