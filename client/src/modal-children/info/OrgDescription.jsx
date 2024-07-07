/**
 * Renders a modal view of the current organization's description.
 * 
 * @param {Object} props
 * @param {String} props.name the organization's name.
 * @param {String} props.description the organization's description.
 * @returns the organization's description.
 */
export default function OrgDescription({ name, description }) {
    return (
        <div>
            <h1>About <em>{name}</em></h1>
            <p>
                {description}
            </p>
        </div>
    )
}