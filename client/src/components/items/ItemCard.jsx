import { itemImagePlaceholder } from "../../helpers";
import "../../styles/components/ItemCard.css";

export default function ItemCard({item}) {
    return (
        <div className="item-card">
            <img src={item.image_url || itemImagePlaceholder}/>
            <p><b>{item.name}</b></p>
            <p>{item.part_number || "N/A"}</p>
            <p>{`Added by:  ${item.user.username}`}</p>
            <p>{item.description}</p>
        </div>
    )
}