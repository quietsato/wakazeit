import Head from "next/head";
import { GetStaticProps, InferGetStaticPropsType } from "next";

import { WakaTimeStats, WakaTimeStatsRange } from "../types/wakatime";
import { fetchWakaTimeUserStats } from "libs/wakatime";

import config from "config";
import styles from "../styles/Home.module.css";

export default function Home({
  wakaTimeStatsList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className={styles.container}>
      <Head>
        <title>WakaZeit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        {wakaTimeStatsList.map((stats) => (
          <p key={stats.username}>
            <ul>
              <li>{stats.username}</li>
              <li>{stats.languages[0].name}</li>
            </ul>
          </p>
        ))}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
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

  const statsList: WakaTimeStats[] = await Promise.all(fetchWakaTimeStats);
  console.log(statsList);
  return {
    props: {
      wakaTimeStatsList: statsList,
    },
  };
};
