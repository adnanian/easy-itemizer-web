/**
 * 
 * @param {*} param0 
 * @returns 
 */
export default function DeletionWarning({buttonText, preventDefault, onDelete, onClose, children}) {

    function handleSubmit(e) {
        if (preventDefault) {
            e.preventDefault();
        }
        onDelete();
        onClose();
    }

    return (
        <div>
            <h1 className="are-you-sure">&#9888; Are you sure? &#9888;</h1>
            {children}
            <button
                className="confirm-delete-button"
                type="submit"
                onClick={handleSubmit}
            >
                {buttonText}
            </button>
        </div>
    )
}