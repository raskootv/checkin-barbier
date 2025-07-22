// /api/checkin.js

export default async function handler(req, res) {
  const { numero, prenom, email } = req.body || {};

  if (!numero) {
    return res.status(400).send("❌ Numéro manquant.");
  }

  const FUNCTION_URL = "https://odrgqvseddbbvvywguml.supabase.co/functions/v1/checkin";

  try {
    const response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ numero, prenom, email }),
    });

    const message = await response.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(message);
  } catch (err) {
    console.error("Erreur proxy vers Supabase:", err);
    res.status(500).send("❌ Erreur de connexion au service Supabase.");
  }
}
