// Vercel serverless function to proxy API requests to backend
export default async function handler(req, res) {
  // Use environment variable for backend URL, fallback to render URL
  const backendUrl = process.env.VITE_API_URL || 'https://life-debugger-final.onrender.com';

  // Get the path after /api/
  const path = req.url.replace('/api/', '');

  try {
    // Forward the request to backend
    const response = await fetch(`${backendUrl}/api/${path}`, {
      method: req.method,
      headers: {
        ...req.headers,
        'host': undefined,
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    // Get response data
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ message: 'Backend server error', error: error.message });
  }
}

