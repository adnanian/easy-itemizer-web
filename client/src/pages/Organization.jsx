import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { ItemContext, UserContext } from "../SuperContext";
import { MemberRole, correctRoute, placeholderImages } from "../helpers";
import LoadingScreen from "../components/LoadingScreen";
import { useLoadingTimer, useModalManager } from "../helperHooks";
import StyledTitle from "../components/StyledTitle";
import "../styles/Organization.css";
import AssignedItemCard from "../components/AssignedItemCard";
import MembershipsTable from "../modal-children/info/MembershipsTable";
import ItemFormContainer from "../modal-children/add-item/ItemFormContainer";
import LogsTable from "../modal-children/info/LogsTable";
import OrgDescription from "../modal-children/info/OrgDescription";
import RequestsTable from "../modal-children/info/RequestsTable";
import EditOrgForm from "../modal-children/EditOrgForm";

export default function Organization() {
    const modalManager = useModalManager();
    const [userMember, setUserMember] = useState(null);
    const [organization, setOrganization] = useState(null);
    const [title, setTitle] = useState("");
    const { currentUser } = useContext(UserContext);
    const { items, setItems } = useContext(ItemContext);
    const { orgId } = useParams();
    const navigate = useNavigate();
    
    

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
                        setTitle(data.name);
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

    /**
     * Adds an assignment to the current organization's array of assignments.
     * Also adds a new item to the system if the assigned item isn't for an
     * already existing item.
     * 
     * @param {Object} assignment the assignment to add. 
     * @param {Object} item the item to add.
     */
    function addAssignment(data) {
        const item = data["item"]
        const assignmentToAdd = data["assignment"]
        console.log(item);
        console.log(assignmentToAdd);
        if (item) {
            setItems([...items, item]);
        }
        setOrganization({
            ...organization,
            assignments: [...organization.assignments, assignmentToAdd]
        })
    }

    /**
     * Updates an assignment's information on the frontend.
     * 
     * @param {Object} updatedItemAssignment the assignment to update.
     */
    function updateAssignment(updatedItemAssignment) {
        setOrganization({
            ...organization,
            assignments: organization.assignments.map((assignment) => {
                return assignment.id !== updatedItemAssignment.id ? assignment : updatedItemAssignment;
            })
        });
    }

    /**
     * Removes an assignment from the organization's assignments array.
     * 
     * @param {Object} assignmentToDelete the assignment to delete.
     */
    function deleteAssignment(assignmentToDelete) {
        setOrganization({
            ...organization,
            assignments: organization.assignments.filter((assignment) => {
                return assignment.id !== assignmentToDelete.id;
            })
        });
    }

    /**
     * TODO
     * 
     * @param {*} requestToDelete 
     * @param {*} membershipToAdd 
     */
    function processRequest(requestToDelete, membershipToAdd = null) {
        console.log("Deleting request:", requestToDelete);
        setOrganization((oldOrgData) => {
            const newOrgData = {...oldOrgData};
            if (membershipToAdd) {
                newOrgData.memberships = [...newOrgData.memberships, membershipToAdd];
            }
            newOrgData.requests = newOrgData.requests.filter((request) => request.id !== requestToDelete.id);
            modalManager.showView(<RequestsTable requests={newOrgData.requests} onProcessRequest={processRequest} />)
            return newOrgData;
        })
    
        console.log("Updated organization state:", organization.requests.find((request) => request.id === requestToDelete.id));
    }

    function updateMembership(membershipToUpdate) {
        setOrganization((oldOrgData) => {
            const newOrgData = {...oldOrgData};
            newOrgData.memberships = newOrgData.memberships.map((membership) => {
                return membership.id === membershipToUpdate.id ? membershipToUpdate : membership;
            });
            modalManager.showView(
                <MembershipsTable
                    members={newOrgData.memberships}
                    userMember={userMember}
                    onUpdate={updateMembership}
                    onDelete={deleteMembership}
                />
            );
            return newOrgData;
        });
    }

    function deleteMembership(membershipToDelete) {
        setOrganization((oldOrgData) => {
            const newOrgData = {...oldOrgData};
            newOrgData.memberships = newOrgData.memberships.filter((membership) => {
                return membership.id !== membershipToDelete.id;
            });
            modalManager.showView(
                <MembershipsTable
                    members={newOrgData.memberships}
                    userMember={userMember}
                    onUpdate={updateMembership}
                    onDelete={deleteMembership}
                />
            );
            return newOrgData;
        });
    }

    const ButtonId = Object.freeze({
        BACK: "back-button",
        LEAVE: "leave-button",
        VIEW_MEMBERS: "member-list-button",
        SEND_UPDATE: "update-button",
        ADD: "add-button",
        VIEW_REQUESTS: "view-requests-button",
        INVITE: "invite-button",
        VIEW_LOGS: "view-logs-button",
        ABOUT: "about-button", // View organization description
        EDIT: "edit-button",
        DELETE: "delete-button" // for owners to delete the entire organization.
    });

    const ModalOpeners = {
        [ButtonId.VIEW_MEMBERS]: (
            <MembershipsTable
                members={organization.memberships}
                userMember={userMember}
                onUpdate={updateMembership}
                onDelete={deleteMembership}
            />
        ),
        [ButtonId.ADD]: (
            <ItemFormContainer
                orgId={orgId}
                user={currentUser}
                onAdd={addAssignment}
                onClose={modalManager.clearView}
            />
        ),
        [ButtonId.VIEW_REQUESTS]: (
            <RequestsTable requests={organization.requests} onProcessRequest={processRequest} />
        ),
        [ButtonId.VIEW_LOGS]: (
            <LogsTable logs={organization.organization_logs} />
        ),
        [ButtonId.ABOUT]: (
            <OrgDescription name={organization.name} description={organization.description} />
        ),
        [ButtonId.EDIT]: (
            <EditOrgForm org={organization} onUpdate={setOrganization} onClose={modalManager.clearView}/>
        )
    };

    const banner = organization.banner_url || placeholderImages.orgBanner;
    const logoImage = organization.image_url || placeholderImages.orgLogo;

    const orgHeaderStyling = {
        background: `linear-gradient(to right bottom, rgba(47, 79, 79, 0.5), rgba(192, 192, 192, 0.5)), url(${banner}) no-repeat center center`,
        backgroundSize: "100% 100%"
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

    const assignedItemCards = organization.assignments?.toSorted(sortByName).map((assignment) => {
        return (
            <li key={assignment.id}>
                <AssignedItemCard
                    assignment={assignment}
                    currentUserRegular={userMember.role === MemberRole.REGULAR}
                    onUpdate={updateAssignment}
                    onDelete={deleteAssignment}
                />
            </li>
        )
    });

    function handleOrgControlClick(e) {
        switch (e.target.id) {
            case ButtonId.BACK:
                navigate(-1);
                break;
            case ButtonId.SEND_UPDATE:
                setTitle("Sending update...");
                fetch(correctRoute("/status_report"), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        org_id: organization.id
                    })
                })
                .then((response) => {
                    if (response.ok) {
                        alert("Status report generation and sending successful.");
                    } else {
                        alert("An internal error occurred. Please contact support.");
                    }
                })
                .finally(() => setTitle(organization.name));
                break;
            default:
                modalManager.showView(ModalOpeners[e.target.id]);
                break;
        }
    }

    return (
        <React.Fragment>
            <div id="org-header" style={orgHeaderStyling}>
                <StyledTitle text={title} />
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
                                    id={ButtonId.VIEW_REQUESTS}
                                    className={orgControlsClassName}
                                    onClick={handleOrgControlClick}
                                    title=""
                                >
                                    View Requests
                                </button>
                                <button
                                    id={ButtonId.INVITE}
                                    className={orgControlsClassName}
                                    onClick={handleOrgControlClick}
                                    title=""
                                >
                                    Invite Others
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
                                    id={ButtonId.EDIT}
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
            {modalManager.modal}
        </React.Fragment>
    )
}