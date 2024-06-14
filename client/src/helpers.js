// ADD STUFF HERE
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