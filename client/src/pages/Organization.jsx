import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom"
import { ItemContext, UserContext } from "../SuperContext";
import StyledTitle from "../components/StyledTitle";

export default function Organization() {
    const orgId = useParams();
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const {items, setItems} = useContext(ItemContext);

    useEffect(() => {

    }, [orgId]);

    return <StyledTitle text="Organization page development in progress"/>
}