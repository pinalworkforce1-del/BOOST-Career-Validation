(function(){
'use strict';
if(window===window.top)return;
const allowed=new Set(['https://pinal.boostpathways.org','https://pinalworkforce1-del.github.io']);
const key='pinal_boost_career_exploration_v1';
function request(){window.parent.postMessage({type:'pinal-boost-module-restore-request',module:'module2'},'*')}
window.addEventListener('message',function(e){
 if(e.source!==window.parent||!allowed.has(e.origin)||e.data?.type!=='pinal-boost-module2-collect')return;
 try{
   const stored=JSON.parse(localStorage.getItem(key)||'{}')||{};
   const module2=stored.module2||{};
   const answers=typeof collect==='function'?collect():module2.validationBySoc||{};
   window.parent.postMessage({type:'pinal-boost-module2-current',requestId:String(e.data.requestId||''),module2:{
     validationBySoc:answers,
     intelligenceVersion:module2.intelligenceVersion||'QI-v1/BLS-baseline-v1',
     wageBaseline:module2.wageBaseline||null,
     currentHourlyWage:module2.currentHourlyWage||module2.wageBaseline?.hourly||null,
     completedAt:module2.completedAt||null
   }},e.origin);
 }catch(err){console.warn('Module 2 evidence collection failed',err)}
});
window.addEventListener('message',function(e){
 if(e.source!==window.parent||!allowed.has(e.origin)||e.data?.type!=='pinal-boost-module-restore'||e.data.module!=='module2')return;
 const payload=e.data.state;if(!payload||!Array.isArray(payload.module1?.selected)||!payload.module1.selected.length)return;
 try{
  const prior=JSON.parse(localStorage.getItem(key)||'{}')||{};
  // Preserve unsaved or newly completed local validation while the cloud lacks Module 2.
  const locallyCompleted=!!prior.module2?.completedAt&&Object.keys(prior.module2?.validationBySoc||{}).length>0;
  const cloudHasValidation=Object.keys(payload.module2?.validationBySoc||{}).length>0;
  if(locallyCompleted&&!cloudHasValidation){
    window.dispatchEvent(new CustomEvent('pinal-boost-module2-local-recovery',{detail:{ready:true}}));
    return;
  }
  const next={...prior,module1:{...(prior.module1||{}),...payload.module1},
    module2:{...(prior.module2||{}),...(payload.module2||{})},
    module3:{...(prior.module3||{}),...(payload.module3||{})},
    module4:{...(prior.module4||{}),...(payload.module4||{})}};
  const signature=JSON.stringify([next.module1,next.module2,next.module3,next.module4]);
  const marker='boost_parent_hydration_module2';
  if(sessionStorage.getItem(marker)===signature)return;
  localStorage.setItem(key,JSON.stringify(next));
  sessionStorage.setItem(marker,signature);
  location.reload();
 }catch(err){console.warn('BOOST module state restore unavailable',err)}
});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',request,{once:true});else request();
})();