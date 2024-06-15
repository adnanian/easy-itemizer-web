/**
 * The prefix to append the routes to when making fetch request.
 * 
 * WARNING: THIS IS AUTOMATICALLY SET BY configureClient.cjs!
 * PLEASE DO NOT ALTER THE DECLARED VARIABLE MANUALLY!
 */
const routePrefix = "/api"

/**
 * Adds the correct route prefix to a given route and returns it.
 * This is meant to be used during fetched requests.
 * 
 * @param {*} route the route.
 * @returns the route prepended with the prefix.
 */
function correctRoute(route) {
    return `${routePrefix}${route}`;
}

export { correctRoute };