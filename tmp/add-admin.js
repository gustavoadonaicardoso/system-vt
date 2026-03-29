const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ftqgkqchiinlqwfdwbbb.supabase.co';
const supabaseKey = 'sb_publishable_wWzQmf-e2sgjfZduVh4MLg_oqVQppcJ';

const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_PERMISSIONS = {
  dashboard: { view: true, kpis: true, funnel: true, activities: true },
  pipeline: { view: true, move: true, edit: true, manageStages: true },
  leads: { view: true, edit: true, delete: true, tags: true, export: true },
  messages: { view: true, send: true, start: true },
  automations: { view: true, manage: true },
  integrations: { view: true, manage: true },
  team: { view: true, manage: true },
};

async function addAdmin() {
  const { data, error } = await supabase
    .from('profiles')
    .upsert([
      {
        name: 'Administrador Vórtice',
        email: 'gustavoadonai@admin.com',
        password: 'd*b234Wt2gFFRk',
        role: 'ADMIN',
        status: 'ACTIVE',
        permissions: DEFAULT_PERMISSIONS
      }
    ], { onConflict: 'email' });

  if (error) {
    console.error('Error adding admin:', error);
  } else {
    console.log('Admin user added/updated successfully:', data);
  }
}

addAdmin();
