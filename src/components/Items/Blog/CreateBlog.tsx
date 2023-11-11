"use client"
import { useEffect, useState } from "react"

interface Blog {
	title: string,
	contents: string[]
}

const CLS_PARAGRAPH = "w-full mt-2 paragraph";
const CLS_HEADER_MAIN = "w-full text-4xl font-bold"

const CreateBlog = () => {
	const [blog, setBlog] = useState({title: "", contents: Array()} as Blog);
	function changeContent(index: number, content: string){
		let newBlog = {...blog}
		newBlog.contents[index] = content;
		setBlog(newBlog);
	}
	function handleKeyEvent(index: number,e: React.KeyboardEvent){
		console.log(e)
		if (e.key === 'Enter' && !e.shiftKey)
		{
			insertContent();
		}
		if (e.key === "Backspace"){
			if (blog.contents[index].length == 0)
			{
				let newBlog = {...blog}
				newBlog.contents.splice(index,1);
				setBlog(newBlog)
			}
		}
	}
	function insertContent(){
		let newBlog = {...blog}
		newBlog.contents.push("");
		setBlog(newBlog)
	}
	useEffect(() => {
		//window.addEventListener("keypress", handleKeyEvent);
		//return () => {window.removeEventListener("keypress",handleKeyEvent)}
	},[])
	return <>
		<div className="pt-20 px-10">
			<input className={`${CLS_HEADER_MAIN} bg-transparent outline-none`} placeholder="Başlık"/>
			<div className="">
				{blog.contents.map((value, index) => (
					<p key={index} contentEditable className={`outline-none ${CLS_PARAGRAPH}`} onKeyDown={e => handleKeyEvent(index,e)} onInput={e => changeContent(index,(e.target as Element).innerHTML)} />
				))}
			</div>
			<button onClick={insertContent} className="w-full p-2 hover:bg-slate-500">Ekle</button>
		</div>

		<div className="selected">

		</div>
	</>
}

export {CreateBlog}