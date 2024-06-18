/**
 * The prefix to append the routes to when making fetch request.
 * 
 * WARNING: THIS IS AUTOMATICALLY SET BY configureClient.cjs!
 * PLEASE DO NOT ALTER THE DECLARED VARIABLE MANUALLY!
 */
const routePrefix = "/api";

// Placeholder image for items if there is not a valid URL provided.
const itemImagePlaceholder = '/images/placeholder-item-image.jpg';

// TODO
const quickInlineStyles = {
    centerText: {textAlign: "center"},
    biggerFont: {fontSize: "150%"},
    rectangularPad: {padding: "8px"}
};

/**
 * Adds the correct route prefix to a given route and returns it.
 * This is meant to be used during fetched requests.
 * 
 * @param {*} route the route.
 * @returns the route prepended with the prefix.
 */
function correctRoute(route) {
    const correctedRoute = `${routePrefix}${route}`;
    console.log(correctedRoute);
    return correctedRoute;
}

export { correctRoute, itemImagePlaceholder, quickInlineStyles };