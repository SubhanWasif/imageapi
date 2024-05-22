const express = require("express");
const app = express();
const PORT = 8080;
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const token = process.env.TOEKN;

app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Hello world");
});

app.post("/generate-image", async (req, res) => {
  try {
    const data = { inputs: req.body.prompt }; // Expect 'inputs' in the body of the POST request
    const apiResponse = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use your own token
        },
        body: JSON.stringify(data),
      }
    );

    if (!apiResponse.ok) {
      throw new Error("Failed to generate image");
    }

    const imageBlob = await apiResponse.blob();
    const buffer = await imageBlob.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);

    // Set proper content-type for image
    res.type("image/jpeg");
    res.send(imageBuffer);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error generating image");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
