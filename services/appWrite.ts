import { Account, Client, Functions } from "appwrite";

const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "";


const client : Client = new Client()
    .setEndpoint('https://syd.cloud.appwrite.io/v1') // Your Appwrite endpoint
    .setProject(PROJECT_ID);

const appwriteFunction = new Functions(client);
const appwriteAccount = new Account(client);

// const isLoggedIn = async () => {
//   try {
//     await appwriteAccount.get();
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

export { appwriteAccount, appwriteFunction };

