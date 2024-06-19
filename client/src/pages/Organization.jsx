import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom"
import { ItemContext, UserContext } from "../SuperContext";
import StyledTitle from "../components/StyledTitle";
import { correctRoute } from "../helpers";

export default function Organization() {
    const { orgId } = useParams();
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const {items, setItems} = useContext(ItemContext);

    console.log(orgId);

    useEffect(() => {
        if (currentUser) {
            fetch(correctRoute(`/organizations/${orgId}`))
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });
        }
    }, [orgId, currentUser?.id]);

    return <StyledTitle text="Organization page development in progress"/>
}