Events.on(ClientLoadEvent, ()=>{
  try{
    let it = Vars.ui.hudGroup.find("infotable");
    
    let yt = Core.scene.height - it.localToStageCoordinates(new Vec2(0,0)).y;
  }catch(e){
    Log.err("announcelist: " + e);
    //global.log.err(e);
  }
}