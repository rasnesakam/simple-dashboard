import config from "./auth-service.config"
export async function fetchUserToken(grant: string){
    return await fetch(config.SERVICE_URL.concat("/api/auth/token").concat("?grant=" + grant)).then(res => res.json());
}