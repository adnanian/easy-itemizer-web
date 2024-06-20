/**
 * The prefix to append the routes to when making fetch request.
 * 
 * WARNING: THIS IS AUTOMATICALLY SET BY configureClient.cjs!
 * PLEASE DO NOT ALTER THE DECLARED VARIABLE MANUALLY!
 */
const routePrefix = "/api";

/**
 * Placeholder images for items, users, and organizations, in the event that valid URL's are not provided.
 */
const placeholderImages = {
    item: "/images/placeholder-item-image.jpg",
    userProfile: "/images/placeholder-profile-picture.png",
    orgLogo: "/images/placeholder-org-logo.jpg",
    orgBanner: "/images/placeholder-org-banner.jpg"
};

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
    // console.log(correctedRoute);
    return correctedRoute;
}

/** Maximum amount of time to load an application.
 * TODO add more..
 */
const loadingTimeLimit = 2000;

export {correctRoute, placeholderImages, quickInlineStyles, loadingTimeLimit };