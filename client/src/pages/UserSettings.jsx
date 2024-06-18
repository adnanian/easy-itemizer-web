import { useContext } from "react";
import {UserContext} from "../SuperContext";
import StyledTitle from "../components/StyledTitle";

export default function UserSettings() {
    const {currentUser, setCurrentUser} = useContext(UserContext);

    return <StyledTitle text="Settings - To be implemented..."/>;
}