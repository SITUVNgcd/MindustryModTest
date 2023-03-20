Events.on(ClientLoadEvent, ()=>{
  try{
    //Core.camera.position.y = 100;
  }catch(e){
    Log.err("announcelist: " + e);
    //global.log.err(e);
  }
}