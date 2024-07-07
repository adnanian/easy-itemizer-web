import { useNavigate } from "react-router-dom";
import DeletionWarning from "./DeletionWarning";
import { correctRoute } from "../../helpers";

/**
 * Creates a modal that displays information to an owner, seeking to delete
 * an organization, on the consequences of the action that he/she would like
 * to take. If the user would like to proceed, then there is a button to click
 * that would delete an organization.
 * 
 * @param {Object} props 
 * @param {Number} props.orgId the id of the organization to delete.
 * @param {String} props.orgName the name of the organization to delete.
 * @param {Function} props.onLeave the callback function to execute to remove the organization/membership information from the current user.
 * @param {Function} props.onClose  the callback function to execute to close the modal.
 * @returns a modal view asking the user to confirm organization deletion.
 */
export default function OrgDeleter({ orgId, orgName, onLeave, onClose }) {
    const navigate = useNavigate();

    /**
     * Deletes an organization and all its data from the server.
     * Then navigates the user back to the organizations page.
     * The deleted organization would no longer show on that page.
     */
    function handleDeletion() {
        fetch(correctRoute(`/organizations/${orgId}`), {
            method: "DELETE"
        })
            .then((response) => {
                if (response.ok) {
                    onLeave();
                    alert(`${orgName} has been deleted.`);
                    navigate("/my-organizations");
                } else {
                    throw new Error("An internal error occurred. Please contact support.");
                }
            })
            .catch((error) => {
                alert(error);
            })
            .finally(() => onClose());
    }

    return (
        <DeletionWarning
            buttonText={<p>Yes, I would like to permanently delete&nbsp;<b>{orgName}</b>!</p>}
            preventDefault={false}
            onDelete={handleDeletion}
            onClose={onClose}
        >
            <p>&#9888; Warning! Deleting an organization will delete all data associated with
                it and <strong>this CANNOT be undone</strong>! By clicking the yellow button below,
                you agree to these terms and conditions and will not press charges against
                &#0169; Easy Itemizer for such matters.
            </p>
        </DeletionWarning>
    )
}