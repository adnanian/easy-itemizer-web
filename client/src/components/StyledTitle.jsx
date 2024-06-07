/**
 * Renders a styled h1 heading.
 * Contains a common classname so that it will generate a background color with a border-styling, and a certain fontsized, all set using CSS.
 * 
 * @param {String} text the text for the heading.
 * @returns a styled h1.
 */
export default function StyledTitle( {text} ) {
    return (
        <h1 className="page-title"><span className="title-text">{text}</span></h1>
    )
}