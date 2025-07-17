import {LocalUser} from "../types/localUser";
import localData from "../data/users.json";
import {filterBySearchTerm, sortBySearchTerm} from "../utils/searchUtils";

export const fetchLocalUsers = async (searchTerm: string, limit: number = 8): Promise<LocalUser[]> => {
    return new Promise(async (resolve, reject) => {
        setTimeout(() => {

            // Simulates error
            if (searchTerm.toLowerCase() === "err")
                return reject(new Error(`A fake error occurred.`));

            const results = localData
                .filter(filterBySearchTerm<LocalUser>(searchTerm, u => u.name))
                .sort(sortBySearchTerm<LocalUser>(searchTerm, u => u.name))
                .slice(0, limit)
            resolve(results);
        }, 500);    // Simulates async request
    });
};
