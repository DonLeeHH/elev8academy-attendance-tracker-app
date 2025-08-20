import { del } from 'aws-amplify/api';
import { getCurrentUser} from "aws-amplify/auth";

export async function deleteSession(cls:string, classDate:string) {
  try {
      // Get currently signed-in user
      const user = await getCurrentUser();
      console.log(user);
      console.log(cls, classDate);
      const restOperation = del({
        apiName: "elev8",       // your Amplify API name
        path: `/session-management/session/${encodeURIComponent(cls)}~${encodeURIComponent(classDate)}`,   // route in API Gateway
      });
      await restOperation.response;
      console.log("Session deleted successfully");
    } catch (e: any) {
      console.error(
        "Failed to delete session:",
        e
      );
      throw e;
    }
}

