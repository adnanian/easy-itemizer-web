import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MemberRole, correctRoute } from "../../helpers";
import DeletionWarning from "./DeletionWarning";

/**
 * Renders a modal view that displays to the user a message about the consequences
 * of deleting his/her account, and a button to proceed with account deletion.
 * 
 * @param {Object} props 
 * @param {Object} props.user the current user.
 * @param {Function} props.onLogout the callback function to execute after the account has been successfully deleted.
 * @param {Function} props.onClose the callback function to execute to close the modal.
 * @returns a modal view with a confirmation message and a button to confirm deletion.
 */
export default function AccountDeleter({ user, onLogout, onClose }) {
    const ownerships = user.memberships.reduce((accumulator, membership) => {
        return accumulator + (membership.role === MemberRole.OWNER ? 1 : 0);
    }, 0);

    console.log(user);
    console.log(ownerships);

    if (ownerships > 0) {
        const orgGrammaticalForm = ownerships === 1 ? "organization" : "organizations";
        const pronoun = ownerships === 1 ? "it" : "them";
        const adminGrammaticalForm = ownerships === 1 ? "another admin" : "other admins";
        return (
            <div id="delete-account-blocker">
                <p style={{ fontSize: "28px" }}>
                    You currently own {ownerships} {orgGrammaticalForm}. Please delete&nbsp;
                    {pronoun} or transfer {pronoun} to {adminGrammaticalForm}. You won't be
                    able to delete your account until all organizations you own have been
                    either deleted or transferred to other users.
                </p>
            </div>
        );
    }

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    /**
     * Deletes a user and all its information from the server.
     * Then, redirects the current user to login information.
     * 
     * Note: deletion will fail if user enters incorrect password.
     */
    function handleDeleteAccount() {
        fetch(correctRoute("/current_user"), {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password
            })
        })
            .then((response) => {
                if (response.ok) {
                    navigate("/login");
                    onLogout();
                    alert("Your account has been successfully deleted. You will now be redirected to the login page.");
                } else {
                    return response.json().then((data) => {
                        throw new Error(data.message);
                    });
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
            buttonText="Yes, I would like to permanently delete my account!"
            preventDefault={true}
            onDelete={handleDeleteAccount}
            onClose={onClose}
            disabled={!password || password !== confirmPassword}
        >
            <div id="delete-account-form">
                <p>&#9888; Warning! Deleting your account will delete all data associated with
                    it and <strong>this CANNOT be undone</strong>! By clicking the yellow button below,
                    you agree to these terms and conditions and will not press charges against
                    &#0169; Easy Itemizer for such matters.
                </p>
                <label htmlFor="password">Enter your password: </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="confirmPassword">Confirm password: </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
        </DeletionWarning>
    )
}