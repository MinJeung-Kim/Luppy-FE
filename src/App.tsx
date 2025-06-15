import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import styles from "./App.module.css";

function App() {
  return (
    <>
      <Helmet>
        <title>Luppy | Home</title>
        <meta name="description" content="Happy Learning, Happy Luppy!" />
        <meta property="og:title" content="Luppy | Home" />
        <meta property="og:type" content="website" />
      </Helmet>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}

export default App;
