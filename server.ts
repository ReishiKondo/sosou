import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

async function loadCounterValue() {
  const filePath = "./public/example.json";
  const data = await Deno.readTextFile(filePath);
  const counters = JSON.parse(data);
  return counters;
}

async function writeCounterValue(counters: string) {
  const filePath = "./public/example.json";
  const updatedJsonData = JSON.stringify(counters, null, 2);
  // JSONファイルに書き込む
  await Deno.writeTextFile(filePath, updatedJsonData);
}

Deno.serve(async (req) => {
  const DEBUG: number = 0;
  const url = new URL(req.url);
  const path = new URL(req.url).pathname;

  if (DEBUG) {
    console.log("Method:", req.method);
    console.log("Path:", url.pathname);
    console.log("Query parameters:", url.searchParams);
    console.log("Headers:", req.headers);
    if (req.body) {
      const body = await req.text();
      console.log("Body:", body);
    }
  }

  if (req.method === "GET" && path === "/get-count") {
    const tmp = await loadCounterValue();
    return new Response(JSON.stringify(tmp));
  }

  // publicフォルダ内にあるファイルを返す
  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
