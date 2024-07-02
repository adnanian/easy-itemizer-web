import { correctRoute } from "../../helpers";

export default function RequestsTable({requests, onProcessRequest}) {

    if (!requests.length) {
        return <h1>There are currently no requests to join this organization.</h1>
    }

    const ButtonIds = Object.freeze({
        accept: "accept-button",
        deny: "deny-button"
    });

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
            {data, status: response.status}
        )))
        .then(({data, status}) => {
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
    const requestRows = requests.map((request, requestIndex) => {
        return (
            <tr key={request.id}>
                <td>{requestIndex + 1}</td>
                <td>{request.user.first_name}</td>
                <td>{request.user.last_name}</td>
                <td>{request.user.username}</td>
                <td>{request.user.email}</td>
                <td>{request.submitted_at}</td>
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
             <div className="table-container">
                <table className="modal-table">
                    <thead>
                        <tr>
                            <th>Request #</th>
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