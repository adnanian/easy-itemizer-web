import {Link} from "react-router-dom";
import { placeholderImages } from "../helpers";

export default function MembershipCard({membership}) {
    return (
        <Link to={`/my-organizations/${membership.organization_id}`} className="org-link">
            <div className="membership-container round-border">
                <img 
                    src={membership.organization.image_url || placeholderImages.orgLogo}
                    className="circle"
                />
                <h2>{membership.organization.name}</h2>
                <h3>{membership.role}</h3>
                <p>Created on {membership.organization.created_at}</p>
                <p>Joined on {membership.joined_at}.</p>
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