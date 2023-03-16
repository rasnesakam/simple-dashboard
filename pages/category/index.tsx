import { SyntheticEvent, useEffect, useState } from "react"
import {useAppSelector} from "src/redux/Store";

declare type Category = {
	id: string,
	name: string,
	uri: string
}

export default function Category(){
	const [name, setName] = useState("");
	const profile = useAppSelector((state) => state.profile);
	const [categories, setCategories]: [Array<Category>, any] = useState([]);

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
		})
		.catch((err) => console.error(err));
		return () => {}
	},[])
	
	const submitForm = (e: SyntheticEvent) =>{
		e.preventDefault();
		let request = {
			name,
			sellerId: profile.id,
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
		
		fetch("http://localhost:5047/Categories/Submit",{
			method: "POST",
			headers:{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(request)
		})
	}

	return <>

		<form className="hidden" id="form-submit" onSubmit={submitForm}>
		</form>
		<table className="w-full text-smtext-left text-gray-500 dark:text-gray-400">
			<thead className="p-2 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
				<tr>
					<th scope="col" className="px-6 py-3">Başlık</th>
					<th scope="col" className="px-6 py-3">Başlık</th>
				</tr>
			</thead>
			<tbody>
				<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
					<td className="px-2 py-1font-medium text-gray-900 whitespace-nowrap dark:text-white">
						<input type="text" className="w-full text-center px-2 py-1" form="form-submit" value={name} onChange={e => setName(e.target.value)} placeholder="Kategori Adı"/>
					</td>
					<td className=" font-medium text-gray-900 whitespace-nowrap dark:text-white">
						<button type="submit" className="hover:bg-gray-700 p-5 w-full" form="form-submit">Kaydet</button>
					</td>
				</tr>
				{categories.map((item, index) => 
					<tr 
						className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
						key={index} onClick={() => window.location.href = `/product/info/${item.uri}`}>
						<th scope="row" 
							className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
								{item.name}
						</th>
						<td className=" font-medium text-gray-900 whitespace-nowrap dark:text-white">
							<button type="button" className="hover:bg-gray-700 p-5 w-full"></button>
						</td>
					</tr>
				)}
			</tbody>
		</table>
	</>
}