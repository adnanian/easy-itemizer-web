import { placeholderImages, quickInlineStyles } from "../../helpers";
import "../../styles/components/ItemCardDetail.css";
import BigText from "../BigText";
import Modal from "../Modal";
import {useModal} from "../../helperHooks";
import EditItemForm from "../../modal-children/EditItemForm";
import { useState } from "react";

export default function ItemCardDetail({user, item, onUpdate}) {
    // console.log(item);

    if (!item) {
        return <BigText><p>Click on an item to view more details!</p></BigText>
    }

    const [modalActive, toggle] = useModal();
    const [modalKey, setModalKey] = useState("");
    const username = item.user_id === user.id ? "You" : item.user.username;
    const isPublic = item.is_public ? "Public" : "Private";

    const ButtonId = Object.freeze({
        EDIT_ITEM: "edit-item-button",
        DELETE_ITEM: "delete-item-button",
        REPORT: "report-button"
    });

    const modalOpeners = {
        [ButtonId.EDIT_ITEM]: <EditItemForm item={item} onUpdate={handleUpdate} onClose={toggle}/>,
        [ButtonId.DELETE_ITEM]: null,
        [ButtonId.REPORT]: null
    }

    function handleClick(e) {
        setModalKey(e.target.id);
        toggle();
    }

    function handleUpdate(itemToUpdate) {
        setModalKey("");
        onUpdate(itemToUpdate);
    }

    return (
        <div id="detailed-item-card" className="three-d-round-border">
            <h1>{item.name}</h1>
            <div id="detail-wrapper">
                <img src={item?.image_url || placeholderImages.item} className="round-border"/>
                <div id="detail-block">
                    <h2 style={quickInlineStyles.centerText}>Details</h2>
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
                                <td>{item.created_at}</td>
                            </tr>
                            <tr>
                                <td>Last Updated</td>
                                <td>{item.last_updated || "N/A"}</td>
                            </tr>
                            <tr>
                                <td>Visibility</td>
                                <td>{isPublic}</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 style={{...quickInlineStyles.centerText, ...quickInlineStyles.biggerFont}}>
                        Description
                    </h3>
                    <textarea
                        readOnly
                        rows="6"
                        cols="40"
                        value={item.description}
                        style={quickInlineStyles.rectangularPad}
                    >
                    </textarea>
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
                            </button>}
                    </div>
                </div>
            </div>
            <Modal openModal={modalActive} closeModal={toggle}>
                {modalOpeners[modalKey]}
            </Modal>
        </div>
    )
}