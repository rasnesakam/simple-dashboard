import {useAppDispatch, useAppSelector} from "src/redux/Store";
import {ChangeEvent, useState} from "react";
import {login} from "src/redux/slices/Profile";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

export default function Login(){
    const auth = useAppSelector((state) => state.persistedReducer.profile);
    const dispatch = useAppDispatch();
    const [formDatas, setFormDatas] = useState({userName: "", password: ""});

    const {userName, password} = formDatas;
    const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormDatas({...formDatas, [name]:value});
    }
    const loginHandler = async () => {
        await fetch("http://localhost:5047/OAuth/Auth/Seller/",{
            method: "Post",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(formDatas)
        })
            .then(response => {
                if (response.ok)
                    return response.json()
                throw new Error(response.statusText);
            })
            .then(data => {console.log(data)})
            .catch(err => {console.log(err)})
    }
    return <>
        <input name="userName" className="" value={userName} placeholder="Kullanıcı Adı"
               onChange={onChangeInput}/>
        <input name="password" className="" value={password} placeholder="Şifre"
               onChange={onChangeInput}/>

        <button className="" type="button" onClick={loginHandler}>Giriş Yap</button>
    </>
}