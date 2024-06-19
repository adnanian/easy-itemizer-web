import { correctRoute, placeholderImages } from "../../helpers";
import "../../styles/components/ItemCard.css";

export default function ItemCard({item, onSelectItem}) {

    function fetchItemDetails() {
        fetch(correctRoute(`/items/${item.id}`))
        .then((response) => response.json())
        .then((data) => onSelectItem(data));
    }

    return (
        <button className="item-card" onClick={fetchItemDetails}>
            <img src={item.image_url || placeholderImages.item} className="round-border"/>
            <p><b>{item.name}</b></p>
            <p>{item.part_number || "N/A"}</p>
        </button>
    )
}