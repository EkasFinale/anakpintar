(function(B){
  let state={supported:!!navigator.storage,persistSupported:!!navigator.storage?.persist,persisted:false,requested:false,error:''};
  async function init(){
    if(!navigator.storage)return state;
    try{if(navigator.storage.persisted)state.persisted=await navigator.storage.persisted();if(!state.persisted&&navigator.storage.persist){state.requested=true;state.persisted=await navigator.storage.persist()}return state}catch(e){state.error=String(e?.message||e);return state}
  }
  async function request(){return init()}
  function summary(){if(!state.supported)return 'Browser ini tidak menyediakan status penyimpanan permanen.';if(state.persisted)return 'Penyimpanan permanen aktif: browser diminta untuk tidak mudah menghapus data lokal.';if(state.persistSupported)return 'Penyimpanan permanen belum diberikan browser. Cadangkan data secara berkala.';return 'Penyimpanan permanen tidak didukung. Cadangkan data secara berkala.'}
  B.Storage={init,request,summary,state:()=>({...state})};
  init();
})(BD);
