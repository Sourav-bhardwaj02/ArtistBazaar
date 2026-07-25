// API utility with automatic token refresh and error handling
const API_URL = import.meta.env.VITE_API_URL as string;

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem("refresh-token");
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("auth-token", data.authToken);
        localStorage.setItem("refresh-token", data.refreshToken);
        localStorage.setItem("user-data", JSON.stringify(data.user));
        return true;
      } else {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem("user-data");
        localStorage.removeItem("auth-token");
        localStorage.removeItem("refresh-token");
        localStorage.removeItem("sellerId");
        window.location.href = "/login";
        return false;
      }
    } catch {
      return false;
    }
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("auth-token");
    return {
      "Content-Type": "application/json",
      ...(token && { "auth-token": token }),
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      // Handle token expiration
      if (response.status === 401) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the request with new token
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...this.getAuthHeaders(),
              ...options.headers,
            },
          });
          
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            return { data };
          }
        }
        
        return { error: "Authentication failed. Please log in again." };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          error: errorData.message || `Request failed with status ${response.status}` 
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : "Network error occurred" 
      };
    }
  }

  // Public methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: "DELETE" });
  }

  // Auth specific methods
  async login(credentials: { email: string; password: string; role?: string }) {
    return this.post("/api/auth/login", credentials);
  }

  async signup(userData: { email: string; name: string; password: string; role: string }) {
    return this.post("/api/auth/signup", userData);
  }

  async logout() {
    return this.post("/api/auth/logout");
  }
}

export const apiClient = new ApiClient(API_URL);
export default apiClient;
