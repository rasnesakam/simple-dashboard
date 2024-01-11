"use client"
import { createElement, useEffect, useState } from "react"

interface Blog {
	title: string,
	contents: string[]
}

const CLS_PARAGRAPH = "w-full py-4 px-2 mt-4";
const CLS_HEADER_MAIN = "w-full text-4xl font-bold"

const CreateBlog = () => {
	const [blog, setBlog] = useState({title: "", contents: Array()} as Blog);
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
			<div className="content" > 
				{blog.contents.map((value, index) => (
					<p key={index} className={`${CLS_PARAGRAPH} border-2 rounded-md border-black paragraph`} contentEditable
						onKeyDown={e => handleKeyEvent(index,e)}
						onInput={e => changeContent(index,(e.target as Element).innerHTML)}/>
				))}
				{
					(function(){
						let paragraphs = document.getElementsByClassName("paragraph");
						for (let i = 0; i < paragraphs.length; i++){
							let p = paragraphs.item(i);
							if (p)
							{
								p.innerHTML = blog.contents[i];
								toLast(p as HTMLElement);
							}
						}
						return <></>
					})()
				}
			</div>
			<button onClick={() => {insertContent(document.getElementsByClassName("content")[0] as HTMLElement, blog.contents.length)}} 
				className="w-full mt-2 p-2 hover:bg-slate-500">Paragraf Ekle</button>
			<button onClick={e => {
				let div = document.createElement("div");
				let header = document.createElement("h1");
				header.textContent = blog.title;
				header.className = CLS_HEADER_MAIN;
				div.appendChild(header);
				blog.contents.forEach(val => {
					let paragraph = document.createElement("p")
					paragraph.innerHTML = val;
					paragraph.className = CLS_PARAGRAPH;
					div.appendChild(paragraph);
				})
				let display = document.getElementsByClassName("display");
				display[0].childNodes.forEach(el => display[0].removeChild(el))
				display[0].appendChild(div);
			}}>yazdır</button>
			<div className="display"></div>
		</div>
	</>
}

export {CreateBlog}