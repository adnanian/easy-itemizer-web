import { useScreenSize } from "../../helperHooks";

export default function LogsTable({logs}) {

    const {scaleByHeight} = useScreenSize();

    const tableSizing = {
        height: scaleByHeight(500, 'px')
    };

    const sortByTime = (logA, logB) => {
        if (logA.occurrence < logB.occurrence) return -1;
        if (logA.occurrence > logB.occurrence) return 1;
        return 0;
    }

    const logRows = logs.toSorted(sortByTime).toReversed().map((log, logIndex) => {

        /**
         * In this case, it's justified to use the index
         * of an array as a key because it meets the following three
         * conditions:
         * 
         * 1. the list and items are static–they are not computed and do not change;
         * 2. the items in the list have no ids;
         * 3. the list is never reordered or filtered.
         * 
         * The contents of a log never change, they have no ids,
         * and they are never reordered or filtered.
         * 
         * Article of reference: https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318
         * 
         */
        const logContentLines = log.contents.map((line, lineIndex) => {
            return <p key={lineIndex}>{line}</p>
        });

        return (
            <tr key={log.id}>
                <td>{logIndex + 1}</td>
                <td style={{maxWidth: "400px"}}>
                    {logContentLines}
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