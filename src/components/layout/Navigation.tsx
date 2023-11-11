"use client"
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import { Links as ShopLinks } from "../Items/Shop/Links";
import { Links as BlogLinks } from "../Items/Blog/Links";

const Navigation = () => {
	const links = [
		{
			label: "Alışveriş",
			content: <ShopLinks/>
		},
		{
			label: "Blog",
			content: <BlogLinks/>
		}
		
	]
	const defaultContent = "Selam"

	return <>
		<div className="mt-2 ml-2">
			<div className="text-4xl font-bold">Simple</div>
			<div className="text-xl">Dashboard</div>
		</div>
		<div className="py-10 px-5">
			<Accordion>
				{links.map((link, index) => (<AccordionItem key={index} aria-label={link.label} title={link.label}><div className="px-4">{link.content}</div></AccordionItem>))}
			</Accordion>
		</div>
	</>

}

export {Navigation}