import { placeholderImages } from "../helpers";

export default function AssignedItemCard({assignment, currentUserRegular}) {
    
    class QuantityStatus {
        constructor(name, className) {
            this.name = name;
            this.className = className;
        }
    }

    const generateQuantityStatus = () => {
        if (assignment.current_quantity >= assignment.enough_threshold) {
            return new QuantityStatus("GOOD", "quantity-status-good");
        } else {
            if (assignment.current_quantity === 0) {
                return new QuantityStatus("OUT", "quantity-status-out");
            } else {
                return new QuantityStatus("LOW", "quantity-status-low");
            }
        }
    }

    const quantityStatus = generateQuantityStatus();

    function handleClick(e) {

    }

    return (
        <>
            <div className={`assigned-item  three-d-round-border ${quantityStatus.className}`}>
                <p><b>{quantityStatus.name}</b></p>
                <img src={assignment.item.image_url || placeholderImages}/>
                <h4 className="assignment-name">{assignment.item.name}</h4>
                <h5 className="assignment-part">{assignment.item.part_number}</h5>
                <table>
                    <tbody>
                        <tr>
                            <td>Current Quantity</td>
                            <td>{assignment.current_quantity}</td>
                        </tr>
                        <tr>
                            <td>Enough Threshold</td>
                            <td>{assignment.enough_threshold}</td>
                        </tr>
                        <tr>
                            <td>Added at</td>
                            <td>{assignment.added_at}</td>
                        </tr>
                        <tr>
                            <td>Last Updated</td>
                            <td>{assignment.last_updated || "N/A"}</td>
                        </tr>
                    </tbody>
                </table>
                <textarea
                    readOnly
                    rows="4"
                    cols="30"
                    value={assignment.item.description}
                >
                </textarea>
                <div className="button-group">
                    <button
                        className={"quantity-changer minus-button"}
                        onClick={handleClick}
                        disabled={assignment.current_quantity === 0}
                        title="Enter how many of this item you used up."
                    >
                        -
                    </button>
                    {
                        currentUserRegular ? null : (
                            <button
                                className={"quantity-changer edit-q-button"}
                                onClick={handleClick}
                                title="Edit the enough threshold for this item."
                            >
                                &#128393;
                            </button>
                        )
                    }
                    <button 
                        className={"quantity-changer plus-button"} 
                        onClick={handleClick}
                        title="Enter how many of this item you newly received into your inventory."
                    >
                        +
                    </button>
                </div>
            </div>
        </>
    )
}