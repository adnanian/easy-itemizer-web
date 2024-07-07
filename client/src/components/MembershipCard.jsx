import { Link } from "react-router-dom";
import { placeholderImages, dtStringToSystemTimeZone } from "../helpers";

/**
 * Creates a linkable tile that consists of the basic information
 * about an organization that the current user belongs to as well as
 * the users membership information.
 * 
 * When the link is clicked, the user is navigated to the Organization page,
 * where he/she can access the orgnaization information, such as viewing
 * inventory, and other members.
 * 
 * @param {Object} props
 * @param {Object} props.membership the current user's membership tied to the organization. 
 * 
 * @returns A tile of the user's membership information.
 */
export default function MembershipCard({ membership }) {
    return (
        <Link 
            to={`/my-organizations/${membership.organization_id}`} 
            className="org-link"
            title="Click to navigate to this organization's page."
        >
            <div className="membership-container round-border">
                <img
                    src={membership.organization.image_url || placeholderImages.orgLogo}
                    className="circle"
                />
                <h2>{membership.organization.name}</h2>
                <h3>{membership.role}</h3>
                <p>Created on {dtStringToSystemTimeZone(membership.organization.created_at)}</p>
                <p>Joined on {dtStringToSystemTimeZone(membership.joined_at)}.</p>
                <textarea
                    readOnly
                    rows="5"
                    cols="30"
                    value={membership.organization.description}
                    className="membership-desc"
                ></textarea>
            </div>
        </Link>
    )
}