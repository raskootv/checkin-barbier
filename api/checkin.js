export default async function handler(req, res) {
  const { numero, prenom, email } = req.body || {};

  if (!numero) {
    return res.status(400).send("❌ Numéro manquant.");
  }

  const scriptUrl = "https://script.google.com/macros/s/AKfycbwyuzrr-TGo32R1MXsvAfM1lCut6m7IVNefMJyYTe6C4mO07CdPEvHNLnDRTU_8IGGL8Q/exec";

  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      body: JSON.stringify({ numero, prenom, email }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();
    console.log("[Apps Script dit] =>", text);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(text);
  } catch (err) {
    console.error("Erreur proxy:", err);
    return res.status(500).send("❌ Erreur de connexion au service distant.");
  }
}
