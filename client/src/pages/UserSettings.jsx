import { useContext, useEffect } from "react";
import { useLoadingTimer, useModalManager, useScreenSize } from "../helperHooks";
import {UserContext} from "../SuperContext";
import StyledTitle from "../components/StyledTitle";
import LoadingScreen from "../components/LoadingScreen";
import { useNavigate } from "react-router-dom";
import { dtStringToSystemTimeZone, placeholderImages } from "../helpers";
import "../styles/Settings.css";
import EditProfileForm from "../modal-children/EditProfileForm";
import AccountDeleter from "../modal-children/confirm-deletion/AccountDeleter";

export default function UserSettings() {
    const modalManager = useModalManager();
    const {scaleByWidth, scaleByHeight, scaleByRatio} = useScreenSize();
    const {currentUser, setCurrentUser, logout} = useContext(UserContext);
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

    const ButtonIds = Object.freeze({
        edit: "edit-button",
        delete: "delete-button"
    });

    const ModalOpeners = Object.freeze({
        [ButtonIds.edit]: (
            <EditProfileForm
                user={currentUser}
                onUpdate={setCurrentUser}
                onClose={modalManager.clearView}
            />
        ),
        [ButtonIds.delete]: (
            <AccountDeleter
                user={currentUser}
                onLogout={logout}
                onClose={modalManager.clearView}
            />
        )
    });

    function handleClick(e) {
        modalManager.showView(ModalOpeners[e.target.id]);
    }

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
                                    <td>{dtStringToSystemTimeZone(currentUser.created_at)}</td>
                                </tr>
                                <tr>
                                    <td>Last Updated</td>
                                    <td>{dtStringToSystemTimeZone(currentUser.last_updated)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </span>
                <div id="profile-controls" className="button-group">
                    <button
                        id={ButtonIds.edit}
                        title="Edit your profile information, including updating your photo and changing your password."
                        onClick={handleClick}
                    >
                        Edit
                    </button>
                    <button
                        id={ButtonIds.delete}
                        title="Permanently delete your Easy Itemizer account!"
                        onClick={handleClick}
                    >
                        Delete
                    </button>
                </div>
            </div>
            {modalManager.modal}
        </>
    );
}