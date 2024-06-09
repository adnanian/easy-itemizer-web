/**
 * Creates a display message for any errors in user input.
 * This component uses Formik functionality.
 *  
 * @param {*} param0 th errors and whether the input has been touched.
 * @returns a <p> element with the error message displayed.
 */
function InputErrorMessage( { errors, touched }) {
    if (errors && touched) {
        return (
            <p className="error">{errors}</p>
        )
    }
    return null;
}

export default InputErrorMessage;