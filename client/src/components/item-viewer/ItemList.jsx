import ItemCard from "./ItemCard";
import BigText from "../BigText";
import { useScreenSize } from "../../helperHooks";

/**
 * Renders a spaced grid of cards with simple item information: the name, image,
 * and part number.
 * 
 * @param {Object} props
 * @param {Object} props.user the current user.
 * @param {Array} props.items the items in the system.
 * @param {Object} props.filters the filters to apply on the items.
 * @param {Function} props.onSelectItem the callback function to execute when an ItemCard is clicked on. 
 * @returns a list of items in the system, displayed as a grid.
 */
export default function ItemList({ user, items, filters, onSelectItem }) {

    // console.log(filters);

    const { scaleByWidth, scaleByHeight, scaleByRatio } = useScreenSize();

    const itemListContainerSizing = {
        marginTop: scaleByHeight(10, 'px'),
        marginRight: scaleByWidth(35, 'px')
    }

    const itemListSizing = () => {
        const gridTempalteColumnSize = scaleByWidth(300, 'px');
        return {
            gridTemplateColumns: `${gridTempalteColumnSize} ${gridTempalteColumnSize} ${gridTempalteColumnSize}`,
            height: scaleByHeight(530, 'px')
        };
    }

    const liSizing = {
        margin: `${scaleByWidth(25, 'px')} ${scaleByHeight(25, 'px')}`
    };

    /**
     * Applies the given filters onto the items, so that only such items that
     * satisfy the filter constraints will be rendered.
     * 
     * @returns the filtered list of items.
     */
    const filteredItems = () => {
        if (filters.text === "" && !filters.userItemsOnly) {
            return items;
        } else {
            return items.filter((item) => {
                return (
                    (filters.text === "" ? true : item.name.toLowerCase().includes(filters.text.toLowerCase()))
                    && (!filters.userItemsOnly ? true : item.user_id === user.id)
                );
            });
        }
    };

    /**
     * Sorts the list of items by name.
     * 
     * @param {Object} itemA the item to compare. 
     * @param {Object} itemB the item to be compared.
     * @returns the appropriate value resulting from the comparison.
     */
    const sortByName = (itemA, itemB) => {
        if (itemA.name < itemB.name) return -1;
        if (itemA.name > itemB.name) return 1;
        return 0;
    }

    const itemCards = filteredItems()?.toSorted(sortByName).map((item) => {
        return (
            <li
                key={item.id}
                className="three-d-round-border"
                style={liSizing}
            >
                <ItemCard item={item} onSelectItem={onSelectItem} />
            </li>
        )
    });

    return (
        <div
            id="item-list-container"
            className="round-border"
            style={itemListContainerSizing}
        >
            <ul
                id="item-list"
                className="three-d-round-border"
                style={itemListSizing()}
            >
                {itemCards ? itemCards : (
                    <BigText id="no-items">
                        <p>No items found.</p>
                    </BigText>
                )}
            </ul>
        </div>
    )
}