/**
 * If WakaTime URL is changed, please modify this function.
 */

import { WakaTimeStatsRange } from "types/wakatime";

export function generateWakaTimeUserPageLink(username: string) {
  return `https://wakatime.com/${username}`;
}

export function generateWakaTimeUserAvatarLink(userId: string, size?: number) {
  const avatarSize = size ?? 420;
  return `https://wakatime.com/gravatar/${userId}?s=${avatarSize}`;
}

export function generateWakaTimeApiUrl(
  username: string,
  range: WakaTimeStatsRange
) {
  return `https://wakatime.com/api/v1/users/${username}/stats/${range}`;
}
