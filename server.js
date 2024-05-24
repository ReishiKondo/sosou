import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { serveDir } from 'https://deno.land/std@0.224.0/http/file_server.ts';
import { decode } from "https://deno.land/x/utf8/mod.js";
//import { parse } from "https://deno.land/std/encoding/yaml.ts";
import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";

const port = 8000;
const server = serve(async (req) => {

  async function loadCounterValue() {
    const filePath = './public/example.json';
    const data = await Deno.readTextFile(filePath);
    const counters = JSON.parse(data);
    return counters;
  }

  const path = new URL(req.url).pathname;
  console.log("path", path);

  if (req.method === 'GET' && path === '/get-count') {
    let test = await loadCounterValue();
    console.log(test);
    return new Response(JSON.stringify(test));

  }



  if (req.method === "POST") {

    // example_read.ts

    try {
      const data = await Deno.readTextFile(filePath);
      const counters = JSON.parse(data);

      let uint8Array;
      const body = req.body; // リクエストのボディデータを取得
      for await (const chunk of body) {
        uint8Array = chunk;
      }
      const jsonString = new TextDecoder().decode(uint8Array);

      console.log(jsonString); // {"counter_id":1,"upDown":0}
      const getData = JSON.parse(jsonString);
      console.log("countID", getData.counter_id);
      counters[`counter${getData.counter_id}`]++;
      console.log("result of renew counter1", counters.counter1);
      const updatedJsonData = JSON.stringify(counters, null, 2);
      // JSONファイルに書き込む
      await Deno.writeTextFile(filePath, updatedJsonData);
      console.log('カウンターの値を更新しました');
      const responseData = {
        message: "User data retrieved successfully",
        user: 3
      };

      // レスポンスを返す
      req.respond({ body: JSON.stringify(responseData) });
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }

    /* const form = await req.formData();
    await client.queryObject(
      "insert into Comments (name, comment) values ($1, $2)",
      [form.get("name"), form.get("comment")],
    );
    return new Response("", {
      status: 303,
      headers: {
        Location: "/",
      },
    }); */
  }


  return serveDir(req, {
    fsRoot: 'public',
    urlRoot: '',
    showDirListing: true,
    enableCors: true,
  });
});

console.log(`HTTP server is running on http://localhost:${port}/`);
