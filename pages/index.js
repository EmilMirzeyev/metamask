import Head from 'next/head'
import dynamic from 'next/dynamic'
import WalletCard from '../components/WalletCard'
import styles from '../styles/Home.module.css'

// const WalletCard = dynamic(() => import("../components/WalletCard"), {
//   ssr: false,
// });

export default function Home() {
  return (
    <div className={styles.container}>
      <WalletCard />
    </div>
  )
}
