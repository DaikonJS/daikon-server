import express from "express";
import bodyParser from "body-parser";
import Daikon from "@daikonjs/core";

export const serve = async (daikons: Record<string, Daikon<any>>) => {
  const app = express();
  app.use(bodyParser.json());

  for (const [name, daikon] of Object.entries(daikons)) {
    const slugs = daikon.value.map((v) => v.slug);

    const prefix = name === "index" ? "" : `/${name}`;

    for (const slug of slugs) {
      const path = `${prefix}/${slug}`;
      console.log(`Serving ${path}`);
      app.get(path, async (req, res) => {
        const value = await daikon.get(slug);
        res.send(await value.render());
      });
    }
  }

  return app.listen(3100, () => {
    console.log("Server listening on port 3000");
  });
};
