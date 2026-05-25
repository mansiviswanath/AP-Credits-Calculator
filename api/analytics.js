export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  try {
    return res.status(200).json({
      projectName: "AP Credits Calculator",
      framework: "Vite + React Stable Build",
      updatedAt: Date.now()
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
