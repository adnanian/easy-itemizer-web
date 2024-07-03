/**
 * 
 * @param {*} param0 
 * @returns 
 */
export default function OrgDescription({name, description}) {
    return (
        <div>
            <h1>About <em>{name}</em></h1>
            <p>
                {description}
            </p>
        </div>
    )
}