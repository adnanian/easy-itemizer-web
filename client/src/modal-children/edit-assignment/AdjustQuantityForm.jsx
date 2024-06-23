import { useState } from "react";
import { useQuantityAdjuster } from "../../helperHooks";

/**
 * TODO
 * 
 * @param {*} param0 
 * @returns 
 */
export default function AdjustQuantityForm({operation, currentQuantity, assignmentId, onUpdate, onClose}) {
    const quantityAdjuster = useQuantityAdjuster(operation);
    const [adjustment, setAdjustment] = useState(1);
    const maxAdjustment = quantityAdjuster.targetOperation === "MINUS" ? currentQuantity : (Number.MAX_SAFE_INTEGER - currentQuantity);
    const labelName = quantityAdjuster.targetOperation === "MINUS" ? "Items Used" : "New Received";

    function handleSubmit(e) {
        e.preventDefault();
        const newQuantity = quantityAdjuster.adjustQuantity(currentQuantity, adjustment);
        fetch(`/api/assignments/${assignmentId}`, {
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