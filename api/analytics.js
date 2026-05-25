// api/analytics.js
export default async function handler(request, response) {
  const token = process.env.MY_ANALYTICS_KEY;
  const projectId = process.env.MY_ANALYTICS_ID;

  // Verify variables are loaded
  if (!token || !projectId) {
    console.error("CRITICAL: Missing VERCEL_AUTH_TOKEN or VERCEL_PROJECT_ID in environment variables.");
    return response.status(500).json({ error: 'Server configuration missing environment keys.' });
  }

  // A confirmed public endpoint to verify the API connection is active
  const url = `https://vercel.com{projectId}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Vercel API responded with status ${res.status}:`, errorText);
      return response.status(res.status).json({ error: `Vercel API error: ${res.status}` });
    }

    const data = await res.json();
    
    // Set a clean cache header
    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
    // Return the project data safely
    return response.status(200).json({ 
      status: "Connected!", 
      projectName: data.name,
      id: data.id 
    });
  } catch (error) {
    console.error("Unhandled exception in API route:", error);
    return response.status(500).json({ error: 'Internal Server Error calculation crash.' });
  }
}
