import type { RequestEvent } from "../routes/api/weather/$types";
import { env } from "$env/dynamic/private";

type Permission = 'logs_r' | 'logs_w' | 'wx' | 'admin';

interface UserInfo {
    token: string,
    name: string,
    logs_r: number,
    logs_w: number,
    wx: number,
    admin: number
}

interface RequestAuthorizationState {
    request: {
        __userinfo?: UserInfo;
    }
}

export async function retrieve_userinfo(token: string): Promise<UserInfo | null> {
    const stmt = env.DB.prepare('SELECT * FROM users WHERE token = ?').bind(token);

    const userinfo = await stmt.first();

    if (!userinfo)
        return null;

    return userinfo;
}

export async function authorized({ cookies, request }: RequestEvent & RequestAuthorizationState, priv: Permission): Promise<boolean> {
    const token = cookies.get('compakt_token');

    if (!token)
        return false;

    const userinfo = await retrieve_userinfo(token);

    if (!userinfo)
        return false;

    request.__userinfo = userinfo;

    return userinfo[priv] === 1;
}