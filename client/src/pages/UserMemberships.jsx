import { useContext } from "react";
import {UserContext} from "../SuperContext";
import StyledTitle from "../components/StyledTitle";

export default function UserMemberships() {
    const {currentUser, setCurrentUser} = useContext(UserContext);

    if (!currentUser) {
        return <StyledTitle text="Loading..."/>
    }

    const membershipCards = currentUser.memberships.map((membership) => {
        console.log(membership.organizations);
        return membership;
    });

    return (
        <main>
            <div>

            </div>
        </main>
    )
}