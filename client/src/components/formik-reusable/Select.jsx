import { useField } from "formik";
import InputErrorMessage from "./InputErrorMessage";

/**
 * Creates a drop down list, using Formik functionality.
 * 
 * @param {*} param0 input attributes, must include a label, id, and a list of <option> elements.
 * @returns a fully customized <select> elements with its options.
 */
const Select = ({label, id, ...props}) => {
    // field - info about the input fields
    // meta - info about input interactions and errors
    // helpers - functions
    const [field, meta] = useField(props);

    return (
        <>
            <label htmlFor={id}>{label}</label>
            <select 
                className={meta.error && meta.touched ? "input-error" : ""}
                {...field}
                {...props} 
            />
            <InputErrorMessage errors={meta.error} touched={meta.touched}/>
        </>
    );
}

export default Select;