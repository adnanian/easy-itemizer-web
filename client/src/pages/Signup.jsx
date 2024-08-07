import { Form, Formik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/formik-reusable/Input";
import "../styles/Signup.css";
import { correctRoute } from "../helpers";
import {useTitleManager} from "../helperHooks";

/**
 * Renders a signup page where users can create new accounts.
 * 
 * Video Reference: https://www.youtube.com/watch?v=7Ophfq0lEAY&list=PLsBCPpptQcroC7NxdpGNJTIG8x5jv_66G&index=2
 * 
 * @returns the signup page.
 */
export default function Signup() {
    const titleManager = useTitleManager("Signup");
    const navigate = useNavigate();

    const initialValues = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        iAgree: false
    }

    // Add password security strength
    const formSchema = yup.object().shape({
        firstName: yup.string().required("Must enter first name.").max(30),
        lastName: yup.string().required("Must enter last name.").max(30),
        username: yup.string().required("Must enter user name.").min(8).max(20),
        email: yup.string().email("Please enter a valid email.").required("Must enter email."),
        password: yup.string().min(8).max(32).required("Must create a password."),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], "Password must match").required("Must enter password again.")
    });

    /**
     * If the user entered valid information, then an attempt will be made
     * to add that new information to the server. If successful, then a message
     * will be displayed to the user that his/her account was successfully created,
     * and will be rerouted to the login page. Otherwise, an error message will
     * be displayed to the user showing him/her the errors in input.
     * 
     * @param {Object} values the values from Formik.
     * @param {Object} actions Formik actions.
     */
    function handleSubmit(values, actions) {
        titleManager.setLoadingTitle("Signing Up...");
        fetch(correctRoute("/signup"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                first_name: values.firstName,
                last_name: values.lastName,
                username: values.username,
                email: values.email,
                password: values.password
            })
        })
            .then((response) =>
                response.json().then((data) => ({ data, status: response.status }))
            )
            .then(({ data, status }) => {
                console.log('Response status:', status);
                if (status === 201) {
                    navigate("/login");
                    console.log('New user successfully created.');
                    alert('You should receive an email to verify your account. Once you\'ve done that, you can log in.');
                } else {
                    console.error('Unexpected response:', data);
                    alert(data.message);
                }
            })
            .catch((error) => {
                console.error('Network error:', error);
                alert(error.message);
            })
            .finally(() => {
                actions.resetForm()
                titleManager.revertToDefault();
            });
    }

    return (
        <div id="signup-div" className="form-div">
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
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a password."
                        />
                        <Input
                            label="Confirm Password"
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Enter your password again."
                        />
                        <Input
                            label="I agree to the terms and conditions."
                            id="iAgree"
                            name="iAgree"
                            type="checkbox"
                        />
                        <button disabled={props.isSubmitting || !props.values.iAgree} type="submit">Signup</button>
                    </Form>
                )}
            </Formik>
            <Link
                id="login-instead"
                className="link-button"
                to="/login"
            >
                Already have an account? Click here to login!
            </Link>
        </div>
    )

}