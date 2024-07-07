import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MemberRole, correctRoute } from "../../helpers";
import DeletionWarning from "./DeletionWarning";

/**
 * Renders a modal view prompting a user to confirm his/her decision to leave
 * an organization. If the user leaving is the owner, then he/she will be
 * prompted to transfer ownership to an admin. If there are no admins in the
 * organization, then the owner could not leave until another member is promoted
 * from REGULAR to admin.
 * 
 * @param {Object} props 
 * @param {Object} param0.userMember the user requesting to leave.
 * @param {Array} param0.admins the admins of the organization to leave.
 * @param {Function} param0.onUpdate the callback function to execute when the user has left.
 * @param {Function} param0.onClose the callback function to execute to close the modal.
 * @returns the modal view prompting the user to confirm the decision to leave the organization.
 */
export default function ConfirmLeave({ userMember, admins, onLeave, onClose }) {
    if (userMember.role === MemberRole.OWNER && !admins.length) {
        return (
            <div style={{ width: '400px' }}>
                <h1>Unable to Leave Organization</h1>
                <p>
                    You are the current owner of this organization, and there
                    are currently no admins managing it alongside you. In order
                    to leave, you first need to promote at least one member from
                    &nbsp;<em>{MemberRole.REGULAR}</em> to <em>{MemberRole.ADMIN}</em>.
                </p>
            </div>
        );
    }

    // Member Id's of admin's.
    const [selectedAdminId, setSelectedAdminId] = useState("");
    // Once you leave, you are navigated to memberships page.
    const navigate = useNavigate();

    const adminOptions = admins?.map((admin) => {
        return (
            <option key={admin.id} value={admin.id}>
                {admin.user.first_name} {admin.user.last_name} - {admin.user.username}
            </option>
        )
    });

    /**
    * Sets the selectedAdmin's state value to the value of the selected opetion.
    * 
    * @param {Event} e the event.
    */
    function handleChange(e) {
        setSelectedAdminId(e.target.value);
    }

    /**
     * Deletes the user's membership from the organization from the server side.
     * Then, if the deleted membership was the owner, sets the new owner to the
     * admin that the owner selected, retrieved from selectedAdminId.
     * Finally, closes the modal, and redirects the user to the memberships page.
     */
    function handleLeave() {
        const route = correctRoute(
            !selectedAdminId ? `/memberships/${userMember.id}` : `/transfer_ownership/${userMember.organization_id}`
        );
        const method = !selectedAdminId ? "DELETE" : "PATCH";
        const body = !selectedAdminId ? null : JSON.stringify({ admin_id: selectedAdminId });
        fetch(route, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        })
            .then((response) => {
                if (response.ok) {
                    onLeave();
                    navigate("/my-organizations");
                } else {
                    return response.json().then((error) => {
                        console.error(error);
                        throw new Error("An internal error occurred. Please contact support.");
                    })
                }
            })
            .catch((error) => {
                alert(error);
            })
            .finally(() => onClose());
    }

    return (
        <DeletionWarning
            buttonText="Yes, I want to leave this organization!"
            preventDefault={false}
            onDelete={handleLeave}
            onClose={onClose}
            disabled={!selectedAdminId && userMember.role === MemberRole.OWNER}
        >
            <p><strong>Click the yellow button below to leave the organization.</strong></p>
            {
                userMember.role !== "OWNER" ? null :
                    (
                        <>
                            <p>
                                You are the current owner of this organization.
                                In order to leave, you must transfer ownership to
                                an ADMIN. Please select an ADMIN from the drop-down
                                list below.
                            </p>
                            <select onChange={handleChange}>
                                <option key="None" value={""}>Select an ADMIN</option>
                                {adminOptions}
                            </select>
                        </>
                    )
            }
        </DeletionWarning>
    );
}