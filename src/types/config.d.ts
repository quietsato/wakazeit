import { WakaTimeStatsRange } from "./wakatime";

export interface Config {
  api: {
    range: WakaTimeStatsRange;
  };
  usernames: string[];
}
