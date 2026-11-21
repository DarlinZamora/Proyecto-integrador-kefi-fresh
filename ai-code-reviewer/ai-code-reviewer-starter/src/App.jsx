
import React from 'react';

import {useState} from 'react';
import {reviewCode} from './review.js';
export default function App(){
 const [code,setCode]=useState('const users = data.map(user => <p>{user.name}</p>);');
 const [issues,setIssues]=useState([]),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function analyze(){setBusy(true);setError('');setIssues([]);try{const result=await reviewCode(code);setIssues(result.issues)}catch(e){setError(e.message)}finally{setBusy(false)}}
 return <main><header><small>AI Integration & Cloud Deployment</small><h1>AI Code Reviewer</h1><p>Analiza fragmentos JS/JSX. Las sugerencias de IA requieren revisión humana.</p></header><label htmlFor="code">Código para revisar</label><textarea id="code" value={code} onChange={e=>setCode(e.target.value)} rows="9"/><button disabled={busy || !code.trim()} onClick={analyze}>{busy?'Analizando…':'Analizar código'}</button>{error&&<p role="alert" className="error">{error}</p>}<section aria-live="polite"><h2>Hallazgos ({issues.length})</h2>{issues.map((x,i)=><article key={i}><span className="severity">{x.severity}</span><h3>{x.title}</h3><p>{x.explanation}</p>{x.suggestion&&<p><strong>Sugerencia:</strong> {x.suggestion}</p>}</article>)}</section><footer>Versión 1.0 · {import.meta.env.VITE_REVIEW_API_URL?'Servicio HTTPS configurado':'Modo simulador'}</footer></main>
}
