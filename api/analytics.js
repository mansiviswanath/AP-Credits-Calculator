// api/analytics.js

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  const token = process.env.MY_ANALYTICS_KEY;
  const projectId = process.env.MY_ANALYTICS_ID;

  if (!token || !projectId) {
    return res.status(500).json({ error: "Dashboard keys are missing." });
  }

  // Target Vercel's official projects endpoint to read real live system specs
  const url = `https://vercel.com{projectId}`;

  try {
    const fetchResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!fetchResponse.ok) {
      return res.status(fetchResponse.status).json({ error: "Vercel key rejected." });
    }

    const data = await fetchResponse.json();
    
    // Set a 1-hour cache so your site loads super fast for users
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    // Return real data from your live project
    return res.status(200).json({
      projectName: data.name,
      framework: data.framework || "vite",
      updatedAt: data.updatedAt
    });

  } catch (error) {
    return res.status(500).json({ error: "Failed fetching real data." });
  }
}
