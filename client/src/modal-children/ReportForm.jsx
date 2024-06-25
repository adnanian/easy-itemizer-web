import { useState } from "react";
import { correctRoute, quickInlineStyles } from "../helpers";

export default function ReportForm({item, onClose}) {
    const [submissionText, setSubmissionText] = useState("");
    const minTextLength = 50;
    const maxTextLength = 5000;

    function handleSubmit(e) {
        e.preventDefault();
        if (!submissionText) {
            alert("You must give your reason(s) for reporting this item!");
        } else if (submissionText.length < minTextLength) {
            alert(`Your report must be at least ${minTextLength} characters!`);
        } else {
            fetch(correctRoute("/report_item"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    item_id: item.id,
                    submission_text: submissionText
                })
            }).then((response) => response.json())
            .then((data) => alert(data.message))
            .finally(() => onClose());
        }
    }

    return (
        <div className="form-div">
            <h1>Report this Item</h1>
            <form onSubmit={handleSubmit}>
                <p>Please provide details that warrants a report:</p>
                <p><strong>MINIMUM OF 50 CHARACTERS</strong></p>
                <textarea
                    rows="8"
                    cols="50"
                    value={submissionText}
                    style={quickInlineStyles.rectangularPad}
                    maxLength={maxTextLength}
                    onChange={(e) => setSubmissionText(e.target.value)}
                >
                </textarea>
                <span>{submissionText.length} / {maxTextLength} characters</span>
                <input type="submit"/>
            </form>
        </div>
    )
}