import { useState } from "react";
import { quickInlineStyles } from "../helpers";

export default function ContactForm({onClose}) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        inquiry: ""
    });

    const minTextLength = 50;
    const maxTextLength = 5000;

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
    }

    return (
        <div className="form-div">
            <h1>Contact Us</h1>
            <form onSubmit={handleSubmit}>
                <p>Please contact us here for any inquiries.</p>
                <p>Enter the information below.</p>
                <label htmlFor="cfname">First Name</label>
                <input
                    id="cfname"
                    name="cfname"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="clname">Last Name</label>
                <input
                    id="clname"
                    name="clname"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="cmessage">Message</label>
                <textarea
                    id="cmessage"
                    name="cmessage"
                    rows="8"
                    cols="50"
                    value={formData.inquiry}
                    style={quickInlineStyles.rectangularPad}
                    maxLength={maxTextLength}
                    onChange={handleChange}
                >
                </textarea>
                <span>{formData.inquiry.length} / {maxTextLength} characters</span>
                <input type="submit"/>
            </form>
        </div>
    )
}