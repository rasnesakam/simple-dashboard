import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'


export default function Layout({children}: any){

	return <>
	
		<Head>
			<title>Batarya Dünyası</title>
			<meta name="description" content="Batarya Dünyası" />
			<link rel="shortcut icon" href="/images/favicon.ico" />
			<link rel="apple-touch-icon" sizes="180x180" href="/images/favicon.ico" />
		</Head>


		<div className="min-h-screen flex flex-row">
			<aside className="w-2/12 flex flex-col shadow shadow-lg pt-10 bg-foreground text-ground">
				<Link href="/product" className="m-2  transition duration-500 hover:scale-105 transform-gpu">Ürün Ekle</Link>
				<Link href="/category" className="m-2  transition duration-500 hover:scale-105 transform-gpu">Kategori Ekle</Link>
			</aside>
			<main className="w-9/12 flex flex-col items-center" >
			{children}
			</main>
		</div>
		

		<footer className={styles.footer}>
		<a
			href="https://emakas.net"
			target="_blank"
			rel="noopener noreferrer">
			Powered by{' emakas '}
			</a>
		</footer>



	</>
}