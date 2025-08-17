import { fetchAuthSession } from "aws-amplify/auth";

export default async function getUserGroups(): Promise<string[]> {
  try {
    const { tokens } = await fetchAuthSession();
    const groups =
      (tokens?.idToken?.payload?.["cognito:groups"] as string[] | undefined) ?? [];
    // console.log("User groups:", groups);
    return groups;
  } catch (err) {
    console.error("Error fetching user groups:", err);
    return [];
  }
}
