import { useModalManager, useScreenSize } from "../../helperHooks";
import { MemberRole, correctRoute, placeholderImages } from "../../helpers";
import MemberExpeller from "../confirm-deletion/MemberExpeller";

export default function MembershipsTable({members, userMember, onUpdate, onDelete}) {
    const modalManager = useModalManager();
    const {scaleByWidth, scaleByHeight} = useScreenSize();

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
            rowClass=null;
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
                <td>{member.joined_at}</td>
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