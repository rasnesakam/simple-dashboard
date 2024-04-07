'use client'

import {useEffect} from "react";

const ROOT_CLASSNAME = "editor-content";

function startEffectFor(htmlElement: HTMLElement, content: string, onContentChange: (arg0: string) => void){
    htmlElement.innerHTML = content;
    htmlElement.addEventListener('keyup', (e) => {
        e.preventDefault()
        console.log(e)
        onContentChange(htmlElement.innerHTML ?? "")
    })
}

function cleanEffectFor(e: HTMLElement){}

function initEffects(content: string, onContentChange: (arg0: string) => void){
    let root = document.getElementsByClassName(ROOT_CLASSNAME)
    for (let i = 0; i < root.length; i++){
        startEffectFor(root.item(i)! as HTMLElement, content, onContentChange);
    }
}

function cleanEffect(){
    let root = document.getElementsByClassName(ROOT_CLASSNAME)
    for (let i = 0; i < root.length; i++){
        cleanEffectFor(root.item(i)! as HTMLElement);
    }
}

function addParagraph(){

}

function TextEditor({content, onContentUpdate}:{content?: string, onContentUpdate: (arg0: string) => void}){

    useEffect(()=> {
        initEffects(content ?? "", onContentUpdate)
        return cleanEffect
    },[content, onContentUpdate])
    return <>
        <div className={`${ROOT_CLASSNAME}`} contentEditable={true}>
        </div>
        <button onClick={addParagraph}>Add Paragraph</button>
    </>
}

export {TextEditor}