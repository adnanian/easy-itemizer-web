import { placeholderImages, quickInlineStyles, dtStringToSystemTimeZone } from "../../helpers";
import "../../styles/components/ItemCardDetail.css";
import BigText from "../BigText";
import { useModalManager, useScreenSize } from "../../helperHooks";
import EditItemForm from "../../modal-children/EditItemForm";
import ReportForm from "../../modal-children/ReportForm";
import ItemRemover from "../../modal-children/confirm-deletion/ItemRemover";

/**
 * Displays all of a selected item's information.
 * 
 * @param {Object} props
 * @param {Object} props.user the current user.
 * @param {Object} props.item the currently selected item.
 * @param {Function} props.onUpdate the callback function to execute after making a PATCH request to update an item resource.
 * @param {Function} props.onDelete the callback function to execute after making a DELETE request to delete an item resource. 
 * @returns a card containing an item's details.
 */
export default function ItemCardDetail({ user, item, onUpdate, onDelete }) {
    // console.log(item);

    const modalManager = useModalManager();
    const { scaleByWidth, scaleByHeight, scaleByRatio } = useScreenSize();

    if (!item) {
        return <BigText><p>Click on an item to view more details!</p></BigText>
    }

    const username = item.user_id === user.id ? "You" : item.user.username;
    const isPublic = item.is_public ? "Public" : "Private";

    const ButtonId = Object.freeze({
        EDIT_ITEM: "edit-item-button",
        DELETE_ITEM: "delete-item-button",
        REPORT: "report-button"
    });

    const modalOpeners = {
        [ButtonId.EDIT_ITEM]: <EditItemForm item={item} onUpdate={onUpdate} onClose={modalManager.clearView} />,
        [ButtonId.DELETE_ITEM]: <ItemRemover item={item} onDelete={onDelete} onClose={modalManager.clearView} />,
        [ButtonId.REPORT]: <ReportForm item={item} onClose={modalManager.clearView} />
    }

    /**
     * Opens a modal with the appropriate child depending on the button clicked.
     * 
     * @param {Event} e the event.
     */
    function handleClick(e) {
        modalManager.showView(modalOpeners[e.target.id]);
    }

    const detailWrapperSizing = {
        padding: `${scaleByHeight(10, 'px')} ${scaleByWidth(15, 'px')}`
    };

    const imageSizing = {
        width: scaleByWidth(300, 'px'),
        height: scaleByHeight(500, 'px')
    }

    const smallHSizing = {
        textAlign: "center",
        fontSize: scaleByWidth(125, '%')
    };

    return (
        <div
            id="detailed-item-card"
            className="three-d-round-border"
            style={detailWrapperSizing}
        >
            <h1 style={{ fontSize: scaleByRatio(3.2, 'em') }}>{item.name}</h1>
            <div id="detail-wrapper">
                <img
                    src={item?.image_url || placeholderImages.item}
                    className="round-border"
                    style={imageSizing}
                />
                <div id="detail-block">
                    <h2 style={smallHSizing}>Details</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td>Part #</td>
                                <td>{item.part_number}</td>
                            </tr>
                            <tr>
                                <td>Added by</td>
                                <td>{username}</td>
                            </tr>
                            <tr>
                                <td>Added at</td>
                                <td>{dtStringToSystemTimeZone(item.created_at)}</td>
                            </tr>
                            <tr>
                                <td>Last Updated</td>
                                <td>{dtStringToSystemTimeZone(item.last_updated)}</td>
                            </tr>
                            <tr>
                                <td>Visibility</td>
                                <td>{isPublic}</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 style={smallHSizing}>
                        Description
                    </h3>
                    <textarea
                        readOnly
                        rows="4"
                        cols="40"
                        value={item.description}
                        style={quickInlineStyles.rectangularPad}
                    >
                    </textarea>
                    {!onUpdate ? null : (
                        <div className="button-group">
                            {item.user_id === user.id ? (
                                <>
                                    <button
                                        id={ButtonId.EDIT_ITEM}
                                        title="Edit item information."
                                        onClick={handleClick}
                                    >
                                        &#128393;
                                        Edit
                                    </button>
                                    <button
                                        id={ButtonId.DELETE_ITEM}
                                        title="Delete the item from the system."
                                        onClick={handleClick}
                                    >
                                        &#128465;
                                        Delete
                                    </button>
                                </>
                            ) : <button
                                id={ButtonId.REPORT}
                                title="Report this item for inappropriate content."
                                onClick={handleClick}
                            >
                                &#127988;
                                Report
                            </button>
                            }
                        </div>
                    )}
                </div>
            </div>
            {modalManager.modal}
        </div>
    )
}