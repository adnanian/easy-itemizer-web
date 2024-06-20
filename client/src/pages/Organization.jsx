import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { ItemContext, UserContext } from "../SuperContext";
import StyledTitle from "../components/StyledTitle";
import { correctRoute, loadingTimeLimit } from "../helpers";
import LoadingScreen from "../components/LoadingScreen";

export default function Organization() {
    const { orgId } = useParams();
    const navigate = useNavigate();
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const {items, setItems} = useContext(ItemContext);

    console.log(currentUser);

    useEffect(() => {
        if (currentUser) {
            if (currentUser.memberships.find((membership) => membership.organization_id == orgId)) {
                fetch(correctRoute(`/organizations/${orgId}`))
                .then((response) => response.json())
                .then((data) => {
                    // let userMemberFound = false;
                    // for (membership of data.memberships) {
                    //     if (membership.user_id === currentUser.id)
                    // }
                });
            } else {
                navigate("/error");
            }
        } else {
            const timer = setTimeout(() => navigate("/error"), loadingTimeLimit);
            return ()=> clearTimeout(timer);
        }
    }, [orgId, currentUser?.id]);

    if (!currentUser) {
        return <LoadingScreen/>
    }

    return (
        <main>
            <p>Add stuff here...</p>
        </main>
    )
}