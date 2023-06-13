import React, {
	useEffect,
	useState,
} from "react";
import Select from "react-select";
import {useAppSelector} from "src/redux/Store";

interface ProductForm extends EventTarget{
	title: HTMLInputElement,
	price: HTMLInputElement,
	tags: HTMLInputElement,
	category: HTMLInputElement,
	description: HTMLTextAreaElement,
	imageUris: HTMLInputElement
}

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

declare type SelectOption = { value: number; label: string }

declare type PageState = {
	categories: Category[],
	products: Product[],
	selectOptions: SelectOption[],
	selectedCategory: Category
}

export default function Product() {

	const emptyState: PageState = {
		categories: [],
		products: [],
		selectOptions: [],
		selectedCategory: {
			name:"",
			uri: "",
			id: ""
		}
	};
	const [state, setState] = useState(emptyState);
	const profile = useAppSelector((state) => state.profile);

	useEffect( () => {
		fetch("http://localhost:5047/Categories")
		.then((response) => {
			if (response.ok) return response.json();
			throw Error(response.statusText);
		})
		.then((data) => {
			if (Array.isArray(data))

				setState({...state, categories: data.map(item => ({id: item.id, uri: item.uri, name: item.name}))})
				
			setState(
				{
					...state,
						selectOptions: state.categories.map<SelectOption>((category, index) => ({value:index, label: category.name}))
				}
			)
		})
		.catch((err) => console.error(err));

		fetch("http://localhost:5047/Products/All").then((response) =>{
			if (response.ok)
				return response.json();
			throw Error(response.statusText)
		}).then(data => {
			if (Array.isArray(data))
				state.products = data as Product[]
		})
		.catch((err) =>{
			console.error(err);
		})
		return () => {
			state.categories.splice(0,state.categories.length);
			state.products.splice(0,state.products.length);
			state.selectOptions.splice(0, state.selectOptions.length);
		}
	}, []);
	
	const submitForm = (e: React.SyntheticEvent) => {
		e.preventDefault();
		const target = e.target as ProductForm;
		let request = {
			name: target.title.value,
			description: target.description.value,
			price: parseInt(target.price.value),
			sellerId: profile.id,
			categories: [],
			tags: target.tags.value.toLowerCase().split(" "),
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
					name="title"
					placeholder="Başlık"
				/>
			</div>
			<div className="flex flex-col p-2">
				<label htmlFor="price">Fiyat (₺)</label>
				<input
					id="price"
					className=""
					type="number"
					name="price"
					placeholder="Fiyat"
				/>
			</div>
			<div className="flex flex-col p-2">
				<label htmlFor="tags">Etiketler</label>
				<input
					id="tags"
					className=""
					type="text"
					name="tags"
					placeholder="Etiketler"
				/>
			</div>
			<div className="flex flex-col col-span-3 p-2">
				<label>Kategori</label>

				<Select
					options={state.selectOptions}
					placeholder="Kategori Seç"
					instanceId={"select"}

					onChange={(e) => {
						if (e == null) {
							alert("Lütfen kategori seç");
							return;
						}
						setState({...state, selectedCategory: state.categories[e?.value ?? 0]});
					}}
				/>
			</div>
			<div className="flex flex-col col-span-3 p-2">
				<label htmlFor="short-description">Kısa Açıklama</label>
				<textarea
					className=""
					id="short-description"
					name="description"
					placeholder="Açıklama"
				/>
			</div>
			<div className="col-span-3 flex flex-row justify-center">
				<button className="mx-auto p-2 border-2 rounded-md border-gray-700 hover:bg-slate-700 hover:text-gray-200" type="submit">Kaydet</button>
			</div>
		</form>
		<form action="localhost:5047/Media/Image" encType="multipart/form-data" method="post">
			<input type="file" name="file" id="file" />
			<input type="submit" value="Kaydet" />
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
				{state.products.map((item, index) =>
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
