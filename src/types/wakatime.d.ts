/**
 * WakaTime API Documentation
 * https://wakatime.com/developers#stats
 */

export interface WakaTimeStats {
  /* float: total coding activity as seconds for the given range of time */
  total_seconds: number
  /* float: average coding activity per day as seconds for the given range of time */
  daily_average: number
  /* WakaTimeStatsLanguage */
  languages: WakaTimeStatsLanguage[]
  /* string: start of this time range as ISO 8601 UTC datetime */
  start: string
  /* string: end of this time range as ISO 8601 UTC datetime */
  end: string
  /* string: public username for this user */
  username: string
  /* string: unique id of this user*/
  user_id: string
}

export interface WakaTimeStatsLanguage {
  /* string: language name */
  name: string
  /*float: percent of time spent in this language */
  percent: number
  /* integer: hours portion of coding activity for this language */
  hours: number
  /* integer: minutes portion of coding activity for this language */
  minutes: number
}

export type WakaTimeStatsRange =
  | "last_7_days"
  | "last_30_days"
  | "last_6_months"
  | "last_year"
