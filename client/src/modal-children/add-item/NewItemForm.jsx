import { Form, Formik } from "formik";
import * as yup from "yup";
import Input from "../../components/formik-reusable/Input"
import TextAreaInput from "../../components/formik-reusable/TextArea";
import {correctRoute} from "../../helpers";

/**
 * Creates a form that allows users to manually enter item information
 * to add a new item to an organization AND the system itself.
 * 
 * @param {Function} onAdd the callback function to execute when adding an item.
 * @returns a modal form allowing users to manually add information about an item to the system.
 */
export default function NewItemForm({ orgId, onAdd }) {
    const maxNameLength = 200;
    const maxDescLength = 500;

    const initialValues = {
        name: "",
        description: "",
        partNumber: "",
        isPublic: false,
        imageUrl: "",
        initialQuantity: 0,
        initialEnoughThreshold: 1
    };

    const formSchema = yup.object().shape({
        name: yup.string().required("Item name required").max(maxNameLength),
        description: yup.string().optional().max(maxDescLength),
        partNumber: yup.string().optional(),
        imageUrl: yup.string().optional("RECOMMENDED"),
        initialQuantity: yup.number().integer().min(0).required("Must be a non-negative integer."),
        initialEnoughThreshold: yup.number().integer().min(1).required("Must be a positive integer.")
    });

    /**
     * Creates a new item and adds it to the system.
     * 
     * @param {*} values the values from Formik.
     * @param {*} actions Formik actions.
     * @returns false so that the web app does not refresh.
     */
    function handleSubmit(values, actions) {
        fetch(correctRoute("/add_new_item"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: values.name,
                description: values.description,
                part_number: values.partNumber,
                image_url: values.imageUrl,
                current_quantity: values.initialQuantity,
                enough_threshold: values.initialEnoughThreshold,
                organization_id: orgId
            })
        })
        .then((response) => response.json().then((data) => (
            {data, status: response.status}
        )))
        .then(({data, status}) => {
            if (status === 201) {
                onAdd(data);
                alert("New item added to the system.")
            } else {
                throw new Error(data.message)
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
        <div className="form-div" >
            <h1>Add New Item</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={formSchema}
                onSubmit={handleSubmit}
            >
                {(props) => {
                    return (
                        <Form>
                            <Input
                                label="Name"
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter the name of the item. BE PRECISE!"
                            />
                            <span>{`${props.values.name.length} / ${maxNameLength} characters`}</span>
                            <TextAreaInput
                                label="Description"
                                id="description"
                                name="description"
                                rows="5"
                                cols="50"
                                placeholder="Describe the item here. (Optional, but HIGHLY RECOMMENDED!)"
                            />
                            <span>{`${props.values.description.length} / ${maxDescLength} characters`}</span>
                            <Input
                                label="Part Number"
                                id="partNumber"
                                name="partNumber"
                                type="text"
                                placeholder="Enter the part number (optional)."
                            />
                            <Input
                                label="Make Public"
                                id="isPublic"
                                name="isPublic"
                                type="checkbox"
                                checked={props.values.isPublic}
                            />
                            <Input
                                label="Image URL"
                                id="imageUrl"
                                name="imageUrl"
                                type="text"
                                placeholder="Paste the image address here."
                            />
                            <Input
                                label="Initial Quantity"
                                id="initialQuantity"
                                name="initialQuantity"
                                type="number"
                                step="1"
                                min="0"
                                placeholder="How many of this item do you have?"
                            />
                            <Input
                                label="Enough Threshold"
                                id="initialEnoughThreshold"
                                name="initialEnoughThreshold"
                                type="number"
                                step="1"
                                min="0"
                                placeholder="How many of this item do you have?"
                            />
                            <button disabled={props.isSubmitting} type="submit">Submit</button>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}