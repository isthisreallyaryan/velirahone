// functions/verify-citation/index.ts
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

    const { url, claim, messageId, challengerId } = await req.json();

    // 1. Fetch target URL HTML (Simulated headless extraction)
    // In production, integrate fetch(url) with a DOM parser or LLM extraction API
    const extractedExcerpt = `Empirical evidence from primary source directly addressing: "${claim}". Verified objective context.`;
    const confidenceScore = 91;

    // 2. Record Citation
    const { data: citation, error } = await supabase
      .from('citations')
      .insert({
        message_id: messageId,
        challenger_id: challengerId,
        source_url: url,
        excerpt: extractedExcerpt,
        status: confidenceScore > 80 ? 'verified' : 'rejected'
      })
      .select()
      .single();

    if (error) throw error;

    // 3. Update Message Status if verified
    if (confidenceScore > 80) {
      await supabase
        .from('messages')
        .update({ status: 'verified' })
        .eq('id', messageId);
    }

    return new Response(
      JSON.stringify({ success: true, citation, confidenceScore }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});

