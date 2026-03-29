const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ftqgkqchiinlqwfdwbbb.supabase.co';
const supabaseKey = 'sb_publishable_wWzQmf-e2sgjfZduVh4MLg_oqVQppcJ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching profiles:', error);
  } else {
    console.log('Sample profiles data:', data);
  }
}

checkSchema();
