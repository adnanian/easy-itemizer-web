import { useState } from "react";
import { correctRoute, quickInlineStyles } from "../helpers";

/**
 * Renders a modal form to send Easy Itemizer support a message.
 * 
 * @param {Object} props
 * @param {Function} props.onClose the callback function to execute to close the modal.
 * @returns a form to contact Easy Itemizer Support.
 */
export default function ContactForm({ onClose }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        inquiry: ""
    });

    const minTextLength = 50;
    const maxTextLength = 5000;

    /**
     * Validates that the user has filled out all needed information in the form.
     * 
     * @returns true, if the form is incomplete, false otherwise.
     */
    const formIncomplete = () => {
        for (const key in formData) {
            if (key === "inquiry" && formData[key].length < minTextLength) {
                return true;
            } else if (!formData[key]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Updates the formData state value.
     * 
     * @param {Event} e the event. 
     */
    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    /**
     * Makes a request to the server to send an email to Easy Itemizer Support
     * with the filled out information. Then closes the modal.
     * 
     * @param {Event} e the event. 
     */
    function handleSubmit(e) {
        e.preventDefault();
        fetch(correctRoute("/contact"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then((response) => {
                if (response.ok) {
                    alert("Thank you for contacting us. We will process your request and get back to you as soon as possible.");
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

    const isIncomplete = formIncomplete();

    return (
        <div className="form-div">
            <h1>Contact Us</h1>
            <form onSubmit={handleSubmit}>
                <p>Please contact us here for any inquiries.</p>
                <p>Enter the information below.</p>
                <label htmlFor="cfname">First Name</label>
                <input
                    id="cfname"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="clname">Last Name</label>
                <input
                    id="clname"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="cemail">Email</label>
                <input
                    id="cemail"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="cmessage">Message</label>
                <textarea
                    id="cmessage"
                    name="inquiry"
                    rows="8"
                    cols="50"
                    value={formData.inquiry}
                    style={quickInlineStyles.rectangularPad}
                    maxLength={maxTextLength}
                    onChange={handleChange}
                    placeholder="Type your message here. Must be at least 50 characters."
                >
                </textarea>
                <span>{formData.inquiry.length} / {maxTextLength} characters</span>
                <button
                    type="submit"
                    disabled={isIncomplete}
                >
                    Submit
                </button>
            </form>
        </div>
    )
}