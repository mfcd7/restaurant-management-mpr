import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ofcxfcnbitfapfzznpws.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mY3hmY25iaXRmYXBmenpucHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NjMyMDIsImV4cCI6MjA4OTIzOTIwMn0.AG12kOIrSKN9V1U1nKHvSvta2g3wbNw1Swqzcs7fmg0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clearData() {
  console.log('Clearing old corrupted mock orders...');
  
  // Wipe all orders
  const { error: orderErr } = await supabase.from('orders').delete().neq('id', 'INVALID_ID_TO_DELETE_ALL');
  if (orderErr) console.error('Error deleting orders:', orderErr.message);

  // Reset all tables
  const { error: tableErr } = await supabase.from('tables').update({ 
    status: 'free', 
    currentorder: null 
  }).neq('id', 'INVALID_ID_TO_UPDATE_ALL');
  
  if (tableErr) console.error('Error resetting tables:', tableErr.message);

  console.log('Database successfully cleared! All tables are free and no active orders exist.');
}

clearData();
