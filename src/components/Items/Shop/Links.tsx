import Link from "next/link"

const Links = () => {

	return <>
		<ul>
			<li><Link href={"/products/add"}>Ürün Ekle</Link></li>
			<li><Link href={"/products/"}>Ürünler</Link></li>
		</ul>
	</>
}

export {Links}