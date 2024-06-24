import ItemViewer from "../../components/item-viewer/ItemViewer"

/**
 * Creates a radio-selected view inside the item modal form,
 * where a user can add an existing item from the system not yet being
 * used by the user's organization.
 * 
 * @param {Object} param0 
 * @param {Array} param0.items all items not yet in the organizaiton.
 * @param {Function} param0.onAdd the callback function to execute when an item is added.
 * @returns a view allowing users to select an item to add.
 */
export default function ExistingItemForm({orgId, user, onAdd}) {
    return <ItemViewer user={user}/>
}