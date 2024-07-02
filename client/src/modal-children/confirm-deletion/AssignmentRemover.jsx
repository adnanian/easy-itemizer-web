import { correctRoute } from "../../helpers";
import DeletionWarning from "./DeletionWarning";

export default function AssignmentRemover({assignment, onDelete, onClose}) {

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