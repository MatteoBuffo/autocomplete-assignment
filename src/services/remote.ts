import {RemoteUser} from "../types/remoteUser";
import {LocalUser} from "../types/localUser";
import {filterBySearchTerm, mapRemoteToLocalUser, sortBySearchTerm} from "../utils/searchUtils";

/***
 1. filter  - by searchTerm
 2. sort    - smart sorting
 3. slice   - take the first [limit] elements
 4. map     - RemoteUser to LocalUser
 ***/
export const fetchRemoteUsers = async (searchTerm: string, limit: number = 8): Promise<LocalUser[]> => {
    const encodedSearchTerm = encodeURIComponent(searchTerm)

    // Simulates error
    if (searchTerm.toLowerCase() === "err")
        throw new Error(`A fake error occurred.`);

    const res = await fetch(`https://api.github.com/search/users?q=${encodedSearchTerm}`);
    if (!res.ok) {
        console.error(`An error occurred. ${res.status}`)
        throw new Error(`An error occurred.`);
    }

    const json = await res.json();
    return (json.items || [])
        .filter(filterBySearchTerm<RemoteUser>(searchTerm, u => u.login))
        .sort(sortBySearchTerm<RemoteUser>(searchTerm, u => u.login))
        .slice(0, limit)
        .map(mapRemoteToLocalUser);
};

/***
 1. map     - RemoteUser to LocalUser
 2. filter  - by searchTerm
 3. sort    - smart sorting
 4. slice   - take the first [limit] elements
 ***/
// export const fetchRemoteUsers = async (searchTerm: string): Promise<LocalUser[]> => {
//     const res = await fetch(`https://api.github.com/search/users?q=${searchTerm}`);
//     if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//     }
//     const json = await res.json();
//     return (json.items || [])
//         .map(mapRemoteToLocalUser)
//         .filter(filterBySearchTerm<LocalUser>(searchTerm, u => u.name))
//         .sort(sortBySearchTerm<LocalUser>(searchTerm, u => u.name))
//         .slice(0, 8);
// };

// export const fetchRemoteUsers = async (searchTerm: string): Promise<LocalUser[]> => {
//     return new Promise(async (resolve, reject) => {
//         setTimeout(async () => {
//             try {
//                 const res = await fetch(`https://api.github.com/search/users?q=${searchTerm}`);
//                 if (!res.ok) {
//                     return reject(new Error(`HTTP error! Status: ${res.status}`));
//                 }
//                 const json = await res.json();
//
//                 const results = (json.items || [])
//                     .filter(filterBySearchTerm<RemoteUser>(searchTerm, u => u.login))
//                     .sort(sortBySearchTerm<RemoteUser>(searchTerm, u => u.login))
//                     .slice(0, 8)
//                     .map(mapRemoteToLocalUser);
//
//                 resolve(results);
//             } catch (error) {
//                 reject(error);
//             }
//         }, 1000);   // Simulate network delay
//     });
// };
