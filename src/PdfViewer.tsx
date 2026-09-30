import {useEffect,useRef,useState} from 'react';
import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {Button} from '@/components/ui/button';
import {localGet,localPut} from './storage';
pdfjs.GlobalWorkerOptions.workerSrc=workerUrl;
type Props={fileKey:string;name:string;page:number;version:number;onImport:()=>void};
export default function PdfViewer({fileKey,name,page,version,onImport}:Props){
 const canvas=useRef<HTMLCanvasElement>(null);const input=useRef<HTMLInputElement>(null);
 const [error,setError]=useState('');const [missing,setMissing]=useState(false);const [busy,setBusy]=useState(true);const [zoom,setZoom]=useState(false);const [fileName,setFileName]=useState('');
 useEffect(()=>{let alive=true;let task:any;let render:any;setBusy(true);setMissing(false);setError('');setFileName('');
 (async()=>{const file=await localGet<File>('files',fileKey);if(!alive)return;if(!file){setMissing(true);setBusy(false);return}setFileName(file.name);task=pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false});const doc=await task.promise;if(!alive)return;if(page>doc.numPages)throw new Error(`선택한 PDF는 ${doc.numPages}쪽입니다. 안내된 파일을 선택해 주세요.`);const p=await doc.getPage(page);if(!alive||!canvas.current)return;const viewport=p.getViewport({scale:1.7});const c=canvas.current;c.width=viewport.width;c.height=viewport.height;render=p.render({canvas:c,viewport});await render.promise;if(alive)setBusy(false)})().catch(e=>{if(alive&&e.name!=='RenderingCancelledException'){setError(e.message||'PDF를 열지 못했어요.');setBusy(false)}});
 return()=>{alive=false;render?.cancel();task?.destroy()};},[fileKey,page,version]);
 async function select(file?:File){if(!file)return;if(!file.name.toLowerCase().endsWith('.pdf')){setError('PDF 파일을 선택해 주세요.');return}try{await localPut('files',fileKey,file);onImport()}catch{setError('이 기기에 PDF를 보관하지 못했어요. 브라우저 저장 공간을 확인해 주세요.')}}
 return <div className="pdf-view"><input ref={input} type="file" accept="application/pdf,.pdf" className="sr-only" aria-label="PDF 선택" onChange={e=>{select(e.target.files?.[0]);e.target.value=''}}/>{missing?<div className="pdf-empty"><div className="book-icon">PDF</div><h3>이 기기에서 교재를 열어주세요</h3><p>{name}</p><Button onClick={()=>input.current?.click()}>PDF 선택하기</Button><p className="muted">파일은 이 브라우저에만 보관되며 서버로 전송되지 않아요.<br/>다른 기기에서도 같은 PDF를 한 번 선택해 주세요.</p></div>:<><div className="pdf-actions"><span title={fileName}>원본 {page}쪽</span><Button variant="ghost" onClick={()=>setZoom(!zoom)}>{zoom?'화면에 맞추기':'크게 보기'}</Button><Button variant="ghost" onClick={()=>input.current?.click()}>파일 변경</Button></div>{busy&&<p className="loading" role="status">문제지를 여는 중…</p>}<div className={'canvas-scroll '+(zoom?'zoomed':'')}><canvas ref={canvas} aria-label={`${name} ${page}쪽`} hidden={busy||!!error}/></div></>}{error&&<div className="error-box" role="alert">{error}<Button variant="outline" onClick={()=>input.current?.click()}>PDF 다시 선택</Button></div>}</div>
}
