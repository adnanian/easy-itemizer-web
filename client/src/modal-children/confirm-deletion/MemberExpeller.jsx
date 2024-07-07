import { correctRoute } from "../../helpers";
import DeletionWarning from "./DeletionWarning";

/**
 * Renders a modal view for removing a user from the curent organization.
 * 
 * @param {Object} props
 * @param {Object} props.memberToExpel the member of the organization to remove.
 * @param {Function} props.onDelete the callback function to execute when the membership is deleted from the server.
 * @param {Function} props.onClose the callback function to execute to close the modal.
 * @returns a prompt to confirm the admin's decision to remove a user form the current organization.
 */
export default function MemberExpeller({ memberToExpel, onDelete, onClose }) {

    // console.log(memberToExpel);

    /**
     * Deletes a user's membership from the system, expelling him/her from the
     * organization. Then, closes the modal.
     */
    function handleExpel() {
        fetch(correctRoute(`/memberships/${memberToExpel.id}`), {
            method: "DELETE"
        })
            .then((response) => {
                if (response.ok) {
                    onDelete(memberToExpel);
                    alert(`You removed \'${memberToExpel.user.username}\'.`);
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
            buttonText={<p>Yes, expel <b>{memberToExpel.user.username}</b> from this organization!</p>}
            preventDefault={true}
            onDelete={handleExpel}
            onClose={onClose}
        >
            <p>To proceed, click the yellow button below. Note that the user
                will be notified by email of his/her expulsion.
            </p>
        </DeletionWarning>
    )
}