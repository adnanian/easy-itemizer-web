export default function RequestsTable({requests, orgName, onUpdate}) {


    if (!requests.length) {
        return <h1>There are currently no requests to join this organization.</h1>
    }

    return (
        <>
             <div className="table-container">
                <table>
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
                </table>
             </div>
        </>
    )
}