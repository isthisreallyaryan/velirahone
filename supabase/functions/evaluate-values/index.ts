// functions/evaluate-values/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, dilemmaId, selectedOptionId } = await req.json();

    // 1. Fetch user current vector
    const { data: profile } = await supabase
      .from('profiles')
      .select('ideological_vector')
      .eq('id', userId)
      .single();

    if (!profile) throw new Error('User profile not found');

    // 2. Compute vector shift (simulated multidimensional adjustment)
    const current = profile.ideological_vector || [0.5, 0.5, 0.5, 0.5];
    const updated = current.map((val: number) => 
      Math.min(1, Math.max(0, val + (Math.random() * 0.04 - 0.02)))
    );

    // 3. Persist updated vector
    await supabase
      .from('profiles')
      .update({ ideological_vector: updated, updated_at: new Date().toISOString() })
      .eq('id', userId);

    return new Response(
      JSON.stringify({ success: true, updatedVector: updated }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});

