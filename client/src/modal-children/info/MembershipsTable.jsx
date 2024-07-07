import { useModalManager, useScreenSize } from "../../helperHooks";
import { MemberRole, correctRoute, dtStringToSystemTimeZone, placeholderImages } from "../../helpers";
import MemberExpeller from "../confirm-deletion/MemberExpeller";

/**
 * Renders a modal table of all the members in the organization currently
 * being viewed. If the current user is a non-REGULAR, then he/she will be
 * able to manage user access.
 * 
 * Each row in the table includes their name, username, email address, the date they joined,
 * and their role.
 * 
 * @param {Object} props 
 * @param {Array} props.members the members of the organization.
 * @param {Object} props.userMember the current user viewing the organization.
 * @param {Function} props.onUpdate the callback function to execute to update a user's role in the organization on the server side.
 * @param {Function} props.onDelete the callback function to execute upon deleting the user from the organization on the server side.
 * @returns a modal table of all members of the organization.
 */
export default function MembershipsTable({ members, userMember, onUpdate, onDelete }) {
    const modalManager = useModalManager();
    const { scaleByWidth, scaleByHeight } = useScreenSize();

    /**
     * Removes a user from the organization.
     * An ADMIN can remove either a REGULAR or another ADMIN, but never the OWNER.
     * An OWNER can only be removed by choosing to leave the organization.
     * @see ConfirmLeave component for more details.
     * 
     * @param {Object} member the user (membership) to remove. 
     */
    function handleExpel(member) {
        // console.log(member);
        modalManager.showView(
            <MemberExpeller
                memberToExpel={member}
                onDelete={onDelete}
                onClose={modalManager.clearView}
            />
        )
    }

    /**
     * Updates a user's role in the organization.
     * A user can either be promoted to ADMIN or demoted to REGULAR.
     * A user can never be promoted to an OWNER, unless the current OWNER leaves the organization and transfers ownership to that user.
     * An OWNER can never be demoted.
     * 
     * @param {Number} id the user's membership id.
     * @param {String} oldRole the user's current role in the organization.
     * @param {String} newRole the user's new role in the organization.
     */
    function handleRoleChange(id, oldRole, newRole) {
        fetch(correctRoute(`/memberships/${id}`), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                role: newRole
            })
        })
            .then((response) => response.json())
            .then((data) => {
                onUpdate(data);
                alert(`Member, \'${data.user.username}\', has changed roles from ${oldRole} to ${newRole}!`);
            })
    }

    const profilePicSizing = {
        width: scaleByWidth(50, 'px'),
        height: scaleByHeight(50, 'px')
    };

    const tableSizing = {
        height: scaleByHeight(500, 'px')
    };

    const sortByNameAndRole = (a, b) => {
        if (a.role === MemberRole.OWNER) return -1;
        if (b.role === MemberRole.OWNER) return 1;
        if (a.role === b.role) {
            const userA = a.user, userB = b.user
            if (userA.first_name < userB.first_name) return -1;
            if (userA.first_name > userB.first_name) return 1;
            if (userA.last_name < userB.last_name) return -1;
            if (userA.last_name > userB.last_name) return 1;
            if (userA.username < userB.username) return -1;
            if (userA.username > userB.username) return 1;
            return 0;
        }
        if (a.role === MemberRole.ADMIN) return -1;
        if (b.role === MemberRole.ADMIN) return 1;
    }

    const memberRows = members.toSorted(sortByNameAndRole).map((member, memberIndex) => {
        // console.log(member.user);
        let rowClass;
        if (userMember.role !== MemberRole.REGULAR && member.user_id === userMember.user_id) {
            rowClass = (userMember.role === MemberRole.OWNER) ? "youre-the-owner" : "youre-an-admin";
        } else if (member.role === MemberRole.OWNER) {
            rowClass = "owner";
        } else if (member.role === MemberRole.ADMIN) {
            rowClass = "admin";
        } else if (member.user_id === userMember.user_id) {
            rowClass = "you";
        } else {
            rowClass = null;
        }

        const roleChangeText = member.role === MemberRole.REGULAR ? "Promote" : "Demote";
        const oppositeRole = member.role === MemberRole.REGULAR ? MemberRole.ADMIN : MemberRole.REGULAR;
        const roleChangteTooltip = `${roleChangeText} user, ${member.user.username} from ${member.role} to ${oppositeRole}.`

        return (
            <tr key={member.id} className={rowClass}>
                <td>{memberIndex + 1}</td>
                <td>
                    <img
                        src={member.user.profile_picture_url || placeholderImages.userProfile}
                        style={profilePicSizing}
                        className="circle"
                    />
                </td>
                <td>{member.user.first_name}</td>
                <td>{member.user.last_name}</td>
                <td>{member.user.username}</td>
                <td>{member.user.email}</td>
                <td>{dtStringToSystemTimeZone(member.joined_at)}</td>
                <td>{member.role}</td>
                {
                    userMember.role === MemberRole.REGULAR ? null : (
                        <td>
                            {
                                member.role === MemberRole.OWNER || member.user_id === userMember.user_id ? "N/A" : (
                                    <div className="button-block-grid">
                                        <button
                                            className="access-control"
                                            onClick={() => handleRoleChange(member.id, member.role, oppositeRole)}

                                            title={roleChangteTooltip}
                                        >
                                            {roleChangeText}
                                        </button>
                                        <button
                                            className="access-control"
                                            onClick={() => handleExpel(member)}
                                            title={`Remove user, ${member.user.username}, from this organization.`}
                                        >
                                            Expel
                                        </button>
                                    </div>
                                )
                            }
                        </td>
                    )
                }
            </tr>
        )
    });

    return (
        <>
            <h1>List of Members</h1>
            <div className="table-container" style={tableSizing}>
                <table className="modal-table">
                    <thead>
                        <tr>
                            <th>Row #</th>
                            <th>Icon</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Join Date</th>
                            <th>Role</th>
                            {userMember.role === MemberRole.REGULAR ? null : <th>Manage Access</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {memberRows}
                    </tbody>
                </table>
            </div>
            {modalManager.modal}
        </>
    )
}