import {RemoteUser} from "../types/remoteUser";
import {LocalUser} from "../types/localUser";

export const mapRemoteToLocalUser = (remoteUser: RemoteUser): LocalUser => {
    return {
        id: remoteUser.id,
        name: remoteUser.login
    }
}

export const filterBySearchTerm = <T>(
    searchTerm: string,
    getName: (user: T) => string = (u: any) => u.name
) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (user: T) => getName(user).toLowerCase().includes(lowerSearchTerm);
};

export const sortBySearchTerm = <T>(
    searchTerm: string,
    getName: (user: T) => string = (u: any) => u.name
) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (a: T, b: T) => {
        const aName = getName(a).toLowerCase();
        const bName = getName(b).toLowerCase();
        const aStarts = aName.startsWith(lowerSearchTerm);
        const bStarts = bName.startsWith(lowerSearchTerm);

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        return aName.localeCompare(bName);
    };
};

export const escapeRegExp = (text: string): string => {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
