import Link from "next/link"

const Links = () => {

	return <>
		<ul>
			<li><Link href={"/blogs/add"}>Yazı Ekle</Link></li>
			<li><Link href={"/blogs/"}>Yazılar</Link></li>
		</ul>
	</>
}

export {Links}