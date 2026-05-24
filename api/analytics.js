// api/analytics.js
export default async function handler(request, response) {
  const token = process.env.VERCEL_AUTH_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;

  const url = `https://vercel.com{projectId}&filter=pageviews`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return response.status(res.status).json({ error: 'Failed to fetch analytics' });
    }

    const data = await res.json();
    
    // Set a cache header so Vercel keeps it for 1 hour, protecting your API limits
    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
