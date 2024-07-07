import { useScreenSize } from "../../helperHooks";
import { correctRoute, placeholderImages } from "../../helpers";
import "../../styles/components/ItemCard.css";

/**
 * Renders a button consisting of the name, image, and part number of an item. 
 * Clicking on that button makes a GET request to the server to retrieve more
 * information about the item, and then, displays it to the user.
 * 
 * @param {Object} props
 * @param {Object} props.item the item.
 * @param {Function} props.onSelectItem the callback function to execute when the button is clicked.
 * @returns a button card for an individual item.
 */
export default function ItemCard({ item, onSelectItem }) {
    const { scaleByWidth, scaleByHeight } = useScreenSize();

    const itemButtonSizing = {
        width: scaleByWidth(230, 'px'),
        height: scaleByHeight(230, 'px')
    };

    const imageSizing = {
        width: scaleByWidth(100, 'px'),
        height: scaleByHeight(100, 'px')
    }

    /**
     * Makes a fetch request to the server for more details about an item.
     * Then executes onSelectItem to show more item information.
     */
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
            title="Click on the item to show more details."
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