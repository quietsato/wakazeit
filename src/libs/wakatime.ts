import { WakaTimeStats, WakaTimeStatsRange } from "../types/wakatime";

/**
 * If WakaTime API url is changed, please modify this function.
 */
function generateWakaTimeApiUrl(username: string, range: WakaTimeStatsRange) {
  return `https://wakatime.com/api/v1/users/${username}/stats/${range}`;
}

export function fetchWakaTimeUserStats(
  username: string,
  range: WakaTimeStatsRange
): Promise<WakaTimeStats> {
  return new Promise(async (resolve, reject) => {
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
            .catch((error) =>
              reject(`Failed to parse WakaTime API response json. ${error}`)
            );
        })
        .catch((error) => {
          reject(error);
        });
    } catch (exception) {
      reject(exception);
    }
  });
}
