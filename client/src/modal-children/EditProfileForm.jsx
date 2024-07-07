import { Form, Formik } from "formik";
import * as yup from "yup";
import Input from "../components/formik-reusable/Input";
import { correctRoute } from "../helpers";
import { useTitleManager } from "../helperHooks";

/**
 * Renders a modal form that allows a user to edit his/her profile information, including
 * resetting the password. Note: the user will be required to enter his/her current password
 * to save any changes made.
 * 
 * Video Reference: https://www.youtube.com/watch?v=7Ophfq0lEAY&list=PLsBCPpptQcroC7NxdpGNJTIG8x5jv_66G&index=2
 * 
 * @param {Object} props 
 * @param {Object} props.user the current user.
 * @param {Function} props.onUpdate the callback function execute after a successful update of user info.
 * @param {Function} props.onClose the callback function to execute to close the modal.
 * @returns a modal form for a user to edit his/her information.
 */
export default function EditProfileForm({ user, onUpdate, onClose }) {
    const titleManager = useTitleManager("Edit Account/Profile Settings");

    const initialValues = {
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        email: user.email,
        profilePicture: user.profile_picture_url || "",
        password: "",
        newPassword: "",
        confirmNewPassword: ""
    }

    const formSchema = yup.object().shape({
        firstName: yup.string().required("Must enter first name.").max(30),
        lastName: yup.string().required("Must enter last name.").max(30),
        username: yup.string().required("Must enter user name.").min(8).max(20),
        email: yup.string().email("Please enter a valid email.").required("Must enter email."),
        profilePicture: yup.string().optional("Paste the URL of your picture here."),
        password: yup.string().min(8).max(32).required("Please enter your password."),
        newPassword: yup.string().min(8).max(32).optional("Change your password or leave blank to keep your current one."),
        confirmNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], "Password must match").optional("Confirm new password, if changing it.")
    });

    /**
     * Updates the user's information on the server if the user entered his/her
     * password correctly. Otherwise, displays an error message to the user with 
     * all the errors in input.
     * 
     * @param {Object} values the values from Formik.
     * @param {Object} actions Formik actions.
     */
    function handleSubmit(values, actions) {
        titleManager.setLoadingTitle("Updating Your Settings...");
        fetch(correctRoute("/current_user"), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                first_name: values.firstName,
                last_name: values.lastName,
                username: values.username,
                email: values.email,
                profile_picture_url: values.profilePicture,
                password: values.password,
                new_password: values.newPassword
            })
        })
            .then((response) => response.json().then((data) => (
                { data, status: response.status }
            )))
            .then(({ data, status }) => {
                if (status === 200) {
                    onUpdate(data);
                    alert("Your account has been successfully updated.");
                } else {
                    // console.log("JUST F-ing print something");
                    // console.log(`Response data is: ${data}`);
                    throw new Error(data.message);
                }
            })
            .catch((error) => {
                console.error(error);
                alert(error);
            })
            .finally(() => {
                actions.resetForm();
                titleManager.revertToDefault();
                onClose();
                return false;
            })
    }

    return (
        <div className="form-div">
            <h1>{titleManager.title}</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={formSchema}
                onSubmit={handleSubmit}
            >
                {(props) => (
                    <Form>
                        <Input
                            label="First Name"
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="Enter your first name."
                        />
                        <Input
                            label="Last Name"
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Enter your last name."
                        />
                        <Input
                            label="Username"
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Enter your username."
                        />
                        <Input
                            label="Email"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email address."
                        />
                        <Input
                            label="Image URL"
                            id="profilePicture"
                            name="profilePicture"
                            type="text"
                            placeholder="Paste your profile picture URL."
                        />
                        <Input
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password."
                        />
                        <Input
                            label="Enter a new password (optional)"
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            placeholder="Enter a new password, or leave blank to keep current."
                        />
                        <Input
                            label="Confirm Password"
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            type="password"
                            placeholder="Confirm Password"
                            disabled={!props.values.newPassword}
                        />
                        <button disabled={props.isSubmitting || !props.values.password} type="submit">Update</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}