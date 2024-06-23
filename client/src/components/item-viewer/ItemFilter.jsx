import { useScreenSize } from "../../helperHooks";

export default function ItemFilter({filters, onChange}) {
    const {scaleByHeight} = useScreenSize();

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
            />
            <label htmlFor="filterText">Filter Text</label>
            <input
                id="filterText"
                name="filterText"
                type="text"
                value={filters.text}
                onChange={onChange}
            />
        </div>
    );
}