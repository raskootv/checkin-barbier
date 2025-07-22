// checkin.js
const SUPABASE_URL = "https://odrgqvseddbbvvywguml.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kcmdxdnNlZGRiYnZ2eXdndW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTI4MzQsImV4cCI6MjA2ODc4ODgzNH0.zbWnDGbsdhY6u_YUs_2cLmN3UxtLp9oPn8l89iLWUyE";
const FUNCTION_URL = "https://odrgqvseddbbvvywguml.supabase.co/functions/v1/checkin";

async function checkIn() {
  const numero = document.getElementById('numero').value.trim();
  const resultDiv = document.getElementById('result');
  const formulaire = document.getElementById('formulaire');
  const loading = document.getElementById('loading');

  if (!numero) {
    resultDiv.innerText = "❌ Merci d’entrer un numéro.";
    return;
  }

  loading.style.display = 'block';
  formulaire.style.display = 'none';
  resultDiv.innerText = "";

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/checkin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ numero })
    });

    const message = await response.text();
    resultDiv.innerText = message;

    if (message.includes("Numéro inconnu")) {
      formulaire.style.display = 'block';
    }
  } catch (error) {
    console.error(error);
    resultDiv.innerText = "❌ Erreur de connexion.";
  }

  loading.style.display = 'none';
}

async function inscrireClient() {
  const numero = document.getElementById('numero').value.trim();
  const prenom = document.getElementById('prenom').value.trim();
  const email = document.getElementById('email').value.trim();
  const resultDiv = document.getElementById('result');
  const loading = document.getElementById('loading');

  if (!numero || !prenom || !email) {
    resultDiv.innerText = "❌ Merci de remplir tous les champs.";
    return;
  }

  loading.style.display = 'block';
  resultDiv.innerText = "";

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/checkin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ numero, prenom, email })
    });

    const message = await response.text();
    resultDiv.innerText = message;
    document.getElementById('formulaire').style.display = 'none';
  } catch (error) {
    console.error(error);
    resultDiv.innerText = "❌ Erreur lors de l'inscription.";
  }

  loading.style.display = 'none';
}
