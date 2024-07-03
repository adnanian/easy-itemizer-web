import { Form, Formik } from "formik";
import * as yup from "yup";
import Input from "../components/formik-reusable/Input";
import TextArea from "../components/formik-reusable/TextArea";
import { correctRoute } from "../helpers";

export default function EditOrgForm({org, onUpdate, onClose}) {
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
     * @param {*} values the values from Formik.
     * @param {*} actions Formik actions.
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