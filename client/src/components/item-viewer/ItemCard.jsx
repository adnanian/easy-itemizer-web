import { useScreenSize } from "../../helperHooks";
import { correctRoute, placeholderImages } from "../../helpers";
import "../../styles/components/ItemCard.css";

export default function ItemCard({item, onSelectItem}) {
    const {scaleByWidth, scaleByHeight, scaleByRatio} = useScreenSize();

    const itemButtonSizing = {
        width: scaleByWidth(230, 'px'),
        height: scaleByHeight(230, 'px')
    };

    const imageSizing = {
        width: scaleByWidth(100, 'px'),
        height: scaleByHeight(100, 'px')
    }

    function fetchItemDetails() {
        fetch(correctRoute(`/items/${item.id}`))
        .then((response) => response.json())
        .then((data) => onSelectItem(data));
    }

    return (
        <button 
            className="item-card" 
            onClick={fetchItemDetails}
            style={itemButtonSizing}
        >
            <img 
                src={item.image_url || placeholderImages.item} 
                className="round-border"
                style={imageSizing}
            />
            <p><b>{item.name}</b></p>
            <p>{item.part_number || "N/A"}</p>
        </button>
    )
}