import { useModalManager, useScreenSize } from "../helperHooks";
import { placeholderImages, dtStringToSystemTimeZone } from "../helpers";
import AssignmentRemover from "../modal-children/confirm-deletion/AssignmentRemover";
import AdjustQuantityForm from "../modal-children/edit-assignment/AdjustQuantityForm";
import AdjustThresholdForm from "../modal-children/edit-assignment/AdjustThresholdForm";

/**
 * Displays all the information of an item in a card, including the quantity
 * that the current organization has.
 * 
 * Also rendered are two buttons for any member to adjust the quantity of the
 * assigned item for their inventory. If the user member is an ADMIN, then two
 * more buttons will be rendered; one for editing the assignment information,
 * and another for deleting the item from the organization.
 * 
 * WARNING: THIS COMPONENT IS MEANT TO RENDER UNDER THE Organization PAGE. DO NOT
 * CONFUSE THIS WITH ItemCard, WHICH IS MEANT TO BE RENDERED UNDER THE Home PAGE.
 * 
 * 
 * @param {Object} props
 * @param {Object} props.assignment the assignment.
 * @param {Boolean} props.currentUserRegular true if the current user is a REGULAR member of the viewing organization, false otherwise.
 * @param {Boolean} props.showDetails if true, the extra details of the assigned item will be rendered.
 * @param {Function} props.onUpdate the callback function to execute after an assigned item's information has been updated to the server.
 * @param {Function} props.onDelete the callback function to execute after the assigned item is deleted from the server.
 * 
 * @returns an item card consisting of its item and assignment information.
 */
export default function AssignedItemCard({ assignment, currentUserRegular, showDetails, onUpdate, onDelete }) {
    const modalManager = useModalManager();
    const { scaleByWidth, scaleByHeight } = useScreenSize();

    /**
     * Simple class for mapping div styling classNames
     * and texts to render the card with.
     */
    class QuantityStatus {
        /**
         * Creates a new instance of QuantityStatus.
         * 
         * @param {String} name the text to display at the top of the card.
         * @param {String} className the name of the class to set the top level div for this component. 
         * @param {String} tooltip the tooltip to display when the user hovers the mouse towards the card.
         */
        constructor(name, className, tooltip) {
            this.name = name;
            this.className = className;
            this.tooltip = tooltip;
        }
    }

    /**
     * Creates a new instance of QuantityStatus.
     * The name and classname depend on the assignment's current_quantity and
     * its relation to the enough_threshold property.
     * 
     * @returns a Quantity status with the appropriate attributes.
     */
    const generateQuantityStatus = () => {
        if (assignment.current_quantity >= assignment.enough_threshold) {
            return new QuantityStatus(
                "GOOD",
                "quantity-status-good",
                "You are good on this item for now."
            );
        } else {
            if (assignment.current_quantity === 0) {
                return new QuantityStatus(
                    "OUT",
                    "quantity-status-out",
                    "You have none of this item left. You need to place more orders immediately!"
                );
            } else {
                return new QuantityStatus(
                    "LOW",
                    "quantity-status-low",
                    "You are running low on this item. Consider purchasing more."
                );
            }
        }
    }

    const quantityStatus = generateQuantityStatus();

    /**
     * Displays a modal with the appropriate child, depending on the button clicked.
     * 
     * @param {Event} e the event. 
     */
    function handleClick(e) {
        const subClass = e.target.className.substring("quantity-changer ".length);
        const operation = subClass.substring(0, subClass.indexOf('-'));
        console.log(subClass.substring(0, subClass.indexOf('-')));
        switch (operation) {
            case "plus":
            case "minus":
                modalManager.showView(
                    <AdjustQuantityForm
                        operation={operation}
                        currentQuantity={assignment.current_quantity}
                        assignmentId={assignment.id}
                        onUpdate={onUpdate}
                        onClose={modalManager.clearView}
                    />
                );
                break;
            case "edit":
                modalManager.showView(
                    <AdjustThresholdForm
                        assignmentId={assignment.id}
                        currentQuantity={assignment.current_quantity}
                        enoughThreshold={assignment.enough_threshold}
                        onUpdate={onUpdate}
                        onClose={modalManager.clearView}
                    />
                );
                break;
            case "trash":
                modalManager.showView(
                    <AssignmentRemover
                        assignment={assignment}
                        onDelete={onDelete}
                        onClose={modalManager.clearView}
                    />
                )
                break;
            default:
                throw new Error("Wrong button class associated with this event.");
        }
    }

    const imageStyling = {
        width: scaleByWidth(200, 'px'),
        height: scaleByHeight(100, 'px')
    };

    return (
        <>
            <div className={`assigned-item  three-d-round-border ${quantityStatus.className}`} title={quantityStatus.tooltip}>
                <p><b>{quantityStatus.name}</b></p>
                <img src={assignment.item.image_url || placeholderImages.item} style={imageStyling} />
                <h4 className="assignment-name">{assignment.item.name}</h4>
                {
                    !showDetails ? <p className="simple-status">{assignment.current_quantity} / {assignment.enough_threshold}</p> : (
                        <>
                            <h5 className="assignment-part" title="The part number for this item.">{assignment.item.part_number}</h5>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Current Quantity</td>
                                        <td>{assignment.current_quantity}</td>
                                    </tr>
                                    <tr title="The minimum quantity for this item that this organization considers enough or plenty.">
                                        <td>Enough Threshold</td>
                                        <td>{assignment.enough_threshold}</td>
                                    </tr>
                                    <tr>
                                        <td>Added at</td>
                                        <td>{dtStringToSystemTimeZone(assignment.added_at)}</td>
                                    </tr>
                                    <tr>
                                        <td>Last Updated</td>
                                        <td>{dtStringToSystemTimeZone(assignment.last_updated)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <textarea
                                readOnly
                                rows="4"
                                cols="30"
                                value={assignment.item.description}
                            >
                            </textarea>
                        </>
                    )
                }
                <div className="button-group">
                    <button
                        className={"quantity-changer minus-button"}
                        onClick={handleClick}
                        disabled={assignment.current_quantity === 0}
                        title="Enter how many of this item you used up."
                    >
                        -
                    </button>
                    {
                        currentUserRegular ? null : (
                            <>
                                <button
                                    className={"quantity-changer edit-q-button"}
                                    onClick={handleClick}
                                    title="Edit the enough threshold for this item."
                                >
                                    &#128393;
                                </button>
                                <button
                                    className={"quantity-changer trash-button"}
                                    onClick={handleClick}
                                    title="Remove this item from your organization."
                                >
                                    &#128465;
                                </button>
                            </>
                        )
                    }
                    <button
                        className={"quantity-changer plus-button"}
                        onClick={handleClick}
                        title="Enter how many of this item you newly received into your inventory."
                    >
                        +
                    </button>
                </div>
            </div>
            {modalManager.modal}
        </>
    )
}