import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MemberRole, correctRoute } from "../../helpers";
import DeletionWarning from "./DeletionWarning";

export default function ConfirmLeave({ userMember, admins, onLeave, onClose }) {
    if (userMember.role === MemberRole.OWNER && !admins.length) {
        <div>
            <h1>Unable to Leave Organization</h1>
            <p>
                You are the current owner of this organization, and there
                are currently no admins managing it alongside you. In order
                to leave, you first need to promote at least one member from
                &nbsp;<em>{MemberRole.REGULAR}</em> to <em>{MemberRole.ADMIN}</em>.
            </p>
        </div>
    }

    // Member Id's of admin's.
    const [selectedAdmin, setSelectedAdmin] = useState("");
    // Once you leave, you are navigated to home page.
    const navigate = useNavigate()

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
    * @param {*} e the event.
    */
    function handleChange(e) {
        setSelectedAdmin(e.target.value);
    }

    function handleLeave() {
        const route = correctRoute(
            !selectedAdmin ? `/memberships/${userMember.id}` : `/transfer_ownership/${userMember.organization_id}`
        );
        const body = !selectedAdmin ? null : JSON.stringify({ admin_id: selectedAdmin });
        fetch(route, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        })
            .then((response) => {
                if (response.ok) {
                    onLeave();
                    navigate(-1);
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
            buttonText="Yes, I want to leave this organization!"
            preventDefault={false}
            onDelete={handleLeave}
            onClose={onClose}
            disabled={!selectedAdmin && userMember.role === MemberRole.OWNER}
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