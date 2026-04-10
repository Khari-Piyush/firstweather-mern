export const sendEnquiry = async (req, res) => {
  const { name, phone, message, productId } = req.body;

  const whatsappMessage = `
New Product Enquiry 👇

Name: ${name}
Phone: ${phone}
Product ID: ${productId}
Message: ${message}
`;

  const whatsappUrl = `https://wa.me/917428088039?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  res.json({ redirectUrl: whatsappUrl });
};
