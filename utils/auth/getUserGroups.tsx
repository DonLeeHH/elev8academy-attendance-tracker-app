import { fetchAuthSession } from "aws-amplify/auth";

export default async function getUserGroups() {
  try {
    const session = await fetchAuthSession();
    if (session.tokens?.accessToken) {
      const payload = session.tokens.accessToken.payload;
      const groups = payload['cognito:groups'] || [];
      console.log('User groups:', groups);
      return groups;
    }
    return [];
  } catch (error) {
    console.error('Error fetching user groups:', error);
    return [];
  }
}