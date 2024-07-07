import { useScreenSize } from "../../helperHooks";

/**
 * Renders an inline set of filters that the user can apply
 * for searching items.
 * 
 * @version 1.0 7 July 2024 - Filter to show only your items, or to search for items that contain a substring.
 * 
 * @param {Object} props
 * @param {Object} props.filters the filter set state value.
 * @param {Function} props.onChange the callback function to execute when a filter is changed. 
 * @returns an item search filtering tool.
 */
export default function ItemFilter({ filters, onChange }) {
    const { scaleByHeight } = useScreenSize();

    const itemSearchSizing = {
        margin: `${scaleByHeight(10, 'px')} auto 0`
    };

    return (
        <div id="item-search" style={itemSearchSizing}>
            <label htmlFor="showUserItemsOnly">Show My Items Only</label>
            <input
                id="showUserItemsOnly"
                name="showUserItemsOnly"
                type="checkbox"
                checked={filters.userItemsOnly}
                onChange={onChange}
                title="When this is checked, only the items that you added will be displayed."
            />
            <label htmlFor="filterText">Filter Text</label>
            <input
                id="filterText"
                name="filterText"
                type="text"
                value={filters.text}
                onChange={onChange}
                placeholder="Specific word in the name."
            />
        </div>
    );
}