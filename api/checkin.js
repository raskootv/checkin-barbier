// /api/checkin.js

export default async function handler(req, res) {
  const FUNCTION_URL = `${process.env.SUPABASE_URL}/functions/v1/checkin`;

  try {
    const response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(req.body),
    });

    const message = await response.text();
    return res.status(200).send(message);
  } catch (err) {
    console.error("Erreur proxy:", err);
    return res.status(500).send("❌ Erreur côté proxy.");
  }
}
