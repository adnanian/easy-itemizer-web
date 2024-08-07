import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { UserContext } from "../SuperContext";
import { correctRoute } from "../helpers";
import { useTitleManager } from "../helperHooks";

/**
 * Renders a login page.
 * 
 * @returns the login page.
 */
export default function Login() {
    const titleManager = useTitleManager("Login");
    const [formData, setFormData] = useState({
        usernameOrEmail: "",
        password: ""
    });

    const { login } = useContext(UserContext);
    const navigate = useNavigate();

    /**
     * Updates formData state value.
     * 
     * @param {Event} e the event.
     */
    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    /**
     * Attempts to instantiate a session with the user's id.
     * If credentials are valid, the user is verified and NOT banned, 
     * then the user is logged in and is redirected to the Home page.
     * Otherwise, an error message will be displayed saying that the user has entered
     * invalid credentials.
     * 
     * @param {Event} e the event.
     */
    function handleSubmit(e) {
        e.preventDefault();
        titleManager.setLoadingTitle("Logging In...");
        fetch(correctRoute("/login"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username_or_email: formData.usernameOrEmail,
                password: formData.password
            })
        })
            .then((response) => {
                if (response.ok) {
                    return response.json().then((user) => {
                        alert(`Logged In! Welcome, ${user.first_name}!`);
                        login(user);
                        navigate("/");
                    });
                } else {
                    return response.json().then((error) => {
                        console.log(error);
                        throw new Error(error.message);
                    });
                }
            })
            .catch((error) => {
                //debugger
                console.error("Login failed.");
                console.error(error);
                alert(error);
            })
            .finally(() => {
                setFormData((oldFormData) => {
                    const newFormData = { ...oldFormData };
                    newFormData.usernameOrEmail = "";
                    newFormData.password = "";
                    return newFormData;
                });
                titleManager.revertToDefault();
            });
    }

    return (
        <div id="login-div" className="form-div">
            <h1>{titleManager.title}</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username-or-email">Username or Email</label>
                <input
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    type="text"
                    placeholder="Enter your username or email."
                    value={formData.usernameOrEmail}
                    onChange={handleChange}
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password."
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type="submit">Log In</button>
            </form>
            <Link
                id="forgot-password"
                className="link-button"
                to="/forgot-password"
            >
                Forgot Password?
            </Link>
            <Link
                id="signup-instead"
                className="link-button"
                to="/signup"
            >
                Don't have an account? Click here to signup!
            </Link>
        </div>
    )
}