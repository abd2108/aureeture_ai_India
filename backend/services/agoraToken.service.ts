import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

const AGORA_APP_ID = process.env.AGORA_APP_ID;
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

if (!AGORA_APP_ID || !AGORA_APP_CERTIFICATE) {
  console.warn('⚠️ Agora credentials missing. Video sessions will not work without AGORA_APP_ID and AGORA_APP_CERTIFICATE in .env');
}

export interface AgoraTokenParams {
  channelName: string;
  uid: number | string;
  role: 'mentor' | 'mentee';
  expireInSeconds?: number;
}

export function generateAgoraToken({
  channelName,
  uid,
  role,
  expireInSeconds = 3600, // 1 hour default
}: AgoraTokenParams): string {
  if (!AGORA_APP_ID || !AGORA_APP_CERTIFICATE) {
    console.warn('⚠️ Agora credentials missing. Using mock token for development.');
    // Return a mock token structure for development/testing
    // In production, this should throw an error
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Agora credentials are not configured. Please set AGORA_APP_ID and AGORA_APP_CERTIFICATE in environment variables.');
    }
    // For development, return a placeholder token
    return 'mock-token-for-development';
  }

  // Convert uid to number if it's a string
  const numericUid = typeof uid === 'string' ? parseInt(uid.replace(/\D/g, ''), 10) || 0 : uid;
  
  // Determine Agora role: mentor = publisher (can publish audio/video), mentee = subscriber (can only subscribe)
  const agoraRole = role === 'mentor' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpireTs = currentTimestamp + expireInSeconds;

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      AGORA_APP_ID!,
      AGORA_APP_CERTIFICATE!,
      channelName,
      numericUid,
      agoraRole,
      privilegeExpireTs
    );

    return token;
  } catch (error: any) {
    console.error('Error generating Agora token:', error);
    throw new Error(`Failed to generate Agora token: ${error.message}`);
  }
}



