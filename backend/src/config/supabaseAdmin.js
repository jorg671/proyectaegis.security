const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error("Faltan las credenciales privadas de Supabase");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey);

module.exports = supabaseAdmin;