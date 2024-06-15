// import { serveDir } from 'https://deno.land/std@0.224.0/http/file_server.ts';
// import { decode } from "https://deno.land/x/utf8/mod.js";
//import { parse } from "https://deno.land/std/encoding/yaml.ts";
// import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";

//const port: number = 8000;
const server = Deno.serve(async (req) => {
  async function loadCounterValue() {
    const filePath = "./public/example.json";
    const data = await Deno.readTextFile(filePath);
    const counters = JSON.parse(data);
    return counters;
  }

  async function writeCounterValue(counters) {
    const filePath = "./public/example.json";
    const updatedJsonData = JSON.stringify(counters, null, 2);
    // JSONファイルに書き込む
    await Deno.writeTextFile(filePath, updatedJsonData);
  }

  const path = new URL(req.url).pathname;
  console.log("path", path);

  if (req.method === "GET" && path === "/get-count") {
    let tmp = await loadCounterValue();
    return new Response(JSON.stringify(tmp));
  }

  if (req.method === "POST") {
    if (path === "/renew-count") {
      try {
        let uint8Array;
        const body = req.body; // リクエストのボディデータを取得
        for await (const chunk of body) {
          uint8Array = chunk;
        }
        const jsonString = new TextDecoder().decode(uint8Array);
        console.log(jsonString); // {"counter_id":1,"upDown":0}
        const getData = JSON.parse(jsonString);
        console.log("countID", getData.counter_id);
        let counters = await loadCounterValue();
        if (getData.upDown === 0) {
          counters[`counter${getData.counter_id}`]++;
        } else if (getData.upDown === 1) {
          counters[`counter${getData.counter_id}`]--;
        }

        console.log(
          "result of renew ",
          counters[`counter${getData.counter_id}`],
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
        console.error("エラーが発生しました:", error);
      }
    }
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
