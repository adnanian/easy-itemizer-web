import { useState } from "react";
import { useTitleManager } from "../helperHooks";
import { useNavigate } from "react-router-dom";
import { correctRoute } from "../helpers";
import "../styles/ForgotPassword.css";

/**
 * Renders a form for a user to enter the email associated
 * with the account whose password he/she forgot.
 * 
 * Entering a valid email will send the user a link to
 * reset his/her password.
 * 
 * @returns a form to enter a user's email.
 */
export default function ForgotPassword() {
    const titleManager = useTitleManager("Get Password Reset Link");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    /**
     * Makes a POST request to the server with the entered email. If that email
     * is valid, then an email will be sent to the user for instructions, and 
     * the alert message will display that the request was successful. Otherwise,
     * an error will be thrown.
     * 
     * @param {Event} e the event.
     */
    function handleSubmit(e) {
        e.preventDefault();
        titleManager.setLoadingTitle("Sending Email...");
        fetch(correctRoute("/forgot_password"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        })
            .then((response) => {
                if (response.ok) {
                    alert("Email has successfully been sent.")
                    navigate("/login");
                } else {
                    return response.json().then((error) => {
                        throw new Error(error.message);
                    })
                }
            })
            .catch((error) => {
                console.error(error);
                alert(error);
            })
            .finally(() => {
                titleManager.revertToDefault();
                setEmail("");
            });
    }

    return (
        <div id="forgot-password-div" className="form-div">
            <h1>{titleManager.title}</h1>
            <form onSubmit={handleSubmit}>
                <p>Enter your email below to have a password reset link sent to you.</p>
                <label htmlFor="email">Email: </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}