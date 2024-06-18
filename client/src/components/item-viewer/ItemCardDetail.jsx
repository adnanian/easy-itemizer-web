import { itemImagePlaceholder } from "../../helpers";
import "../../styles/components/ItemCardDetail.css";
import BigText from "../BigText";

export default function ItemCardDetail({item}) {
    console.log(item);

    if (!item) {
        return <BigText><p>Click on an item to view more details!</p></BigText>
    }

    const isPublic = item.is_public ? "YES" : "NO"

    return (
        <div id="detailed-item-card">
            <h1>{item.name}</h1>
            <img src={item?.image_url || itemImagePlaceholder}/>
            <table>
                <h2>Details</h2>
                <tbody>
                    <tr className="small-table-row">
                        <td>Part #</td>
                        <td>{item.part_number}</td>
                    </tr>
                    <tr className="small-table-row">
                        <td>Added by</td>
                        <td>{item.user.username}</td>
                    </tr>
                    <tr className="small-table-row">
                        <td>Added at</td>
                        <td>{item.created_at}</td>
                    </tr>
                    <tr className="small-table-row">
                        <td>Last Updated</td>
                        <td>{item.last_updated || "N/A"}</td>
                    </tr>
                    <tr className="small-table-row">
                        <td>Is Public</td>
                        <td>{isPublic}</td>
                    </tr>
                    <tr className="small-table-row">
                        <td>Description</td>
                        <td>{item.description}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}