import { useContext, useEffect } from "react";
import { useLoadingTimer, useScreenSize } from "../helperHooks";
import {UserContext} from "../SuperContext";
import StyledTitle from "../components/StyledTitle";
import LoadingScreen from "../components/LoadingScreen";
import { useNavigate } from "react-router-dom";
import { placeholderImages } from "../helpers";
import "../styles/Settings.css";

export default function UserSettings() {
    const {scaleByWidth, scaleByHeight, scaleByRatio} = useScreenSize();
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            return useLoadingTimer(navigate, "/unauthorized", 2000);
        }
    }, [currentUser?.id]);

    if (!currentUser) {
        return <LoadingScreen/>
    }

    const profilePic = currentUser.profile_picture_url || placeholderImages.userProfile;

    const imageSizing = {
        width: scaleByWidth(300, 'px'),
        height: scaleByHeight(300, 'px')
    };

    return (
        <>
            <StyledTitle text="Account & Profile"/>
            <div id="profile-container" className="three-d-round-border">
                <span id="profile-info-container">
                    <img
                        src={profilePic}
                        alt="The user\'s profile picture."
                        style={imageSizing}
                    />
                    <div className="table-container">
                        <h3 id="profile-table-title">Information</h3>
                        <table id="profile-table">
                            <tbody>
                                <tr>
                                    <td>First Name</td>
                                    <td>{currentUser.first_name}</td>
                                </tr>
                                <tr>
                                    <td>Last Name</td>
                                    <td>{currentUser.last_name}</td>
                                </tr>
                                <tr>
                                    <td>Username</td>
                                    <td>{currentUser.username}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>{currentUser.email}</td>
                                </tr>
                                <tr>
                                    <td>Created At</td>
                                    <td>{currentUser.created_at}</td>
                                </tr>
                                <tr>
                                    <td>Last Updated</td>
                                    <td>{currentUser.last_updated || "N/A"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </span>
                <div id="profile-controls" className="button-group">
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
            </div>
        </>
    );
}