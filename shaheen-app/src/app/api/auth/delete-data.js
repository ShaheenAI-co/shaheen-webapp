// /pages/api/auth/delete-data.js
export default function handler(req, res) {
    if (req.method === 'POST') {
      // Meta sends data deletion request here (with user_id)
      console.log("Data deletion request:", req.body);
  
      // You might schedule deletion of user data in your DB here
  
      res.status(200).json({
        url: "https://shaheen-webapp.vercel.app/data-deletion-status",
        confirmation_code: "user_data_deleted"
      });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  }
  