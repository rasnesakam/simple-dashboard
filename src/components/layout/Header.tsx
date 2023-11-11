
"use client"

import { Avatar } from "@nextui-org/avatar"
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { InboxIcon, MagnifyingGlassIcon, SunIcon, MoonIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

const Header = () => {
	const [search, setSearch] = useState("");

	return <div className="border-b-1 border-gray-500 flex gap-3 shadow-xl flex-row-reverse divide-x-reverse divide-x py-2 px-4">
	<div className="flex gap-4 flex-row items-center">
		<Button isIconOnly size="sm" >T</Button>
		<Button isIconOnly size="sm" className="bg-transparent text-gray-400 border border-gray-400 hover:border-gray-900 hover:text-gray-900 dark:hover:border-gray-200 dark:hover:text-gray-200">
			<InboxIcon className="h-5 w-5"/>
		</Button>
		<Avatar isBordered radius="full" size="sm" color="default" className="text-gray-800" name="EM" />
	</div>
	<div className="px-2">
		<Input type="text" isClearable={true} placeholder="Ara:" className="text-black" value={search} onValueChange={val => setSearch(val)} startContent={
			<MagnifyingGlassIcon className="h-5 w-5" />
		}  />
	</div>
	

</div>
}

export {Header}