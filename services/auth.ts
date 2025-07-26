import { ID } from 'appwrite';
import { appwriteAccount } from './appWrite';

const login = async (email: string, password: string) => {
    try {
        const response = await appwriteAccount.createEmailPasswordSession(email, password);
        return response;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}

const register = async (email: string, password: string, name: string) => {
    try {
        const response = await appwriteAccount.create(ID.unique(), email, password, name);
        return response;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
}

const logout = async () => {
    try {
        await appwriteAccount.deleteSession('current'); // 'current' deletes the active session
        console.log("User logged out successfully.");
        // You might want to navigate the user to a login page or clear user state here
        return true; // Indicate success
    } catch (error) {
        console.error("Logout error:", error);
        throw error; // Re-throw the error for further handling if needed
    }
}

export { login, logout, register };

