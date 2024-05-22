import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { serveDir } from 'https://deno.land/std@0.224.0/http/file_server.ts';

serve(async (req) => {
  const path = new URL(req.url).pathname;

  return serveDir(req, {
    fsRoot: 'public',
    urlRoot: '',
    showDirListing: true,
    enableCors: true,
  });
});
