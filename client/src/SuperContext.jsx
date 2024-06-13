import { useState, useEffect, createContext } from "react";

const UserContext = createContext();
const ItemContext = createContext();

/**
 * Articles of reference: 
 * https://medium.com/@anna-cole/a-beginners-guide-on-how-to-implement-context-in-a-react-application-for-better-state-management-06e52897715d
 * https://www.dhiwise.com/post/exploring-react-contexttypes-how-to-use-and-implement
 * 
 * TODO
 * 
 * @param {*} param0 
 * @returns 
 */
const SuperProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [items, setItems] = useState(null);

    useEffect(() => {
        fetch("/check_session")
        .then((response) => {
            if (response.ok) {
                response.json().then((user) => setCurrentUser(user));
            }
        });
    }, []);

    useEffect(() => {
        fetch("/items")
        .then((response) => {
            if (response.ok) {
                return response.json().then((items) => setItems(items));
            }
        })
    }, [currentUser])

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
            <ItemContext.Provider value={{items, setItems}}>
                {children}
            </ItemContext.Provider>
        </UserContext.Provider>
    )
};

export { UserContext, ItemContext, SuperProvider };