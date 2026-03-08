// Vercel serverless function to proxy API requests to backend
export default async function handler(req, res) {
  const backendUrl = process.env.VITE_API_URL || 'http://localhost:5000';
  const path = req.url.replace('/api/', '');
  
  try {
    const response = await fetch(`${backendUrl}/api/${path}`, {
      method: req.method,
      headers: {
        ...req.headers,
        'host': undefined,
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Backend server error' });
  }
}

