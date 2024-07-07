import { useState } from "react";
import NewItemForm from "./NewItemForm";
import ExistingItemForm from "./ExistingItemForm";

/**
 * Creates a modal form allowing users to add new items to the screen.
 * This would allow users to select a radio button to view one of two
 * components: one for adding a new item to the organization AND the system,
 * and another for adding an existing item from the system to the organization.
 * 
 * @param {Object} props 
 * @param {Integer} props.orgId the organization's id.
 * @param {Object} props.user the current user.
 * @param {Function} props.onAdd the callback function to execute when adding a new item.
 * @param {Function} props.onClose the callback function to execute when closing the modal form.
 * @returns a modal child that allows the user to switch between NewItemForm and ExistingItemForm.
 */
export default function ItemFormContainer({ orgId, user, onAdd, onClose }) {

    /**
     * Adds a new item (if a form was submitted for a new item).
     * Then closes the modal.
     * 
     * @param {Object} data the JSON parsed data response. 
     */
    const addAndClose = (data) => {
        if (data) {
            onAdd(data);
        }
        onClose();
    }

    const formRadioValues = {
        new: "new-item-form",
        existing: "existing-item-form"
    }

    const formRadio = {
        [formRadioValues.new]: (
            <NewItemForm
                orgId={orgId}
                onAdd={addAndClose}
            />
        ),
        [formRadioValues.existing]: (
            <ExistingItemForm
                orgId={orgId}
                user={user}
                onAdd={addAndClose}
            />
        )
    }

    const [form, setForm] = useState(formRadioValues.new);

    /**
     * Sets the form to display, given the selected radio button's value.
     * 
     * @param {Event} e the event.
     */
    function handleChange(e) {
        setForm(e.target.value);
    }

    return (
        <>
            <div className="org-radio">
                <div className="radio-div">
                    <input
                        id="new-item"
                        name="new-item"
                        type="radio"
                        value={formRadioValues.new}
                        onChange={handleChange}
                        checked={form === formRadioValues.new}
                    />
                    <span>Create a New Item</span>
                </div>
                <div className="radio-div">
                    <input
                        id="existing-item"
                        name="existing-item"
                        type="radio"
                        value={formRadioValues.existing}
                        onChange={handleChange}
                        checked={form === formRadioValues.existing}
                    />
                    <span>Add an Existing Item</span>
                </div>
            </div>
            {formRadio[form]}
        </>
    )
}