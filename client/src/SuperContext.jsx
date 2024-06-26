import { useState, useEffect, createContext } from "react";
import { correctRoute } from "./helpers";

const UserContext = createContext();
const ItemContext = createContext();
const SelectedItemContext = createContext();

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
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetch(correctRoute("/check_session"))
        .then((response) => {
            if (response.ok) {
                response.json().then((user) => setCurrentUser(user));
            }
        });
    }, []);

    useEffect(() => {
        fetch(correctRoute("/items"))
        .then((response) => {
            if (response.ok) {
                return response.json().then((items) => setItems(items));
            }
        })
    }, [currentUser]);

    const login = (user) => setCurrentUser(user);

    const logout = () => {
        // console.log("Logging out.");
        fetch(correctRoute("/logout"), {
            method: "DELETE"
        })
        .then((response) => {
            if (response.ok) {
                // console.log("Logged out.");
                setCurrentUser(null);
            } else {
                throw new Error("Logout failed.");
            }
        });
    };

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, login, logout }}>
            <ItemContext.Provider value={{items, setItems}}>
                <SelectedItemContext.Provider value={{selectedItem, setSelectedItem}}>
                    {children}
                </SelectedItemContext.Provider>
            </ItemContext.Provider>
        </UserContext.Provider>
    )
};

export { UserContext, ItemContext, SelectedItemContext, SuperProvider };