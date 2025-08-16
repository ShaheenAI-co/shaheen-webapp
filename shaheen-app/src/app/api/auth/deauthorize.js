// /pages/api/auth/deauthorize.js
export default function handler(req, res) {
    if (req.method === 'POST') {
      // Meta sends deauth info here (e.g. user_id)
      console.log("Deauthorize request:", req.body);
  
      res.status(200).json({
        success: true,
        message: "User deauthorized successfully."
      });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  }
  