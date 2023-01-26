import { SyntheticEvent, useEffect, useState } from "react"
import Select from "react-select"

declare type Category = {
	id: string,
	name: string,
	uri: string
}

declare type Product = {
	name: string,
	description: string,
	price: number,
	tags: string[],
	properties: {key:string, value: string}[]
	productImages?: {fileUri: string, altText: string}[]
	productCategories?: Category[]
}

export default function Category(){
	const [name, setName] = useState("");
	
	const submitForm = (e: SyntheticEvent) =>{
		e.preventDefault();
		let request = {
			name,
			uri: name.toLowerCase()
			.replaceAll(/ç/g,"c")
			.replaceAll(/ğ/g,"g")
			.replaceAll(/ı/g,"i")
			.replaceAll(/ö/g,"o")
			.replaceAll(/ş/g,"s")
			.replaceAll(/ü/g,"u")
			.replaceAll(/ /g,"-")
		}
		console.log(request);
		/*
		fetch("http://localhost:5047/Products/Submit",{
			method: "POST",
			headers:{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(request)
		})*/
	}

	return <>

		<form className="flex flex-col mx-auto my-auto" onSubmit={submitForm}>
			<input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Kategori Adı"/>
			<button type="submit">Kaydet</button>
		</form>
	
	</>
}