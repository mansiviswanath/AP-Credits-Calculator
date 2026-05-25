// api/analytics.js
module.exports = async (req, res) => {
  const token = process.env.MY_ANALYTICS_KEY;
  const projectId = process.env.MY_ANALYTICS_ID;

  // 1. Immediately catch missing credentials before making calls
  if (!token || !projectId) {
    return res.status(500).json({ 
      error: "Environment keys missing inside the Vercel Dashboard settings." 
    });
  }

  // 2. Query Vercel's stable Projects verification endpoint
  const url = `https://vercel.com{projectId}`;

  try {
    const fetchResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 3. Catch credential validation errors
    if (!fetchResponse.ok) {
      const errorText = await fetchResponse.text();
      return res.status(fetchResponse.status).json({ 
        error: `Vercel rejected credentials with code: ${fetchResponse.status}`,
        details: errorText
      });
    }

    const data = await fetchResponse.json();
    
    // 4. Set a safe caching header to limit system calls
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
    // 5. Send clean variables back to your React application
    return res.status(200).json({
      projectName: data.name || "Connected Project",
      framework: data.framework || "React Framework Detected",
      updatedAt: data.updatedAt || Date.now()
    });

  } catch (error) {
    // 6. Final fallback if server routing breaks internally
    return res.status(500).json({ 
      error: "Exception error within the backend code runtime loop.",
      message: error.message 
    });
  }
};
