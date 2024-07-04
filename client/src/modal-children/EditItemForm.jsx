import {Form, Formik} from "formik";
import * as yup from "yup";
import Input from "../components/formik-reusable/Input";
import TextAreaInput from "../components/formik-reusable/TextArea";
import { correctRoute } from "../helpers";

export default function EditItemForm({item, onUpdate, onClose}) {
    const maxNameLength = 200;
    const maxDescLength = 500;

    const initialValues = {
        name: item.name,
        description: item.description,
        partNumber: item.part_number,
        isPublic: item.is_public,
        imageUrl: item.image_url
    }

    const formSchema = yup.object().shape({
        name: yup.string().required("Must enter a name.").max(maxNameLength),
        description: yup.string().optional("RECOMMENDED").max(maxDescLength),
        partNumber: yup.string().optional(),
        isPublic: yup.boolean().required("Set visibility."),
        imageUrl: yup.string().optional("RECOMMENDED")
    });

    /**
     * Updates the item's data.
     * 
     * @param {*} values the values from Formik.
     * @param {*} actions Formik actions.
     * @returns false so that the web app does not refresh.
     */
    function handleSubmit(values, actions) {
        if (item.is_public && !values.isPublic) {
            alert("Note: changing your item's visibility to private will not affect organizations currently using it.");
        }

        fetch(correctRoute(`/items/${item.id}`), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: values.name,
                description: values.description,
                part_number: values.partNumber,
                is_public: values.isPublic,
                image_url: values.imageUrl
            })
        }).then((response) => response.json().then((data) => (
            {data, status: response.status}
        )))
        .then(({data, status}) => {
            if (status === 200) {
                onUpdate(data);
                alert("Item update successful.");
            } else {
                throw new Error(`Item update failed: ${data.message}`);
            }
        })
        .catch((error) => {
            console.error(error);
            alert(error);
        })
        .finally(() => {
            actions.resetForm();
            onClose();
            return false;
        });
    }

    return (
        <div className="form-div">
            <h1>Edit Item</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={formSchema}
                onSubmit={handleSubmit}
            >
                {
                    (props) => {
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
                            <button disabled={props.isSubmitting} type="submit">Submit</button>
                            </Form>
                        )
                    }
                }
            </Formik>
        </div>
    )
    
}