import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";
const DEBUG = false;
async function loadCounterValue(): Promise<{ [key: string]: number }> {
  const filePath = "./public/example.json";
  const data = await Deno.readTextFile(filePath);
  const counters = JSON.parse(data);
  return counters;
}

async function writeCounterValue(counters: { [key: string]: number }) {
  const filePath = "./public/example.json";
  const updatedJsonData = JSON.stringify(counters, null, 2);
  // JSONファイルに書き込む
  await Deno.writeTextFile(filePath, updatedJsonData);
}

Deno.serve(async (req) => {
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

  if (req.method === "GET") {
    if (path === "/get-count") {
      const tmp = await loadCounterValue();
      return new Response(JSON.stringify(tmp));
    }
  } else if (req.method === "POST") {
    if (path === "/renew-count") {
      try {
        let uint8Array;
        const body = req.body;
        if (body !== null) {
          for await (const chunk of body) {
            uint8Array = chunk;
          }
        } else {
          throw new Error("Body is null!");
        }

        const jsonString = new TextDecoder().decode(uint8Array);
        console.log(jsonString); // {"counter_id":1,"upDown":0}
        const getData = JSON.parse(jsonString);
        console.log("countID", getData.counter_id);
        const counters = await loadCounterValue();

        const selectedCounterID = `counter${getData.counter_id}`;
        if (getData.upDown === 0) {
          counters[selectedCounterID]++;
        } else if (getData.upDown === 1) {
          counters[selectedCounterID]--;
        }

        console.log(
          "result of renew ",
          counters[selectedCounterID],
        );
        writeCounterValue(counters);
        console.log("カウンターの値を更新しました");
        const responseData = {
          message: "User data retrieved successfully",
          user: 3,
        };

        // レスポンスを返す
        return new Response(JSON.stringify(responseData));
      } catch (error) {
        console.error("エラー発生", error);
      }
    }
  }

  // publicフォルダ内にあるファイルを返す
  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
