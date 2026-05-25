// api/analytics.js
export default async function handler(request, response) {
  const token = process.env.MY_ANALYTICS_KEY;
  const projectId = process.env.MY_ANALYTICS_ID;

  // 1. Safety check to make sure keys aren't rendering undefined
  if (!token || !projectId) {
    return response.status(500).json({ 
      error: "Keys missing inside Vercel Dashboard variables." 
    });
  }

  // 2. Change the URL to an official public endpoint
  const url = `https://vercel.com{projectId}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Formatted Authorization header
      },
    });

    // If Vercel explicitly rejects the token, forward the exact error
    if (!res.ok) {
      const errResponse = await res.text();
      return response.status(res.status).json({ 
        error: `Vercel rejected credentials with code: ${res.status}`,
        details: errResponse
      });
    }

    const data = await res.json();
    
    // Set caching rules to protect your monthly API query caps
    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
    // Send a clean data object back to your React application
    return response.status(200).json({
      projectName: data.name || "Unknown Project",
      framework: data.framework || "React",
      updatedAt: data.updatedAt || Date.now()
    });

  } catch (error) {
    return response.status(500).json({ 
      error: "Exception error within the backend code execution loop.",
      message: error.message
    });
  }
}
