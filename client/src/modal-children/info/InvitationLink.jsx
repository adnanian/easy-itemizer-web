/**
 * Renders a modal view of the generated invitation link
 * and a button to copy it to your system's clipboard.
 * 
 * @param {Object} props
 * @param {String} props.orgName the name of the organization.
 * @param {String} props.link the link to submit a request to join the organization.
 * @param {Function} props.onClose the callback function to execute to close the modal.
 * @returns a prompt to copy the invitation link.
 */
export default function InvitationLink({ orgName, link, onClose }) {

    /**
     * Copies the link to the system's clipboard and closes the modal.
     * 
     * Article of reference: https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
     */
    function copyLink() {
        navigator.clipboard.writeText(link);
        alert("Share link copied.");
        onClose();
    }

    return (
        <div className="form-div">
            <h1>Invitation Link for <em>{orgName}</em></h1>
            <label htmlFor="orgLink">Link</label>
            <p>Copy the link to share it with others.</p>
            <input
                id="orgLink"
                name="orgLink"
                type="text"
                value={link}
                readOnly
            />
            <button onClick={copyLink}>Copy</button>
        </div>
    )
}