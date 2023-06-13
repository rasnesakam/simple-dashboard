import {useAppDispatch} from "src/redux/Store";
import {ChangeEvent, useState} from "react";
import {login, Profile} from "src/redux/slices/Profile";
import jwtDecode from "jwt-decode";

interface Token {
    sub: string,
    expr: number,
    name: string,
    iat: number,
}

export default function Login(){
    const dispatch = useAppDispatch();
    const [formDatas, setFormDatas] = useState({userName: "", password: ""});
    const [page, setPage] = useState({
        errorMessage: "",
        passwordType: "password"
    })
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
                    return response.json();
                if (response.status === 404)
                    setPage({...page, errorMessage:"Kullanıcı bulunamadı"});
                if (response.status === 401)
                    setPage({...page, errorMessage:"Kullanıcı girişi başarısız."});
                throw new Error(response.statusText);
            })
            .then(data => {
                console.log(data);
                let jwt = jwtDecode<Token>(data.token);
                let profile: Profile = {
                    id: jwt.sub,
                    username: formDatas.userName,
                    isAuthenticated: true,
                    token: data.token,
                    isPending: false,
                    error: ""
                }
                dispatch(login(profile))
            })
            .catch(err => {console.log(err)})
    }
    return <>
        <div className="h-screen flex flex-col justify-center items-center">
            <div className="border shadow border-gray-500 rounded-sm flex flex-col justify-center items-center py-2 w-9/12">
                <span className="text-3xl mb-4">Simple Dashboard</span>
                <span className="text-red-500">{page.errorMessage}</span>
                <input name="userName" className="p-2 m-2" value={userName} placeholder="Kullanıcı Adı"
                       onChange={onChangeInput}/>
                <input name="password" type={page.passwordType} className="p-2 m-2" value={password} placeholder="Şifre"
                       onChange={onChangeInput}/>
                <div>
                    <input type="checkbox" id="pwd-checkbox" className="mx-2" onChange={e => setPage({...page, passwordType: (page.passwordType === "password") ? "text" : "password"})}/>
                    <label htmlFor="pwd-checkbox">Şifreyi göster / gizle</label>
                </div>
                <button className="m-2 p-3 hover:bg-gray-500 hover:rounded-md" type="button" onClick={loginHandler}>Giriş Yap</button>
            </div>
        </div>
    </>
}