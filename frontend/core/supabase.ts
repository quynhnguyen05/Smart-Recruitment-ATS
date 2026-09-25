import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://etydagbznkeksqijjysb.supabase.co";
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_vIUK0cLVKw0NLP4j4rj2Ng_AtvaQ-p8";

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
