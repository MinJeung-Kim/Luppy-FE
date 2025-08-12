import {
    createContext,
    useContext,
    useState,
} from "react";

type State = {
    selectedUsers: number[];
    setSelectedUsers: React.Dispatch<React.SetStateAction<number[]>>;
};

const ConferenceContext = createContext<State>({} as State);

export function ConferenceProvider({ children }: { children: React.ReactNode }) {
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    return (
        <ConferenceContext.Provider
            value={{
                selectedUsers,
                setSelectedUsers
            }}
        >
            {children}
        </ConferenceContext.Provider>
    );
}

export const useConference = () => useContext(ConferenceContext);
