/**
 * Centralized API client for backend communication
 * All API calls should go through this utility
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available (from Clerk)
    const token = typeof window !== 'undefined' 
      ? await this.getAuthToken() 
      : null;
    
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include',
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            message: data.message || `HTTP ${response.status}: ${response.statusText}`,
            code: String(response.status),
          },
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Network error occurred',
          code: 'NETWORK_ERROR',
        },
      };
    }
  }

  private async getAuthToken(): Promise<string | null> {
    // In a real app, you'd get this from Clerk's session
    // For now, return null - Clerk middleware handles auth on backend
    return null;
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return this.request<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    });
  }

  // POST request
  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // PUT request
  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Convenience functions for common endpoints
export const api = {
  // Profile
  profile: {
    get: () => apiClient.get('/api/profile'),
    create: (data: any) => apiClient.post('/api/profile', data),
    update: (data: any) => apiClient.put('/api/profile', data),
  },

  // Auth
  auth: {
    verify: (token: string) => apiClient.post('/api/auth/verify', { token }),
  },

  // Mentor Sessions
  mentorSessions: {
    getAll: (mentorId: string, scope?: 'all' | 'upcoming' | 'past') =>
      apiClient.get('/api/mentor-sessions', { mentorId, scope: scope || 'all' }),
    getById: (id: string, mentorId: string) =>
      apiClient.get(`/api/mentor-sessions/${id}`, { mentorId }),
    create: (data: any) => apiClient.post('/api/mentor-sessions', data),
    update: (id: string, mentorId: string, data: any) =>
      apiClient.patch(`/api/mentor-sessions/${id}?mentorId=${mentorId}`, data),
    delete: (id: string, mentorId: string) =>
      apiClient.delete(`/api/mentor-sessions/${id}?mentorId=${mentorId}`),
    verifyJoin: (id: string, mentorId: string) =>
      apiClient.get(`/api/mentor-sessions/${id}/verify-join`, { mentorId }),
    complete: (id: string, mentorId: string) =>
      apiClient.post(`/api/mentor-sessions/${id}/complete?mentorId=${mentorId}`),
    createDemo: (mentorId: string) =>
      apiClient.post(`/api/mentor-sessions/create-demo?mentorId=${mentorId}`),
  },

  // Mentor Mentees
  mentorMentees: {
    getAll: (mentorId: string) =>
      apiClient.get('/api/mentor-mentees', { mentorId }),
    getById: (id: string, mentorId: string) =>
      apiClient.get(`/api/mentor-mentees/${id}`, { mentorId }),
  },

  // Mentor Availability
  mentorAvailability: {
    getSlots: (mentorId: string, startDate?: string, endDate?: string) =>
      apiClient.get('/api/mentor-availability/slots', {
        mentorId,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      }),
  },

  // Session Join
  session: {
    join: (sessionId: string, userId: string) =>
      apiClient.post('/api/session/join', { sessionId, userId }),
  },

  // Contact Forms
  contact: {
    submitLead: (data: { name: string; email: string; mobile: string; utm?: string; page?: string }) =>
      apiClient.post('/api/leads', data),
    submitEnterpriseDemo: (data: { name: string; email: string; company: string; page?: string }) =>
      apiClient.post('/api/enterprise-demo', data),
    submitContact: (data: { name: string; email: string; phone?: string; subject: string; message: string }) =>
      apiClient.post('/api/contact', data),
  },
};

export default apiClient;


