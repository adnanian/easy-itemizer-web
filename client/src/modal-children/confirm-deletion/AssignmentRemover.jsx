import { correctRoute } from "../../helpers";
import DeletionWarning from "./DeletionWarning";

/**
 * Renders a modal view for deleting an item from the organization.
 * Note: Submitting will only remove the item from the organization. 
 * The item itself will still be saved into the global system.
 * 
 * 
 * @param {Object} props
 * @param {Object} props.assignment the assignment to remove.
 * @param {Function} props.onDelete the callback function to execute after deleting the assigned item from the server.
 * @param {Function} props.onClose the callback function to execute to close the modal.
 * @returns a prompt to confirm the user's decision to delete an assigned item.
 */
export default function AssignmentRemover({ assignment, onDelete, onClose }) {

    /**
     * Deletes an item assignment from an organization.
     * Then, closes the modal.
     */
    function handleDeleteAssignment() {
        fetch(correctRoute(`/assignments/${assignment.id}`), {
            method: "DELETE"
        })
            .then((response) => {
                if (response.ok) {
                    onDelete(assignment);
                    alert("Item successully removed from your organization.");
                } else {
                    throw new Error("An internal error occurred. Please contact support.");
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
            buttonText={<p>Yes, delete <b>{assignment.item.name}</b> from this organization!</p>}
            preventDefault={true}
            onDelete={handleDeleteAssignment}
            onClose={onClose}
        >
            <p>&#9888; Warning! Deleting an item from the organization
                cannot be undone! To proceed with deletion, click on the
                yellow button below.
            </p>
            {assignment.item.is_public ? null : (
                <p><b>This item is made private by the user who added it, so you
                    won't be able to add this item back to your organization,
                    unless either that user changes its visibility to public,
                    or that user belongs to your organization and re-adds it
                    him/her self.</b>
                </p>
            )}
        </DeletionWarning>
    )
}