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

export default function Product(){
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [tags, setTags] = useState("");
	const [category, setCategory]: [Category, any] = useState({id:"",name:"",uri:""});
	const [properties, setProperties] = useState("");
	const [categories, setCategories] : [Array<Category>, any] = useState([])
	useEffect(() => {
		fetch("http://localhost:5047/Categories").then(response => {
			if (response.ok)
				return response.json()
			throw Error(response.statusText);
		}).then((data) => {
			let datas: Array<Category> = []
			data.map((item: any) => {
				datas.push({id: item.id, name: item.name, uri:item.uri})
			});
			setCategories(datas);
		}).catch(err => console.error(err));
	},[])
	const options = categories.map((item, index) => {return {value: index, label:item.name}})
	const submitForm = (e: SyntheticEvent) =>{
		e.preventDefault();
		let request = {
			name:title,
			description,
			price,
			sellerId: "3988518e-2f7f-45e9-8f40-cd9b6693ea52",
			categories: [category],
			tags: tags.toLowerCase().split(" "),
			properties: []
		}
		console.log(request);
		fetch("http://localhost:5047/Products/Submit",{
			method: "POST",
			headers:{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(request)
		})
	}

	return <>

		<form className="flex flex-col" onSubmit={submitForm}>
			<input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Başlık"/>
			<textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Açıklama"/>
			<input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Fiyat"/>
			<input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Başlık"/>
			<Select options={options} onChange={ e => {
				if (e == null)
				{
					alert("Lütfen kategori seç");
					return;
				}
				setCategory(categories[e?.value ?? 0])
			} }/>
			<button type="submit">Kaydet</button>
		</form>
	
	</>
}