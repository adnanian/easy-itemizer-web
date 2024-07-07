import { useScreenSize } from "../../helperHooks";
import { correctRoute, dtStringToSystemTimeZone } from "../../helpers";

/**
 * Renders a modal table of the users who have submitted requests to join an organization.
 * Each row contains the user's name, username, email, and the message that they wrote when
 * they submitted the request.
 * 
 * Also included are two buttons in each row: one for accepting , and another for rejecting that user.
 * Clicking each button will switch the view to a confirmation for your decision. If the modal is closed
 * before confirmation, no changes will be made.
 * 
 * If there are no requests made to join the organization, then a message will be displayed to the user
 * instead.
 * 
 * Note: only ADMINs or OWNERS are allowed to see this component.
 * 
 * @param {Object} props
 * @param {Array} props.requests the requests made to join this organization.
 * @param {Function} props.onProcessRequest the callback function to execute to process the request on the frontend. 
 * @returns a modal table of all the current active requests to join the organization (if any), or a message indicating otherwise.
 */
export default function RequestsTable({ requests, onProcessRequest }) {
    const { scaleByWidth, scaleByHeight } = useScreenSize();

    if (!requests.length) {
        return <h1>There are currently no requests to join this organization.</h1>
    }

    const ButtonIds = Object.freeze({
        accept: "accept-button",
        deny: "deny-button"
    });

    /**
     * Deletes a request from the server, and then creates a new membership tied
     * to the current organization using the information from the deleted request.
     * 
     * @param {Object} request the request to accept. 
     */
    function welcomeNewMember(request) {
        fetch(correctRoute("/accept_request"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                request_id: request.id
            })
        })
            .then((response) => response.json().then((data) => (
                { data, status: response.status }
            )))
            .then(({ data, status }) => {
                if (status === 201) {
                    onProcessRequest(request, data);
                    alert("You have added a new member to the organization.");
                } else {
                    throw new Error(data.message);
                }
            })
            .catch((error) => {
                console.error(error);
                alert(`${error} - Please contact support if this issue persists.`);
            });
    }

    /**
     * Deletes a request from the server.
     * 
     * @param {Object} request the request to deny. 
     */
    function denyRequest(request) {
        fetch(correctRoute(`/requests/${request.id}`), {
            method: "DELETE"
        })
            .then((response) => {
                if (response.ok) {
                    onProcessRequest(request);
                    console.log("Request denial success.");
                } else {
                    throw new Error("An unknown error occurred. Please contact support.");
                }
            })
            .catch((error) => {
                console.error(error);
                alert(error);
            });
    }

    const profilePicSizing = {
        width: scaleByWidth(50, 'px'),
        height: scaleByHeight(50, 'px')
    };

    const tableSizing = {
        height: scaleByHeight(500, 'px')
    };

    const requestRows = requests.map((request, requestIndex) => {
        return (
            <tr key={request.id}>
                <td>{requestIndex + 1}</td>
                <td>
                    <img
                        src={request.user.profile_picture_url || placeholderImages.userProfile}
                        style={profilePicSizing}
                        className="circle"
                    />
                </td>
                <td>{request.user.first_name}</td>
                <td>{request.user.last_name}</td>
                <td>{request.user.username}</td>
                <td>{request.user.email}</td>
                <td>{dtStringToSystemTimeZone(request.submitted_at)}</td>
                <td>{request.reason_to_join}</td>
                <td>
                    <div className="button-block-grid">
                        <button
                            id={ButtonIds.accept}
                            className="access-control"
                            title="Accept this user's request to join your organization."
                            onClick={() => welcomeNewMember(request)}
                        >
                            Accept
                        </button>
                        <button
                            id={ButtonIds.deny}
                            className="access-control"
                            title="Deny this user's request to join your organization."
                            onClick={() => denyRequest(request)}
                        >
                            Deny
                        </button>
                    </div>
                </td>
            </tr>
        )
    });

    return (
        <>
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
                            <th>Submission Time</th>
                            <th>Message</th>
                            <th>Manage Request</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requestRows}
                    </tbody>
                </table>
            </div>
        </>
    )
}