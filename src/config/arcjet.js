import arcjet, {
  shield,
  detectBot,
  tokenBucket,
  slidingWindow,
} from "@arcjet/node";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
    }),
    slidingWindow({
      mode: "LIVE",
      interval: 10,
      max: 5,
    }),
  ],
});

export default aj;
