import { useContext, useEffect } from "react";
import { UserContext } from "../SuperContext";
import StyledTitle from "../components/StyledTitle";
import BigText from "../components/BigText";
import MembershipCard from "../components/MembershipCard";
import "../styles/UserMemberships.css";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import { useLoadingTimer, useModalManager } from "../helperHooks";
import NewOrgForm from "../modal-children/NewOrgForm";

/**
 * Displays all the organization and membership details that the current user belongs to.
 * 
 * @returns the user's membership details rendered in JoinedOrgTile components.
 */
export default function UserMemberships() {
    const modalManager = useModalManager();
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            return useLoadingTimer(navigate, "/unauthorized", 2000);
        }
    }, [currentUser?.id]);

    if (!currentUser) {
        return <LoadingScreen />
    }

    /**
     * Sorts the user's memberships by the name of the organization associated with it.
     * 
     * @param {Object} membershipA the membership to compare.
     * @param {Object} membershipB the membership to be compared.
     * @returns the appropriate sorting value that the comparison results in.
     */
    const sortByName = (membershipA, membershipB) => {
        if (membershipA.organization.name < membershipB.organization.name) return -1;
        if (membershipA.organization.name > membershipB.organization.name) return 1;
        return 0;
    }

    const membershipCards = currentUser.memberships?.toSorted(sortByName).map((membership) => {
        return (
            <li key={membership.id} className="three-d-round-border">
                <MembershipCard membership={membership} />
            </li>
        )
    });

    /**
     * Updates the currentUser state value by adding a new membership
     * object to its membership array.
     * 
     * This function is only called when a user creates a new organization.
     * A membership is added because the user now owns that new organization. 
     * 
     * @param {Object} membershipToAdd the membership to add.
     */
    function addNewMembership(membershipToAdd) {
        setCurrentUser({
            ...currentUser,
            memberships: [...currentUser.memberships, membershipToAdd]
        });
    }

    /**
     * Displays a dialog with the NewOrgForm component.
     */
    function openModal() {
        modalManager.showView(
            <NewOrgForm userId={currentUser.id} onAdd={addNewMembership} onClose={modalManager.clearView} />
        )
    }

    return (
        <>
            <StyledTitle text="Your Organizations" />
            <BigText id="about-org-page">
                <h2>Below are the organizations that you currently belong to!</h2>
            </BigText>
            <button
                id="new-org-button"
                title="Opens up a modal form for you to fill out the details of the organization you wish to create."
                onClick={openModal}
            >
                Create a new organization!
            </button>
            <div id="membership-list-container">
                <ul id="membership-list">
                    {membershipCards}
                </ul>
            </div>
            {modalManager.modal}
        </>
    )
}