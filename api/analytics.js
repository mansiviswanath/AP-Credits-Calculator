// api/analytics.js
module.exports = async (req, res) => {
  try {
    // We set a clean response status code
    res.statusCode = 200;
    
    // We send back static data immediately to check the pipeline
    return res.json({
      projectName: "Pipeline Connected!",
      framework: "Vite + React Test Running",
      updatedAt: Date.now()
    });

  } catch (error) {
    // Standard server failure response
    return res.statusCode = 500;
  }
};
