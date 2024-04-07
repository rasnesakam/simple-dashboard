"use client"
import { createElement, useEffect, useState } from "react"
import {TextEditor} from "@/components/TextEditor";

interface Blog {
	title: string,
	contents: string[]
}

const CLS_PARAGRAPH = "w-full py-4 px-2 mt-4";
const CLS_HEADER_MAIN = "w-full text-4xl font-bold"

const CreateBlog = () => {
	const [blog, setBlog] = useState({title: "", contents: Array()} as Blog);
	const [content, setContent] = useState("");
	function changeContent(index: number, content: string){
		let newBlog = {...blog}
		newBlog.contents[index] = content;
		setBlog(newBlog);
	}
	
	function toLast(element: HTMLElement){
		// let newline = "<br>";
		let selection = window.getSelection();
		let newpos = document.createRange();
		// if (!element.innerHTML.endsWith(newline))
		// 	element.innerHTML += newline;
		// element.innerHTML += newline;
		newpos.setStart(element, element.childNodes.length );
		newpos.collapse(true);
		selection?.removeAllRanges();
		selection?.addRange(newpos);
		element.focus();
	}

	function focusOn(parent: HTMLElement, index: number){
		setTimeout(() => {
			let selection = window.getSelection();
			let newpos = document.createRange();
			newpos.setStart(parent, parent.childNodes.length );
			newpos.collapse(true);
			selection?.removeAllRanges();
			selection?.addRange(newpos);
			(parent.children.item(index) as HTMLElement).focus();
		},120);
	}

	function handleKeyEvent(index: number,e: React.KeyboardEvent){
		if (e.key === 'Enter' && !e.shiftKey)
		{
			e.preventDefault();
			let element = e.target as HTMLElement;
			let parent = element.parentElement!;
			insertContent(parent,index + 1);
			
		}
		if (e.key === "Backspace"){
			if (blog.contents[index].length == 0)
			{
				let element = e.target as HTMLElement;
				let parent = element.parentElement!;
				removeContent(parent,index);
			}
		}
		
	}
	function removeContent(parent: HTMLElement, index: number){
		let newBlog = {...blog}
		newBlog.contents.splice(index,1);
		setBlog(newBlog)
		if (index > 0)
			focusOn(parent, index - 1);
	}
	function insertContent(parent: HTMLElement, index: number){
		let newBlog = {...blog}
		newBlog.contents.splice(index,0,"");
		setBlog(newBlog)
		focusOn(parent,index);
	}
	return <>
		<button onClick={e => {console.log(window.getSelection());alert(window.getSelection())}} className="w-full p-2 bg-gray-200">alert</button>
		<div className="pt-20 px-10">
			<input className={`${CLS_HEADER_MAIN} bg-transparent outline-none`} placeholder="Başlık" value={blog.title} onChange={e => setBlog({...blog, title: e.target.value})}/>

			<TextEditor onContentUpdate={setContent}/>

			<button onClick={e => {
				let display = document.getElementsByClassName("display");
				display[0].innerHTML = '';
				display[0].innerHTML = content;
			}}>yazdır</button>
			<div className="display"></div>
		</div>
	</>
}

export {CreateBlog}