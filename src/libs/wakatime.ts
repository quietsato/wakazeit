import { WakaTimeStats, WakaTimeStatsRange } from "../types/wakatime";
import { generateWakaTimeApiUrl } from "./urls";

export function fetchWakaTimeUserStats(
  username: string,
  range: WakaTimeStatsRange
): Promise<WakaTimeStats> {
  return new Promise((resolve, reject) => {
    try {
      const apiUrl = generateWakaTimeApiUrl(username, range);
      const apiKeyEncoded = (() => {
        const apiKey = process.env.WAKATIME_APIKEY;
        if (apiKey == null) throw "env: WAKATIME_APIKEY isn't set.";
        return Buffer.from(apiKey, "binary").toString("base64");
      })();

      fetch(apiUrl, {
        headers: {
          Authorization: `Basic ${apiKeyEncoded}`,
        },
      })
        .then((response) => {
          response
            .json()
            .then((json) => {
              resolve(json.data as WakaTimeStats);
            })
            .catch((error: unknown) =>
              reject(`Failed to parse WakaTime API response json. ${error}`)
            );
        })
        .catch((error: unknown) => {
          reject(error);
        });
    } catch (exception) {
      reject(exception);
    }
  });
}
