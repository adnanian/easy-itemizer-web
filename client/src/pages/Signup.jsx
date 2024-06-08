import { Form, Formik } from "formik";
import * as yup from "yup";

/**
 * Renders a signup page where users can create new accounts.
 * 
 * @returns the signup page.
 */
export default function Signup() {
    const initialValues = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        iAgree: false
    }

    return <h1>Signup Here...</h1>
    
}