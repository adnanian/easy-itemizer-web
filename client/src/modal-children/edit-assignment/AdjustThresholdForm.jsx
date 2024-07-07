import { Form, Formik } from "formik";
import * as yup from "yup";
import { correctRoute } from "../../helpers";
import Input from "../../components/formik-reusable/Input";

/**
 * Renders a modal form for updating the assigned item's quantity and threshold settings.
 * 
 * @param {Object} props
 * @param {Number} props.assignmentId the assignment's id.
 * @param {Number} props.currentQuantity the assigned item's current quantity.
 * @param {Number} props.enoughThreshold the assigned item's enough threshold.
 * @param {Function} props.onUpdate the callback function to execute when the assignment is updated from the server.
 * @param {Function} props.onClose the callback function to execute to close the modal.
 * @returns a form to update the assignment's quantity and threshold settings.
 */
export default function AdjustThresholdForm({ assignmentId, currentQuantity, enoughThreshold, onUpdate, onClose }) {
    const initialValues = {
        currentQuantity: currentQuantity,
        enoughThreshold: enoughThreshold
    };

    const formSchema = yup.object().shape({
        currentQuantity: yup.number().integer().min(0).required("Must be a non-negative number."),
        enoughThreshold: yup.number().integer().min(1).required("Must be a positive integer.")
    });

    /**
     * Updates the assignments's quantity and threshold data.
     * 
     * @param {Object} values the values from Formik.
     * @param {Object} actions Formik actions.
     * @returns false so that the web app does not refresh.
     */
    function handleSubmit(values, actions) {
        fetch(correctRoute(`/assignments/${assignmentId}`), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                current_quantity: values.currentQuantity,
                enough_threshold: values.enoughThreshold
            })
        })
            .then((response) => response.json().then((data) => (
                { data, status: response.status }
            )))
            .then(({ data, status }) => {
                if (status === 200) {
                    onUpdate(data);
                    alert("Quantity and Threshold Updates Successful!");
                } else {
                    throw new Error(`Quantity and Threshold Updates failed: ${data.message}`);
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
            <h1>Override Quantity & Adjust Threshold</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={formSchema}
                onSubmit={handleSubmit}
            >
                {(props) => {
                    return (
                        <Form>
                            <Input
                                label="Actual Current Quantity: "
                                id="currentQuantity"
                                name="currentQuantity"
                                type="number"
                                min="0"
                            />
                            <Input
                                label="Enough Threshold: "
                                id="enoughThreshold"
                                name="enoughThreshold"
                                type="number"
                                min="1"
                            />
                            <button
                                disabled={props.isSubmitting}
                                type="submit"
                            >
                                Submit
                            </button>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}