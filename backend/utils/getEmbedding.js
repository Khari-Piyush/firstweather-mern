import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import https from "https";

const getEmbedding = async (imageSource) => {
  const formData = new FormData();

  // 🔹 CASE 1: Cloudinary URL
  if (imageSource.startsWith("http")) {
    const response = await axios.get(imageSource, {
      responseType: "arraybuffer",
    });

    formData.append(
      "image",
      Buffer.from(response.data),
      {
        filename: "image.jpg",
        contentType: "image/jpeg",
      }
    );
  }
  // 🔹 CASE 2: Local file path
  else {
    formData.append("image", fs.createReadStream(imageSource));
  }

  const res = await axios.post(
    "http://localhost:5001/embed",
    formData,
    { headers: formData.getHeaders() }
  );

  return res.data.embedding;
};

export default getEmbedding;
