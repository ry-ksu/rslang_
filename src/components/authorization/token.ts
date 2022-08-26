import { IUserToken } from "../types/types";
import { ITocen } from "./contrats";

function getLocalStoreUser(){
  const user = localStorage.getItem('user') ??  '{}';
  return JSON.parse(user) as IUserToken;
}

function parsePart<T>(str: string): T {
  return JSON.parse(window.atob(str)) as T;
}

function parseJWT(token: string) {
  const parts = token.split('.');
  return {
    header: parsePart(parts[0]),
    payload: parsePart(parts[1]),
    sign: parts[2]
  };
}

function getJWTPayload(token: string): ITocen {
  return parseJWT(token).payload as ITocen; 
}

export { getLocalStoreUser, getJWTPayload }