import { useState } from "react";
import { useQuantityAdjuster } from "../../helperHooks";
import { correctRoute } from "../../helpers";

/**
 * Renders a modal form for updating the quantity of an assigned item.
 * 
 * @param {Object} props
 * @param {String} props.operation the mathematical operation, must be plus or minus.
 * @param {Number} props.currentQuantity the current quantity of the assigned item.
 * @param {Number} props.assignmentId the assignment's id.
 * @param {Function} props.onUpdate the callback function to execute when the quantity has been adjusted.
 * @param {Function} props.onClose - the callback function to execute to close the modal.
 * @returns the modal form for adjusting the assigned item's quantity.
 */
export default function AdjustQuantityForm({ operation, currentQuantity, assignmentId, onUpdate, onClose }) {
    const quantityAdjuster = useQuantityAdjuster(operation);
    const [adjustment, setAdjustment] = useState(1);
    const maxAdjustment = quantityAdjuster.targetOperation === "MINUS" ? currentQuantity : (Number.MAX_SAFE_INTEGER - currentQuantity);
    const labelName = quantityAdjuster.targetOperation === "MINUS" ? "Items Used" : "New Received";

    /**
     * Updates the assigned item's quantity.
     * 
     * @param {Event} e the event. 
     */
    function handleSubmit(e) {
        e.preventDefault();
        const newQuantity = quantityAdjuster.adjustQuantity(currentQuantity, adjustment);
        fetch(correctRoute(`/assignments/${assignmentId}`), {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                current_quantity: newQuantity
            })
        })
            .then((response) => response.json())
            .then((data) => {
                onUpdate(data);
            })
            .finally(() => {
                setAdjustment(1);
                onClose();
            });
    }

    return (
        <div id="adjust-quantity-modal">
            <form onSubmit={handleSubmit}>
                <label htmlFor="adjustment">{labelName}</label>
                <input
                    id="adjustment"
                    name="adjustment"
                    type="number"
                    step="1"
                    min="0"
                    max={maxAdjustment}
                    value={adjustment}
                    onChange={(e) => setAdjustment(Number.parseInt(e.target.value))}
                />
                <input type="submit" />
            </form>
        </div>
    )

}