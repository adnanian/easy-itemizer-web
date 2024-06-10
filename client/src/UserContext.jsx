import { useState, useEffect, createContext } from "react";

const UserContext = createContext();

/**
 * Article of reference: https://medium.com/@anna-cole/a-beginners-guide-on-how-to-implement-context-in-a-react-application-for-better-state-management-06e52897715d
 * 
 * TODO
 * 
 * @param {*} param0 
 * @returns 
 */
const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/check_session")
        .then((response) => {
            if (response.ok) {
                response.json().then((user) => setCurrentUser(user));
            }
        });
    }, []);

    return <UserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</UserContext.Provider>
};

export { UserContext, UserProvider };