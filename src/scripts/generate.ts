import { V2Api, Configuration } from "stable-horde-api";
const horde = new V2Api(
  new Configuration({
    apiKey: "lfCRZSC4LdsWDjNlgdURyg",
    basePath: "https://stablehorde.net/api",
  })
);

export const Generate = async (prompt: string) => {
  const res = await horde.postAsyncGenerate("lfCRZSC4LdsWDjNlgdURyg", {
    prompt,
  });
  if (!res.data.id) return [];
  var done = false;
  while (!done) {
    const status = await horde.getAsyncCheck(res.data.id);
    done = !!status.data.done;
  }
  const gens = (await horde.getAsyncStatus(res.data.id)).data.generations;
  return gens?.map((g) => g.img) || [];
};
