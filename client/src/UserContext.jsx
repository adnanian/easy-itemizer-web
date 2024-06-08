import { useState, useEffect, createContext } from "react";

const UserContext = createContext();

/**
 * TODO
 * 
 * @param {*} param0 
 * @returns 
 */
const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        //fetch_data()
    }, []);

    return <UserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</UserContext.Provider>
};

export { UserContext, UserProvider };