const axios = require("axios");

export default async function handler(req, res) {
  const apiToken = process.env.NEXT_PUBLIC_LLAMA_API_TOKEN;

  if (req.method === "POST") {
    try {
      const response = await axios.post(
        "https://api.llama-api.com/chat/completions",
        req.body,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      res.status(200).json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json({
        message: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
