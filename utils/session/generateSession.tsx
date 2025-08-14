import { post } from "aws-amplify/api";
import { getCurrentUser} from "aws-amplify/auth";
import { Amplify } from 'aws-amplify';
import amplifyconfig from '../../amplifyconfiguration.json';

Amplify.configure(amplifyconfig);

interface GenerateSessionPayload {
  level: string;   // e.g., "S3"
  subject: string; // e.g., "Physics"
  tutorEmail?: string; // optional, will be filled from Cognito
}

interface GenerateSessionResponse {
  sessionId: string;
  expiresAt?: string; // optional if your Lambda also returns expiry
}

export async function generateSession(payload: GenerateSessionPayload){
  try {
    // Get currently signed-in user
    const user = await getCurrentUser();
    console.log(user);


    // Include tutorEmail in the payload
    const fullPayload = {
      ...payload,
      tutorEmail: "donleehh420@gmail.com"
    };

    const restOperation = post({
      apiName: "elev8",       // your Amplify API name
      path: "/generate-session",   // route in API Gateway
      options: {
        body: fullPayload,
      },
    });
    const { body } = await restOperation.response;
    const response = await body.json();
    console.log(response);
    return response
  } catch (e: any) {
    console.error(
      "Failed to generate QR session:",
      e
    );
    throw e;
  }
}
