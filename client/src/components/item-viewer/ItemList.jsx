import ItemCard from "./ItemCard";
import BigText from "../BigText";

export default function ItemList({user, items, filters, onSelectItem}) {

    console.log(filters);

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

    const sortByName = (itemA, itemB) => {
        if (itemA.name < itemB.name) return -1;
        if (itemA.name > itemB.name) return 1;
        return 0;
    }

    const itemCards = filteredItems()?.sort(sortByName).map((item) => {
        return (
            <li key={item.id} className="three-d-round-border">
                <ItemCard item={item} onSelectItem={onSelectItem}/>
            </li>
        )
    });

    return (
        <div id="item-list-container" className="round-border">
            <ul id="item-list" className="three-d-round-border">
                {itemCards ? itemCards : (
                    <BigText id="no-items">
                        <p>No items found.</p>
                    </BigText>
                )}
            </ul>
        </div>
    )
}