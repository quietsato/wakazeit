import Head from "next/head";
import { GetStaticProps, InferGetStaticPropsType } from "next";

import { WakaTimeStats, WakaTimeStatsRange } from "../types/wakatime";
import { fetchWakaTimeUserStats } from "libs/wakatime";

import config from "config";
import styles from "../styles/Home.module.css";
import UserStatsCard, { TimeDisplayMode } from "components/user-stats-card";
import { useState } from "react";

export default function Home({
  wakaTimeStatsList,
  buildTime,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [timeDisplayMode, setTimeDisplayMode] = useState<TimeDisplayMode>(
    "total"
  );

  const displayModeToggleButtonClicked = () => {
    setTimeDisplayMode((timeDisplayMode) => {
      switch (timeDisplayMode) {
        case "daily-average":
          return "total";
        case "total":
          return "daily-average";
        default:
          return "total";
      }
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>WakaZeit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.siteTitle}>WakaZeit</div>
        <button
          className={styles.displayModeToggleButton}
          onClick={displayModeToggleButtonClicked}
        >
          {getDisplayModeToggleButtonText(timeDisplayMode)}
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.statsList}>
          {wakaTimeStatsList.map((stats: WakaTimeStats) => (
            <div className={styles.card} key={stats.username}>
              <UserStatsCard
                stats={stats}
                timeDisplayMode={timeDisplayMode}
                maxLanguages={5}
              />
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <div>Build Date: {buildTime}</div>
        <div>&copy; 2021 quietsato</div>
      </footer>
    </div>
  );
}

function getDisplayModeToggleButtonText(mode: TimeDisplayMode) {
  switch (mode) {
    case "daily-average":
      return "Daily Average";
    case "total":
      return "Last 7 Days";
    default:
      return "";
  }
}

export const getStaticProps: GetStaticProps = async () => {
  const fetchDelay = 500; // ms

  // read config
  const wakaTimeUsernames = config.usernames;
  const wakaTimeStatsRange = config.api.range as WakaTimeStatsRange;

  const fetchWakaTimeStats = wakaTimeUsernames.map((username, i) => {
    return new Promise<WakaTimeStats>(async (resolve, reject) =>
      setTimeout(() => {
        fetchWakaTimeUserStats(username, wakaTimeStatsRange)
          .then(resolve)
          .catch(reject);
      }, fetchDelay * i)
    );
  });

  const fetchedStatsList: WakaTimeStats[] = await Promise.all(
    fetchWakaTimeStats
  );

  const statsList = fetchedStatsList.sort(
    (a, b) => b.total_seconds - a.total_seconds
  );

  return {
    props: {
      wakaTimeStatsList: statsList,
      buildTime: new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
    },
  };
};
