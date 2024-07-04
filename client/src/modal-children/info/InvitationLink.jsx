export default function InvitationLink({orgName, link}) {

    /**
     * Article of reference: https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
     */
    function copyLink() {
        navigator.clipboard.writeText(link);
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
            />
            <button onClick={copyLink}>Copy</button>
        </div>
    )
}