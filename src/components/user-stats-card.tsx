import React,{VFC} from "react";

import colors from "github-colors/colors.json";
import {
  generateWakaTimeUserAvatarLink,
  generateWakaTimeUserPageLink,
} from "libs/urls";
import Link from "next/link";
import LazyLoad from "react-lazyload";
import { WakaTimeStats } from "types/wakatime";

import styles from "../styles/user-stats-card.module.css";

export type TimeDisplayMode = "total" | "daily-average";

interface Props {
  stats: WakaTimeStats;
  timeDisplayMode: TimeDisplayMode;
  maxLanguages: number;
}

export const UserStatsCard: VFC<Props> = ({
  stats,
  timeDisplayMode,
  maxLanguages,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.layout}>
        <div className={styles.cardTopLayout}>
          <div className={styles.avatarContainer}>
            <LazyLoad once>
              <img
                src={generateWakaTimeUserAvatarLink(stats.user_id)}
                className={styles.avatar}
                alt={stats.username}
              />
            </LazyLoad>
          </div>
          <div className={styles.timeAndLanguageContainer}>
            <div className={styles.timeContainer}>
              {displayTime(getDisplaySeconds(stats, timeDisplayMode))}
            </div>
            <div>
              {stats.languages.slice(0, maxLanguages).map((language) => (
                <div className={styles.languageContainer} key={language.name}>
                  <span
                    className={styles.languageMarker}
                    style={{
                      backgroundColor: getColorOfLanguage(language.name),
                    }}
                  />
                  <span className={styles.languageName}>{language.name}</span>
                  <span className={styles.languageTime}>
                    {displayTime(language.hours, language.minutes)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <span className={styles.userPageLink}>
            <Link href={generateWakaTimeUserPageLink(stats.username)}>
              <span>@{stats.username}</span>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

function displayTime(seconds: number);
function displayTime(hour: number, minute: number);
function displayTime(x: number, y?: number) {
  let h = 0,
    m = 0;
  if (typeof y == "number") {
    h = x;
    m = y;
  } else {
    [h, m] = calculateHourAndMinute(x);
  }

  return (
    <span>
      <span className={styles.timeFigure}>{h}</span>
      <span className={styles.timeUnit}>h</span>
      <span className={styles.timeFigure}>{m.toString().padStart(2, "0")}</span>
      <span className={styles.timeUnit}>m</span>
    </span>
  );
}

function calculateHourAndMinute(seconds: number): [number, number] {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return [h, m];
}

function getColorOfLanguage(language: string): string {
  const fallbackColor = "#ededed";

  const colorData = colors[language];
  if (colorData == null) {
    return fallbackColor;
  } else {
    return colorData.color ?? fallbackColor;
  }
}

function getDisplaySeconds(
  stats: WakaTimeStats,
  timeDisplayMode: TimeDisplayMode
) {
  switch (timeDisplayMode) {
    case "total":
      return stats.total_seconds;
    case "daily-average":
      return stats.daily_average;
    default:
      return stats.total_seconds;
  }
}

export default UserStatsCard
