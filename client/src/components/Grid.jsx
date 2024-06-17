import "../styles/components/Grid.css";

/**
 * Renders elements as equal sized blocks in a grid.
 * Use CSS to adjust the size of the grid.
 * 
 * @param {*} props the id's for the parent and child div's, and anything to be rendered under Grid.
 * @returns An organized grid of elements.
 */
export default function Grid(props) {
    return (
        <div id={props.blockId} className="grid-block">
            {
                props.intermediateId ? (
                    <div id={props.intermediateId} className="grid">
                        {props.children}
                    </div>
                ) : (
                    props.children
                )
            }
        </div>
    )
}