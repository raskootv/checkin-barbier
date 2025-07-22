// === /api/checkin.js ===
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { numero, prenom, email } = req.body || {};

  if (!numero) {
    return res.status(400).send("❌ Numéro manquant.");
  }

  // Cherche le client
  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('numero', numero)
    .single();

  const now = new Date();
  const joursDeBlocage = 4;

  if (client) {
    // Vérifie la dernière visite
    const { data: derniereVisite } = await supabase
      .from('visites')
      .select('date_visite')
      .eq('client_id', client.id)
      .order('date_visite', { ascending: false })
      .limit(1)
      .single();

    if (derniereVisite) {
      const derniere = new Date(derniereVisite.date_visite);
      derniere.setDate(derniere.getDate() + joursDeBlocage);
      if (now < derniere) {
        return res.send(`❌ Tu es déjà passé récemment. Reviens à partir du ${derniere.toLocaleDateString()}`);
      }
    }

    // Ajoute une visite
    await supabase.from('visites').insert({
      client_id: client.id,
      date_visite: now
    });

    return res.send(`✅ Bienvenue ${client.prenom} ! Ta visite est enregistrée.`);
  }

  // Si client inconnu → on doit avoir prénom et email
  if (!prenom || !email) {
    return res.send("❌ Numéro inconnu. Tu n'es pas encore inscrit.");
  }

  // Inscription + première visite
  const { data: newClient, error: errClient } = await supabase
    .from('clients')
    .insert({
      numero,
      prenom,
      email
    })
    .select()
    .single();

  if (errClient) {
    console.error("Erreur création client:", errClient);
    return res.status(500).send("❌ Erreur d'inscription.");
  }

  await supabase.from('visites').insert({
    client_id: newClient.id,
    date_visite: now
  });

  return res.send(`🎉 Merci ${prenom} ! Tu fais maintenant partie de la famille ✂️`);
}
