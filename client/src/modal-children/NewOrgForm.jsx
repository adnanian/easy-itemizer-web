import { Form, Formik } from "formik";
import * as yup from "yup";
import Input from "../components/formik-reusable/Input"
import TextArea from "../components/formik-reusable/TextArea";
import { correctRoute } from "../helpers";

/**
 * Creates a form that allows user to create a new organiztaion
 * by entering a name and description.
 * 
 * @param {Object} props 
 * @param {Number} props.userId the current user's id.
 * @param {Function} props.onAdd the callback function to execute upon creating the organization and membership on the server side.
 * @param {Function} props.onclose the callback function to execute to close the modal.
 * @returns a modal form prompting users to create a new organization.
 */
export default function NewOrgForm({ userId, onAdd, onClose }) {
    const initialValues = {
        name: "",
        description: "",
        imageUrl: "",
        bannerUrl: ""
    }

    const formSchema = yup.object().shape({
        name: yup.string().required("Name required."),
        description: yup.string().min(50).required("Describe your organization with at least 50 characters."),
        imageUrl: yup.string().optional("Recommended but not required."),
        bannerUrl: yup.string().optional("Recommended but not required.")
    });

    /**
     * Attempts to create a new organization on the server side.
     * Then if successful, creates a new membership with the current
     * user as the owner. Finally, displays the new organization
     * on the Memberships page.
     * 
     * If creation fails on the server side, than an error message
     * will be displayed to the user.
     * 
     * @param {Object} values the values from Formik.
     * @param {Object} actions Formik actions.
     * @returns false so that the web app does not refresh.
     */
    function handleSubmit(values, actions) {
        fetch(correctRoute("/organizations"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: values.name,
                description: values.description,
                image_url: values.imageUrl,
                banner_url: values.bannerUrl,
                user_id: userId
            })
        })
            .then((response) => response.json().then((data) => (
                { data, status: response.status }
            )))
            .then(({ data, status }) => {
                if (status === 201) {
                    onAdd(data);
                    alert("New organization successfully created.");
                } else {
                    throw new Error(data.message);
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
            <h1>Create a new organization!</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={formSchema}
                onSubmit={handleSubmit}
            >
                {(props) => {
                    return (
                        <Form>
                            <Input
                                label="Name: "
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter the name."
                            />
                            <TextArea
                                label="Description: "
                                id="description"
                                name="description"
                                rows="5"
                                cols="50"
                                placeholder="Add description here. (Min: 50 characters)"
                            />
                            <Input
                                label="Image URL: "
                                id="imageUrl"
                                name="imageUrl"
                                type="text"
                                placeholder="Paste the URL for your logo."
                            />
                            <Input
                                label="Banner URL: "
                                id="bannerUrl"
                                name="bannerUrl"
                                type="text"
                                placeholder="Paste the URL for your banner."
                            />
                            <span>{`${props.values.description.length} characters`}</span>
                            <button disabled={props.isSubmitting} type="submit">Submit</button>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}