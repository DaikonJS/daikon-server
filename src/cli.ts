import Daikon from "@daikonjs/core";
import { program } from "commander";
import { lstatSync, readFileSync, readdirSync } from "fs";
import { serve } from "./serve";

// Define your program and its options
program
  .version("1.0.0")
  .description("A simple CLI program in TypeScript")
  .option("-i, --input <dkon file>", "Input file")
  .option("-s, --string <dkon string>", "Input string")
  .parse(process.argv);

program.parse();

const options = program.opts();

const main = async () => {
  if (options.input || options.string) {
    const isDirectory = lstatSync(options.input).isDirectory();

    // if we're given a directory, we'll serve all the daikon files in it
    if (isDirectory) {
      const files = readdirSync(options.input).filter((f) =>
        f.endsWith(".daikon")
      );
      const daikons = files.reduce((acc, file) => {
        const input = readFileSync(`${options.input}/${file}`, "utf8");
        const daikon = new Daikon(input);
        return { ...acc, [file.replace(".daikon", "")]: daikon };
      }, {});
      await serve(daikons);
    } else {
      const input = options.input
        ? readFileSync(options.input, "utf8")
        : options.string;
      const daikon = new Daikon(input);
      await serve({ index: daikon });
    }
  }
};

main();
