import ItemCard from "./ItemCard";
import BigText from "../BigText";
import {useScreenSize} from "../../helperHooks";

export default function ItemList({user, items, filters, onSelectItem}) {

    // console.log(filters);

    const {scaleByWidth, scaleByHeight, scaleByRatio} = useScreenSize();

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
     * 
     * @returns 
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
     * TODO
     * 
     * @param {*} itemA 
     * @param {*} itemB 
     * @returns 
     */
    const sortByName = (itemA, itemB) => {
        if (itemA.name < itemB.name) return -1;
        if (itemA.name > itemB.name) return 1;
        return 0;
    }

    /**
     * 
     */
    const itemCards = filteredItems()?.toSorted(sortByName).map((item) => {
        return (
            <li 
                key={item.id} 
                className="three-d-round-border"
                style={liSizing}
            >
                <ItemCard item={item} onSelectItem={onSelectItem}/>
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