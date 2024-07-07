import StyledTitle from "./StyledTitle";

/**
 * Renders a styled h1 element with the text: "Loading..."
 * 
 * This is used when the component is still rendering the data that is fetched
 * from the server.
 * 
 * @returns a heading that says "Loading..."
 */
export default function LoadingScreen() {
    return (
        <StyledTitle text="Loading..." />
    )
}