import { Form, Formik } from "formik";
import * as yup from "yup";
import Input from "../components/formik-reusable/Input";
import TextArea from "../components/formik-reusable/TextArea";
import { correctRoute } from "../helpers";

/**
 * Displays a form allowing the owner to edit the top level information of an
 * organization.
 * 
 * @param {Object} props
 * @param {Object} props.org the organization to update.
 * @param {Function} props.onClose the callback function to execute to close the modal.
 * @returns a modal form allowing the owner to edit the organization's info.
 */
export default function EditOrgForm({ org, onClose }) {
    const initialValues = {
        orgName: org.name,
        orgDescription: org.description,
        orgLogo: org.image_url || "",
        orgBanner: org.banner_url || ""
    }

    const formSchema = yup.object().shape({
        orgName: yup.string().required("Name required."),
        orgDescription: yup.string().min(50).required("Describe your organization with at least 50 characters."),
        orgLogo: yup.string().optional("Paste the URL of your picture here."),
        orgBanner: yup.string().optional("Place the URL of your banner here.")
    });


    /**
     * Updates the organization's data.
     * 
     * @param {Object} values the values from Formik.
     * @param {Object} actions Formik actions.
     */
    function handleSubmit(values, actions) {
        // let shouldNotRefresh = false;
        fetch(correctRoute(`/organizations/${org.id}`), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: values.orgName,
                description: values.orgDescription,
                image_url: values.orgLogo,
                banner_url: values.orgBanner
            })
        })
            .then((response) => {
                if (response.ok) {
                    alert("Organization info successfully updated.");
                    window.location.reload();
                } else {
                    throw new Error("Organization name already exists.");
                }
            })
            .catch((error) => {
                console.error(error);
                alert(error);
                // shouldNotRefresh = true;
            })
            .finally(() => {
                actions.resetForm();
                onClose();
                // if (shouldNotRefresh) {
                //     return false;
                // }
            });
    }

    return (
        <div className="form-div">
            <h1>Update the organization!</h1>
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
                                id="orgName"
                                name="orgName"
                                type="text"
                                placeholder="Enter the name."
                            />
                            <TextArea
                                label="Description: "
                                id="orgDescription"
                                name="orgDescription"
                                rows="5"
                                cols="50"
                                placeholder="Add description here. (Min: 50 characters)"
                            />
                            <span>{`${props.values.orgDescription.length} characters`}</span>
                            <Input
                                label="Profile Image URL: "
                                id="orgLogo"
                                name="orgLogo"
                                type="text"
                                placeholder="Paste the URL of your organization\'s profile photo here."
                            />
                            <Input
                                label="Banner Image URL: "
                                id="orgBanner"
                                name="orgBanner"
                                type="text"
                                placeholder="Paste the URL of your organization\'s banner here."
                            />
                            <button disabled={props.isSubmitting} type="submit">Submit</button>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}