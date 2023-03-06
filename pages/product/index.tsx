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

declare type ComponentForm = {
	title: string,
	description: string,
	price: number,
	tags: string,
	category: Category,
	properties: Array<{key:string, value:string}>,
}

declare type SelectOption = { value: number; label: string }

declare type PageState = {
	categories: Category[],
	products: Product[],
	selectOptions: SelectOption[]
}

declare type ComponentState = {
	formState: ComponentForm,
	pageState: PageState

}

export default function Product() {

	const emptyState: ComponentState = {
		formState: {
			title: "",
			description: "",
			price: 0,
			category: {id: "", name: "",uri:""},
			properties: Array(),
			tags: ""
		},
		pageState: {
			categories: Array(),
			products: Array(),
			selectOptions: Array()
		}
	};
	const [state, setState] = useState(emptyState);

	useEffect(() => {
		fetch("http://localhost:5047/Categories")
		.then((response) => {
			console.log(response);
			if (response.ok) return response.json();
			throw Error(response.statusText);
		})
		.then((data) => {
			let datas: Array<Category> = [];
			data.map((item: any) => {
				state.pageState.categories.push({ id: item.id, name: item.name, uri: item.uri });
			});
			state.pageState.categories.forEach((item, index) => state.pageState.selectOptions.push({ value: index, label: item.name }))
		})
		.catch((err) => console.error(err));

		fetch("http://localhost:5047/Products/All").then((response) =>{
			if (response.ok)
				return response.json();
			throw Error(response.statusText)
		}).then(data => {
			if (Array.isArray(data))
				state.pageState.products = data as Product[]
		})
		.catch((err) =>{
			console.error(err);
		})
		
	}, [state]);
	
	const submitForm = (e: SyntheticEvent) => {
		e.preventDefault();
		
		let request = {
			name: state.formState.title,
			description: state.formState.description,
			price: state.formState.price,
			sellerId: "b633bee4-f820-4e18-9dbe-f928d172a308",
			categories: [state.formState.category],
			tags: state.formState.tags.toLowerCase().split(" "),
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
					value={state.formState.title}
					onChange={(e) => state.formState.title = e.target.value}
					placeholder="Başlık"
				/>
			</div>
			<div className="flex flex-col p-2">
				<label htmlFor="price">Fiyat (₺)</label>
				<input
					id="price"
					className=""
					type="number"
					value={state.formState.price}
					onChange={(e) => state.formState.price = parseInt(e.target.value)}
					placeholder="Fiyat"
				/>
			</div>
			<div className="flex flex-col p-2">
				<label htmlFor="tags">Etiketler</label>
				<input
					id="tags"
					className=""
					type="text"
					value={state.formState.tags}
					onChange={(e) => state.formState.tags = e.target.value}
					placeholder="Etiketler"
				/>
			</div>
			<div className="flex flex-col col-span-3 p-2">
				<label>Kategori</label>
				<Select
					options={state.pageState.selectOptions}
					placeholder="Kategori Seç"
					instanceId={"select"}
					classNames={{
						control: (state) =>
						  state.isFocused ? 'border-red-600' : 'border-grey-300',
						
					  }}
					onChange={(e) => {
					if (e == null) {
						alert("Lütfen kategori seç");
						return;
					}
					state.formState.category = state.pageState.categories[e?.value ?? 0];
					}}
				/>
			</div>
			<div className="flex flex-col col-span-3 p-2">
				<label htmlFor="short-description">Kısa Açıklama</label>
				<textarea
					className=""
					value={state.formState.description}
					id="short-description"
					onChange={(e) => state.formState.description = e.target.value}
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
				{state.pageState.products.map((item, index) => 
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
