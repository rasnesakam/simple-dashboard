import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import Select from "react-select";

declare type Category = {
  id: string,
  name: string,
  uri: string,
};

declare type Product = {
	name: string,
	description: string,
	price: number,
	tags: string[],
	properties: { key: string; value: string }[],
	productImages?: { fileUri: string; altText: string }[],
	productCategories?: Category[],
	uri?: string
};

export default function Product() {
	const [title, setTitle] = useState("");
	
	const [description, setDescription] = useState("");
	
	const [price, setPrice] = useState("");
	
	const [tags, setTags] = useState("");
	
	const [category, setCategory]: [Category, any] = useState({
		id: "",
		name: "",
		uri: "",
	});
	
	const [properties, setProperties] = useState("");
	
	const [categories, setCategories]: [Array<Category>, any] = useState([]);

	const [products, setProducts]: [Array<Product>, Dispatch<SetStateAction<Array<Product>>>] = useState(Array())
	
	const [options, setOptions]: [
		Array<{ value: number; label: string }>,
		Dispatch<SetStateAction<Array<{ value: number; label: string }>>>
	] = useState(Array());

	useEffect(() => {
		fetch("http://localhost:5047/Categories")
		.then((response) => {
			if (response.ok) return response.json();
			throw Error(response.statusText);
		})
		.then((data) => {
			let datas: Array<Category> = [];
			data.map((item: any) => {
				datas.push({ id: item.id, name: item.name, uri: item.uri });
			});
			setCategories(datas);
			setOptions(
				categories.map((item, index) => {
				return { value: index, label: item.name };
				})
			);
		})
		.catch((err) => console.error(err));

		fetch("http://localhost:5047/Products/All").then((response) =>{
			if (response.ok)
				return response.json();
			throw Error(response.statusText)
		}).then(data => {
			if (Array.isArray(data))
				setProducts(data as Product[])
		})
		.catch
		
	}, []);
	
	const submitForm = (e: SyntheticEvent) => {
		e.preventDefault();
		
		let request = {
			name: title,
			description,
			price,
			sellerId: "3988518e-2f7f-45e9-8f40-cd9b6693ea52",
			categories: [category],
			tags: tags.toLowerCase().split(" "),
			properties: [],
		};
		fetch("http://localhost:5047/Products/Submit", {
			method: "POST",
			headers: {
			"Content-Type": "application/json",
			},
			body: JSON.stringify(request),
		});
	};

	return (
	<>
		<form className="mt-5 mb-5 grid grid-cols-3 w-full" onSubmit={submitForm}>
			<div className="flex flex-col p-2">
				<label htmlFor="title">Başlık</label>
				<input
					className=""
					type="text"
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Başlık"
				/>
			</div>
			<div className="flex flex-col p-2">
				<label htmlFor="price">Fiyat (₺)</label>
				<input
					id="price"
					className=""
					type="number"
					value={price}
					onChange={(e) => setPrice(e.target.value)}
					placeholder="Fiyat"
				/>
			</div>
			<div className="flex flex-col p-2">
				<label htmlFor="tags">Etiketler</label>
				<input
					id="tags"
					className=""
					type="text"
					value={tags}
					onChange={(e) => setTags(e.target.value)}
					placeholder="Etiketler"
				/>
			</div>
			<div className="flex flex-col col-span-3 p-2">
				<label htmlFor="category">Kategori</label>
				<Select
					id="category"
					options={options}
					placeholder="Kategori Seç"
					onChange={(e) => {
					if (e == null) {
						alert("Lütfen kategori seç");
						return;
					}
					setCategory(categories[e?.value ?? 0]);
					}}
				/>
			</div>
			<div className="flex flex-col col-span-3 p-2">
				<label htmlFor="short-description">Kısa Açıklama</label>
				<textarea
					className=""
					value={description}
					id="short-description"
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Açıklama"
				/>
			</div>
			<div className="col-span-3 flex flex-row justify-center">
				<button className="mx-auto p-2 border-2 rounded-md border-gray-700 hover:bg-slate-700 hover:text-gray-200" type="submit">Kaydet</button>
			</div>
		</form>
		<table className="w-full text-smtext-left text-gray-500 dark:text-gray-400">
			<thead className="p-2 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
				<tr>
					<th scope="col" className="px-6 py-3">Başlık</th>
					<th scope="col" className="px-6 py-3 text-left">Fiyat</th>
					<th scope="col" className="px-6 py-3 text-left">Kategori</th>
					<th scope="col" className="px-6 py-3 text-left">Kısa Açıklama</th>
				</tr>
			</thead>
			<tbody>
				{products.map((item, index) => 
					<tr 
						className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:bg-gray-700"
						key={index} onClick={() => window.location.href = `/product/info/${item.uri}`}>
						<th scope="row" 
							className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
								{item.name}
						</th>
						<td className="px-6 py-4">{item.price}₺</td>
						<td className="px-6 py-4">{item.productCategories?.at(0)?.name}</td>
						<td className="px-6 py-4">{item.description}</td>
					</tr>
				)}
			</tbody>
		</table>
	</>
	);
}
