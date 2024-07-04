import { useState } from "react";
import { useTitleManager } from "../helperHooks";
import { useNavigate } from "react-router-dom";
import {correctRoute} from "../helpers";
import "../styles/ForgotPassword.css";

export default function ForgotPassword() {
    const titleManager = useTitleManager("Get Reset Password Link");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        titleManager.setLoadingTitle("Sending Email...");
        fetch (correctRoute("/forgot_password"), {
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