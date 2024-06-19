import { useContext } from "react";
import {UserContext} from "../SuperContext";
import StyledTitle from "../components/StyledTitle";
import BigText from "../components/BigText";
import MembershipCard from "../components/MembershipCard";
import "../styles/UserMemberships.css";

export default function UserMemberships() {
    const {currentUser, setCurrentUser} = useContext(UserContext);

    if (!currentUser) {
        return <StyledTitle text="Loading..."/>
    }

    const membershipCards = currentUser.memberships.map((membership) => {
        return (
            <li key={membership.id} className="three-d-round-border">
                <MembershipCard membership={membership}/>
            </li>
        )
    });

    return (
        <main>
            <StyledTitle text="Your Organizations"/>
            <BigText id="about-org-page">
                <h2>Below are the organizations that you currently belong to!</h2>
            </BigText>
            <button 
                id="new-org-button"
                title="Opens up a modal form for you to fill out the details of the organization you wish to create."
            >
                Create a new organization!
            </button>
            <div id="membership-list-container">
                <ul id="membership-list">
                    {membershipCards}
                </ul>
            </div>
        </main>
    )
}