// === Fichier : api/checkin.js ===

export default async function handler(req, res) {
  const { numero, prenom, email } = req.query;

  if (!numero) {
    return res.status(400).send("❌ Numéro manquant.");
  }

  const scriptUrl = "https://script.google.com/macros/s/AKfycbwyuzrr-TGo32R1MXsvAfM1lCut6m7IVNefMJyYTe6C4mO07CdPEvHNLnDRTU_8IGGL8Q/exec";

  const params = new URLSearchParams({ numero });
  if (prenom) params.append("prenom", prenom);
  if (email) params.append("email", email);

  try {
    const response = await fetch(`${scriptUrl}?${params.toString()}`);
    const text = await response.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(text);
  } catch (err) {
    console.error("Erreur proxy:", err);
    return res.status(500).send("❌ Erreur de connexion.");
  }
}
