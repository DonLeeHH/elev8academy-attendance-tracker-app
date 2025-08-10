import { signOut } from "aws-amplify/auth";
import { router } from "expo-router";


export default async function handleSignOut(): Promise<void> {  
    try {
        console.log("Signing out...");
        await signOut();
        console.log("Sign out success");
        router.replace("/");
    } catch (error) {
        console.error("Sign out error:", error);
    }
}