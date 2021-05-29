import React,{ useState } from "react";

import UserStatsCard, { TimeDisplayMode } from "components/user-stats-card";
import config from "config";
import { fetchWakaTimeUserStats } from "libs/wakatime";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";

import styles from "../styles/Home.module.css";
import { WakaTimeStats, WakaTimeStatsRange } from "../types/wakatime";



export default function Home({
  wakaTimeStatsList,
  buildTime,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
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
    return new Promise<WakaTimeStats>((resolve, reject) =>
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

  const statsList = [...fetchedStatsList].sort(
    (a, b) => b.total_seconds - a.total_seconds
  );

  return {
    props: {
      wakaTimeStatsList: statsList,
      buildTime: new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
    },
    revalidate: 5 * 60 // Every 5 minutes
  };
};
