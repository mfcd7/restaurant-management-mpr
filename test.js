import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('orders').insert({
    id: '#1234',
    tableid: 'Takeaway #1',
    status: 'pending',
    time: '12:00',
    items: [],
    total: 0
  });
  console.log("Error:", error);
}

check();
