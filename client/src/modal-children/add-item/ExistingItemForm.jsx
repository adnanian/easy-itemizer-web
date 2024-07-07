import ItemViewer from "../../components/item-viewer/ItemViewer"
import { Form, Formik } from "formik";
import * as yup from "yup";
import Input from "../../components/formik-reusable/Input"
import { correctRoute } from "../../helpers";
import { useContext } from "react";
import { SelectedItemContext } from "../../SuperContext";

/**
 * Creates a radio-selected view inside the item modal form,
 * where a user can add an existing item from the system not yet being
 * used by the user's organization.
 * 
 * @param {Object} props 
 * @param {Number} props.orgId the id of the organization currently being viewed.
 * @param {Object} props.user the current user.
 * @param {Function} props.onAdd the callback function to execute when an item is added.
 * @returns a view allowing users to select an item to add.
 */
export default function ExistingItemForm({ orgId, user, onAdd }) {
    const { selectedItem } = useContext(SelectedItemContext);

    const initialValues = {
        quantity: 0,
        threshold: 1
    };

    const formSchema = yup.object().shape({
        quantity: yup.number().integer().min(0).required("Must be a non-negative integer."),
        threshold: yup.number().integer().min(1).required("Must be a positive integer.")
    });

    /**
     * Adds the existing item to the organization.
     * If that item is already assigned to the organization, than an error
     * message will be displayed.
     * 
     * @param {Object} values the values from Formik.
     * @param {Object} actions Formik actions.
     * @returns false so that the web app does not refresh.
     */
    function handleSubmit(values, actions) {
        fetch(correctRoute("/assignments"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                current_quantity: values.quantity,
                enough_threshold: values.threshold,
                item_id: selectedItem.id,
                organization_id: orgId
            })
        })
            .then((response) => response.json().then((data) => (
                { data, status: response.status }
            )))
            .then(({ data, status }) => {
                if (status === 201) {
                    console.log(data);
                    onAdd(data);
                    alert("Item assigned to your organization.")
                } else {
                    throw new Error("You already have this item in your organization.");
                }
            })
            .catch((error) => {
                console.error(error);
                onAdd(null);
                alert(error);
            })
            .finally(() => {
                actions.resetForm();
                return false;
            });
    }

    return (
        <>
            <h1>Add Existing Item</h1>
            <ItemViewer
                user={user}
            />
            <div id="existing-item-form" className="form-div">
                <Formik
                    initialValues={initialValues}
                    validationSchema={formSchema}
                    onSubmit={handleSubmit}
                >
                    {(props) => {
                        return (
                            <Form>
                                <Input
                                    label="Initial Quantity"
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    step="1"
                                    min="0"
                                    placeholder="How many of this item do you have?"
                                />
                                <Input
                                    label="Enough Threshold"
                                    id="threshold"
                                    name="threshold"
                                    type="number"
                                    step="1"
                                    min="0"
                                    placeholder="How many of this item do you have?"
                                />
                                <button disabled={props.isSubmitting || !selectedItem} type="submit">Submit</button>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </>
    )
}