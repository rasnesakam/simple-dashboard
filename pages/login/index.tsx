import {useAppDispatch} from "src/redux/Store";
import {ChangeEvent, useEffect, useState} from "react";
import {login, Profile} from "src/redux/slices/Profile";
import jwtDecode from "jwt-decode";
import {useSearchParams} from "next/navigation";
import {fetchUserToken} from "src/auth-service/fetchUserToken";


interface Token {
    sub: string,
    expr: number,
    name: string,
    iat: number,
}

export default function Login(){
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const [formDatas, setFormDatas] = useState({userName: "", password: ""});
    const {userName, password} = formDatas;
    const [page, setPage] = useState({
        errorMessage: "",
        passwordType: "password"
    })

    const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormDatas({...formDatas, [name]:value});
    }

    const loginHandler = async () => {
        await fetch("http://localhost:8080/api/auth/sign-in/",{
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

    const checkHasGrant = () => {
        let grant = searchParams.get("grant");
        return grant !== null;
    }

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(location.search)
        if (urlSearchParams.has("grant")){
            let grant = urlSearchParams.get("grant");
            console.log("getting grant")
            fetchUserToken(grant!).then(response => {
                console.log(response)
                let profile: Profile = {
                    id: "",
                    username: response.content.username,
                    token: response.content.token,
                    isAuthenticated: true,
                    isPending: false,
                    error: null
                }
                dispatch(login(profile)).then(_ => {
                    location.replace("/")
                })
            })
        }
    }, [])

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
                <a className="m-2 p-3 hover:bg-gray-500 hover:rounded-md"
                   href="http://localhost:8080/page/login?audience=emakas&scope=&returnUrl=http://localhost:3000/login"> Yeni Yöntem İle Giriş Yap</a>
            </div>
            { checkHasGrant() ? <>
                <div
                    className="absolute top-4 flex flex-row items-center gap-4 right-4 bg-white px-5 py-5 text-black rounded-lg">
                <span>
                    <svg aria-hidden="true" className="w-8 h-8 animate-spin text-white fill-blue-600"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"/>
                    </svg>
                </span>
                    <span>
                    Giriş Yapılıyor
                </span>
                </div>
            </> : <></>}
        </div>
    </>
}