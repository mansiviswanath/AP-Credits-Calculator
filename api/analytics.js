// api/analytics.js

// Force Vercel to explicitly treat this as a modern Node.js 18+ serverless function
export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  try {
    // Return a clean 200 OK status
    return res.status(200).json({
      projectName: "Pipeline Connected!",
      framework: "Vite Modern Setup Running",
      updatedAt: Date.now()
    });
  } catch (error) {
    return res.status(500).json({ error: "Server crashed internally." });
  }
}
