import { createContext, useState } from "react";
import useLocalStorageState from 'use-local-storage-state'

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useLocalStorageState('userInfo', { defaultValue: null });
    const [token, setToken] = useState('');
    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, token, setToken }}>
            {children}
        </UserContext.Provider>

    )

}