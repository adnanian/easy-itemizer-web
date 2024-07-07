/**
 * Displays a div of text with a large font.
 * 
 * @param {Object} props
 * @param {String} props.id the value for the top level div's id attribute.
 * @param {*} props.children the child components.
 * @returns a large-fonted text.
 */
export default function BigText({ id, children }) {
    return (
        <div id={id} className="big-text">
            {children}
        </div>
    )
}