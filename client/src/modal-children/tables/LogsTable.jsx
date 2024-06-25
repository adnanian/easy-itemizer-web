import { useScreenSize } from "../../helperHooks";

export default function LogsTable({logs}) {

    const {scaleByHeight} = useScreenSize();

    const tableSizing = {
        height: scaleByHeight(500, 'px')
    };

    const logRows = logs.toReversed().map((log, logIndex) => {
        return (
            <tr>
                <td>{logIndex + 1}</td>
                <td style={{maxWidth: "400px"}}>
                    <p>{log.contents}</p>
                </td>
                <td>{log.occurrence}</td>
            </tr>
        )
    });

    return (
        <>
            <h1>Logs</h1>
            <div className="table-container" style={tableSizing}>
                <table className="modal-table">
                    <thead>
                        <tr>
                            <th>Row #</th>
                            <th>Event</th>
                            <th>Occurrence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logRows}
                    </tbody>
                </table>
            </div>
        </>
    )
}