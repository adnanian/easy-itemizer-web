import { useField } from "formik";
import InputErrorMessage from "./InputErrorMessage";

/**
 * Creates an input with Formik functionality. Can be of type text, number, or checkbox.
 * 
 * @param {*} param0 input attributes. Must include at least a label, and an id.
 * @returns a fully customized <input/> element.
 */
const Input = ({label, id, ...props}) => {
    // field - info about the input fields
    // meta - info about input interactions and errors
    // helpers - functions
    const [field, meta] = useField(props);

    return (
        <>
            <label htmlFor={id}>{label}</label>
            <input 
                className={meta.error && meta.touched ? "input-error" : ""}
                {...field}
                {...props} 
            />
            <InputErrorMessage errors={meta.error} touched={meta.touched}/>
        </>
    );
}

export default Input;