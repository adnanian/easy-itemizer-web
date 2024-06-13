export default function BigText( {id, children} ) {
    return (
        <div id={id} className="big-text">
            {children}
        </div>
    )
}