export default function ItemFilter({filters, onChange}) {
    return (
        <div id="item-search">
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