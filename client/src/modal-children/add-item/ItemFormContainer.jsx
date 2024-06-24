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
 * @param {Array} props.items the array of items not assigned to the organization of given id.
 * @param {Function} props.onAdd the callback function to execute when adding a new item.
 * @param {Function} props.onClose the callback function to execute when closing the modal form.
 * @returns a modal child that allows the user to switch between @function NewItemForm and @function ExistingItemForm.
 */
export default function ItemFormContainer({orgId, user, onAdd, onClose}) {

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
     * @param {*} e the event.
     */
    function handleChange(e) {
        setForm(e.target.value);
    }
    
    return (
        <>
            <div>
                <input
                    id="new-item"
                    name="new-item"
                    type="radio"
                    value={formRadioValues.new}
                    onChange={handleChange}
                    checked={form===formRadioValues.new}
                />
                <span>Create a New Item</span>
                <input
                    id="existing-item"
                    name="existing-item"
                    type="radio"
                    value={formRadioValues.existing}
                    onChange={handleChange}
                    checked={form===formRadioValues.existing}
                />
                <span>Add an Existing Item</span>
            </div>
            {formRadio[form]}
        </>
    )
}