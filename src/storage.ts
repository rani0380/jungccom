import {createClient} from '@supabase/supabase-js';
export type RecordData={answer:string;notes:string;status:'new'|'review'|'done';updated_at:string};
const url=import.meta.env.VITE_SUPABASE_URL;
const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const cloud=url&&key?createClient(url,key):null;
let dbPromise:Promise<IDBDatabase>|undefined;
function db(){return dbPromise??=new Promise((resolve,reject)=>{const req=indexedDB.open('jungccom-study',1);req.onupgradeneeded=()=>{req.result.createObjectStore('files');req.result.createObjectStore('drafts')};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
export async function localGet<T>(store:string,key:string):Promise<T|undefined>{const database=await db();return new Promise((resolve,reject)=>{const req=database.transaction(store).objectStore(store).get(key);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
export async function localPut(store:string,key:string,value:unknown){const database=await db();return new Promise<void>((resolve,reject)=>{const tx=database.transaction(store,'readwrite');tx.objectStore(store).put(value,key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}
export async function getRecord(userId:string,key:string){
 const draft=await localGet<RecordData>('drafts',userId+':'+key);
 if(!cloud||userId==='guest')return {record:draft,offline:false};
 const {data,error}=await cloud.from('study_records').select('answer,notes,status,updated_at').eq('user_id',userId).eq('record_key',key).maybeSingle();
 if(error)return {record:draft,offline:true};
 return {record:draft&&(!data||draft.updated_at>data.updated_at)?draft:data as RecordData|undefined,offline:false};
}
export async function saveRecord(userId:string,key:string,record:RecordData){
 await localPut('drafts',userId+':'+key,record);
 if(!cloud||userId==='guest')return false;
 const {error}=await cloud.from('study_records').upsert({user_id:userId,record_key:key,...record},{onConflict:'user_id,record_key'});
 if(error)throw error;return true;
}
