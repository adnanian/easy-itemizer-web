import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { ItemContext, UserContext } from "../SuperContext";
import { MemberRole, correctRoute, placeholderImages } from "../helpers";
import LoadingScreen from "../components/LoadingScreen";
import { useLoadingTimer } from "../helperHooks";
import StyledTitle from "../components/StyledTitle";
import "../styles/Organization.css";
import AssignedItemCard from "../components/AssignedItemCard";

export default function Organization() {
    const { orgId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const { items, setItems } = useContext(ItemContext);
    const [userMember, setUserMember] = useState(null);
    const [organization, setOrganization] = useState(null);
    const orgControlsClassName = "org-controls";

    // console.log(currentUser);

    useEffect(() => {
        if (currentUser) {
            const userMembership = currentUser.memberships.find((membership) => membership.organization_id == orgId);
            if (userMembership) {
                fetch(correctRoute(`/organizations/${orgId}`))
                    .then((response) => response.json())
                    .then((data) => {
                        setOrganization(data);
                        setUserMember(userMembership);
                    });
            } else {
                navigate("/error");
            }
        } else {
            return useLoadingTimer(navigate, "/error", 2000);
        }
    }, [orgId, currentUser]);

    if (!currentUser || !userMember) {
        return <LoadingScreen />
    }

    const ButtonId = Object.freeze({
        BACK: "back-button",
        LEAVE: "leave-button",
        VIEW_MEMBERS: "member-list-button",
        SEND_UPDATE: "update-button",
        ADD: "add-button",
        REMOVE: "remove-button", // for admins to remove managed items from the organization.
        VIEW_REQUESTS: "view-requests-button",
        VIEW_LOGS: "view-logs-button",
        ABOUT: "about-button", // View organization description
        EDIT: "edit-button",
        DELETE: "delete-button" // for owners to delete the entire organization.
    });

    const banner = organization.banner || placeholderImages.orgBanner;
    const logoImage = organization.image_url || placeholderImages.orgLogo;

    const orgHeaderStyling = {
        background: `linear-gradient(to right bottom, rgba(47, 79, 79, 0.5), rgba(192, 192, 192, 0.5)), url(${banner}) no-repeat center center`,
        backgroundSize: "cover"
    };

    const orgBodyStyling = {
        background: `linear-gradient(to right bottom, rgba(192, 192, 192, 0.5), rgba(47, 79, 79, 0.5)), url(${logoImage}) no-repeat center center`,
        backgroundSize: "100% 100%"
    }

    /**
     * 
     * @param {*} a 
     * @param {*} b 
     * @returns 
     */
    const sortByName = (a, b) => {
        if (a.item.name < b.item.name) return -1;
        if (a.item.name > b.item.name) return 1;
        return 0;
    };

    const assignedItemCards = organization.assignments?.sort(sortByName).map((assignment) => {
        return (
            <li key={assignment.id}>
                <AssignedItemCard assignment={assignment}/>
            </li>
        )
    });

    function handleOrgControlClick(e) {
        
    }

    return (
        <React.Fragment>
            <div id="org-header" style={orgHeaderStyling}>
                <StyledTitle text={organization.name} />
                <span id="org-controls" className="three-d-round-border">
                    <button
                        id={ButtonId.BACK}
                        className={orgControlsClassName}
                        onClick={handleOrgControlClick}
                        title=""
                    >
                        &larr;Back
                    </button>
                    <button
                        id={ButtonId.LEAVE}
                        className={orgControlsClassName}
                        onClick={handleOrgControlClick}
                        title=""
                    >
                        Leave
                    </button>
                    <button
                        id={ButtonId.VIEW_MEMBERS}
                        className={orgControlsClassName}
                        onClick={handleOrgControlClick}
                        title=""
                    >
                        View List of Members
                    </button>
                    <button
                        id={ButtonId.SEND_UPDATE}
                        className={orgControlsClassName}
                        onClick={handleOrgControlClick}
                        title=""
                    >
                        Send Update
                    </button>
                    <button
                        id={ButtonId.ADD}
                        className={orgControlsClassName}
                        onClick={handleOrgControlClick}
                        title=""
                    >
                        Add Item
                    </button>
                    {
                        userMember.role === MemberRole.REGULAR ? null : (
                            <>
                                <button
                                    id={ButtonId.REMOVE}
                                    className={orgControlsClassName}
                                    onClick={handleOrgControlClick}
                                    title=""
                                >
                                    Remove Item
                                </button>
                                <button
                                    id={ButtonId.VIEW_REQUESTS}
                                    className={orgControlsClassName}
                                    onClick={handleOrgControlClick}
                                    title=""
                                >
                                    View Requests
                                </button>
                                <button
                                    id={ButtonId.VIEW_LOGS}
                                    className={orgControlsClassName}
                                    onClick={handleOrgControlClick}
                                    title=""
                                >
                                    View Logs
                                </button>
                            </>
                        )
                    }
                    <button
                        id={ButtonId.ABOUT}
                        className={orgControlsClassName}
                        onClick={handleOrgControlClick}
                        title=""
                    >
                        About Org.
                    </button>
                    {
                        userMember.role !== MemberRole.OWNER ? null : (
                            <>
                                <button
                                    id={ButtonId.DELETE}
                                    className={orgControlsClassName}
                                    onClick={handleOrgControlClick}
                                    title=""
                                >
                                    Edit Org.
                                </button>
                                <button
                                    id={ButtonId.DELETE}
                                    className={orgControlsClassName}
                                    onClick={handleOrgControlClick}
                                    title=""
                                >
                                    Delete Org.
                                </button>
                            </>
                        )
                    }
                </span>
            </div>
            <div id="org-body" style={orgBodyStyling}>
                <ul id="assigned-item-list">
                    {assignedItemCards}
                </ul>
            </div>
        </React.Fragment>
    )
}