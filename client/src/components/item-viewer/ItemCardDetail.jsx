import { itemImagePlaceholder } from "../../helpers";
import "../../styles/components/ItemCardDetail.css";

export default function ItemCardDetail({item}) {
    console.log(item);
    return (
        <div id="detailed-item-card">
            <img src={item.image_url || itemImagePlaceholder}/>
            <h2>{item.name}</h2>
        </div>
    )
}