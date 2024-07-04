import { useTitleManager } from "../../helperHooks";

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export default function DeletionWarning({buttonText, preventDefault, onDelete, onClose, disabled = false, children}) {
    const titleManager = useTitleManager("Are You Sure?");

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
        <div>
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