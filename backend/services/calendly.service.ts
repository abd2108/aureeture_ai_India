// Calendly API integration service
// Documentation: https://developer.calendly.com/api-docs

interface CalendlyEvent {
  uri: string;
  name: string;
  start_time: string;
  end_time: string;
  event_type: string;
  location: {
    type: string;
    location: string; // Meeting link
  };
}

interface CreateEventParams {
  mentorCalendlyUri: string; // Mentor's Calendly user URI
  studentEmail: string;
  studentName: string;
  startTime: Date;
  endTime: Date;
  title: string;
  description?: string;
}

export async function createCalendlyEvent(
  params: CreateEventParams
): Promise<{ eventUri: string; inviteeUri: string; meetingLink: string } | null> {
  try {
    const CALENDLY_API_KEY = process.env.CALENDLY_API_KEY;
    if (!CALENDLY_API_KEY) {
      console.warn('⚠️ CALENDLY_API_KEY not configured. Skipping Calendly integration.');
      return null;
    }

    // Extract event type URI from mentor's Calendly URI
    // In production, you'd fetch the mentor's available event types first
    const eventTypeUri = `${params.mentorCalendlyUri}/event_types`; // Simplified

    // Create scheduling invite
    const response = await fetch('https://api.calendly.com/scheduled_events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CALENDLY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: eventTypeUri,
        invitee: {
          email: params.studentEmail,
          name: params.studentName,
        },
        start_time: params.startTime.toISOString(),
        end_time: params.endTime.toISOString(),
        name: params.title,
        notes: params.description || '',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Calendly API error: ${error.message}`);
    }

    const data = await response.json();
    
    // Extract meeting link from location
    const meetingLink = data.resource?.location?.location || '';
    
    return {
      eventUri: data.resource?.uri || '',
      inviteeUri: data.resource?.invitee?.uri || '',
      meetingLink,
    };
  } catch (error) {
    console.error('Error creating Calendly event:', error);
    // Fallback: Generate a generic meeting link
    return {
      eventUri: '',
      inviteeUri: '',
      meetingLink: generateFallbackMeetingLink(params.startTime, params.title),
    };
  }
}

function generateFallbackMeetingLink(startTime: Date, title: string): string {
  // Fallback to Jitsi Meet if Calendly fails
  const roomName = `aureeture-${Date.now()}-${title.toLowerCase().replace(/\s+/g, '-')}`;
  return `https://meet.jit.si/${roomName}`;
}

export async function syncCalendlyToDatabase(
  eventUri: string,
  sessionId: string
): Promise<boolean> {
  try {
    // Update the session in database with Calendly event URI
    // This would be called after payment confirmation
    const MentorSession = (await import('../models/mentorSession.model')).default;
    await MentorSession.findByIdAndUpdate(sessionId, {
      calendlyEventUri: eventUri,
    });
    return true;
  } catch (error) {
    console.error('Error syncing Calendly to database:', error);
    return false;
  }
}







