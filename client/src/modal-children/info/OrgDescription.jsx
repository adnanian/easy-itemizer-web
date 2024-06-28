/**
 * 
 * @param {*} param0 
 * @returns 
 */
export default function OrgDescription({name, description}) {
    return (
        <div>
            <h1>About {name}</h1>
            <p>
                {description}
            </p>
        </div>
    )
}