import { useTitleManager } from "../../helperHooks";

/**
 * Renders a template modal child component for confirming a user's decision to
 * delete a record from the database.
 * 
 * @param {Object} props
 * @param {String} props.buttonText the text to set the delete button to.
 * @param {Boolean} props.preventDefault if true, then when the button is clicked, the page refresh will be prevented.
 * @param {Function} props.onDelete  the callback function to execute when the user clicks on the delete button.
 * @param {Function} props.onClose the callback function to execute to close the modal.
 * @param {Boolean} props.disabled the value to set the button's disabled attribute to. Default value is false.
 * @param {Object} props.children the child elements.
 * 
 * @returns a prompt for the user to confirm record deletion.
 */
export default function DeletionWarning({ buttonText, preventDefault, onDelete, onClose, disabled = false, children }) {
    const titleManager = useTitleManager("Are You Sure?");

    /**
     * Executes the onDelete callback function and closes the modal.
     * Will prevent page refresh is preventDefault is true.
     * 
     * @param {Event} e the event. 
     */
    function handleSubmit(e) {
        titleManager.setLoadingTitle("Deleting...");
        if (preventDefault) {
            e.preventDefault();
        }
        onDelete();
        titleManager.revertToDefault();
        onClose();
    }

    return (
        <div id="deletion-warning">
            <h1 className="are-you-sure">&#9888; {titleManager.title} &#9888;</h1>
            {children}
            <button
                className="confirm-delete-button"
                type="submit"
                onClick={handleSubmit}
                disabled={disabled}
            >
                {buttonText}
            </button>
        </div>
    )
}