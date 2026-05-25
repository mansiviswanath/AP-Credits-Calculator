// api/analytics.js
export default {
  async fetch(request) {
    const token = process.env.MY_ANALYTICS_KEY;
    const projectId = process.env.MY_ANALYTICS_ID;

    // 1. Safety check to make sure keys are injected
    if (!token || !projectId) {
      return Response.json(
        { error: "Keys missing inside Vercel Dashboard variables." },
        { status: 500 }
      );
    }

    // 2. Target Vercel's official Projects API endpoint
    const url = `https://vercel.com{projectId}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 3. Handle token/credential rejection errors
      if (!res.ok) {
        const errResponse = await res.text();
        return Response.json(
          { error: `Vercel rejected credentials with code: ${res.status}`, details: errResponse },
          { status: res.status }
        );
      }

      const data = await res.json();
      
      // 4. Return the data payload cleanly to your React UI
      return Response.json({
        projectName: data.name || "Unknown Project",
        framework: data.framework || "React Framework",
        updatedAt: data.updatedAt || Date.now()
      }, {
        status: 200,
        headers: {
          'Cache-Control': 's-maxage=3600, stale-while-revalidate'
        }
      });

    } catch (error) {
      return Response.json(
        { error: "Exception error within the backend loop.", message: error.message },
        { status: 500 }
      );
    }
  }
};
