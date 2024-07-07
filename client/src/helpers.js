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
    orgBanner: "/images/placeholder-org-banner.png"
};

// Object of quick inline styles to apply onto elements.
const quickInlineStyles = {
    centerText: { textAlign: "center" },
    biggerFont: { fontSize: "125%" },
    rectangularPad: { padding: "8px" }
};

// System time Zone
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Adds the correct route prefix to a given route and returns it.
 * This is meant to be used during fetched requests.
 * 
 * @param {String} route the route.
 * @returns the route prepended with the prefix.
 */
function correctRoute(route) {
    const correctedRoute = `${routePrefix}${route}`;
    // console.log(correctedRoute);
    return correctedRoute;
}

/**
 * Parses a date time string, converts it
 * to system's time zone, and return it.
 * 
 * References: 
 * https://stackoverflow.com/questions/40768606/i-have-a-utc-string-and-i-want-to-convert-it-to-utc-date-object-in-javascript
 * https://www.tutorialspoint.com/how-to-detect-user-timezone-in-javascript
 * 
 * 
 * @param {String} dtString the date time.
 * @returns the date time in the system's time zone.
 */
function dtStringToSystemTimeZone(dtString) {
    if (!dtString) {
        return "N/A";
    }
    const date = new Date(dtString + "Z");
    // console.log(timeZone);
    const dateTZ = date.toLocaleString("en-US", {timeZone: timeZone});
    // console.log(dateTZ);
    return dateTZ;
}

/**
 * Member roles.
 */
const MemberRole = Object.freeze({
    REGULAR: "REGULAR",
    ADMIN: "ADMIN",
    OWNER: "OWNER"
});

export { correctRoute, dtStringToSystemTimeZone, placeholderImages, quickInlineStyles, MemberRole };