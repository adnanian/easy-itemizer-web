import { useState } from "react";
import { quickInlineStyles } from "../helpers";

export default function ReportForm({item}) {
    const [submissionText, setSubmissionText] = useState(null);

    function handleSubmit(e) {
        e.preventDefault();
    }

    return (
        <div className="form-div">
            <form onSubmit={handleSubmit}>
                <textarea
                    rows="8"
                    cols="50"
                    value={submissionText}
                    style={quickInlineStyles.rectangularPad}
                >
                </textarea>
                <input type="submit"/>
            </form>
        </div>
    )
}