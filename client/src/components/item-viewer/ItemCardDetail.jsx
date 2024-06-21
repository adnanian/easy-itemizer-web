import { placeholderImages, quickInlineStyles } from "../../helpers";
import "../../styles/components/ItemCardDetail.css";
import BigText from "../BigText";

export default function ItemCardDetail({user, item}) {
    console.log(item);

    if (!item) {
        return <BigText><p>Click on an item to view more details!</p></BigText>
    }

    const username = item.user_id === user.id ? "You" : item.user.username;
    const isPublic = item.is_public ? "Public" : "Private";

    return (
        <div id="detailed-item-card" className="three-d-round-border">
            <h1>{item.name}</h1>
            <div id="detail-wrapper">
                <img src={item?.image_url || placeholderImages.item} className="round-border"/>
                <div id="detail-block">
                    <h2 style={quickInlineStyles.centerText}>Details</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td>Part #</td>
                                <td>{item.part_number}</td>
                            </tr>
                            <tr>
                                <td>Added by</td>
                                <td>{username}</td>
                            </tr>
                            <tr>
                                <td>Added at</td>
                                <td>{item.created_at}</td>
                            </tr>
                            <tr>
                                <td>Last Updated</td>
                                <td>{item.last_updated || "N/A"}</td>
                            </tr>
                            <tr>
                                <td>Visibility</td>
                                <td>{isPublic}</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 style={{...quickInlineStyles.centerText, ...quickInlineStyles.biggerFont}}>
                        Description
                    </h3>
                    <textarea
                        readOnly
                        rows="6"
                        cols="40"
                        value={item.description}
                        style={quickInlineStyles.rectangularPad}
                    >
                    </textarea>
                    <div className="button-group">
                        {item.user_id === user.id ? (
                            <>
                                <button
                                    title="Edit item information."
                                >
                                    &#128393;
                                    Edit
                                </button>
                                <button
                                    title="Delete the item from the system."
                                >
                                    &#128465;
                                    Delete
                                </button>
                            </>
                        ) : <button
                                title="Report this item for inappropriate content."
                            >
                                &#127988;
                                Report
                            </button>}
                    </div>
                </div>
            </div>
        </div>
    )
}