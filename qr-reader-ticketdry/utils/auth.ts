const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/user`;

export const login = async (username: string, password: string) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred during login.');
  }

  localStorage.setItem('role', data.role);
  localStorage.setItem('organizerId', data.organizerId);

  return data;
};

export const logout = async() => {
    try {
        const response = await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error('Logout failed');
        }
    
        localStorage.removeItem('organizerId');
    
        window.location.href = '/login'; // or redirect to any other page you prefer
      } catch (error) {
        console.error('Logout error:', error);
      }
};

// Helper function to get the token from HttpOnly cookie
export const getToken = async (): Promise<string | null> => {
    try {
        const response = await fetch('/api/getAuthToken', {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch token');
        }
    
        const data = await response.json();
        
        // Check if the token exists in the response
        return data.token || null;
      } catch (error) {
        console.error('Error fetching auth token:', error);
        return null;
      }
};

