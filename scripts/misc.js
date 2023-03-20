Events.on(ClientLoadEvent, ()=>{
  try{
    let settings = Core.settings;
    
    let [hg, fe] = [Vars.ui.hudGroup, "find(arc.func.Boolf)"];
    let cid = hg[fe](e=>{
      return e instanceof Collapser && e[fe](f=>f instanceof CoreItemsDisplay) != null;
    });
    let boss = hg.find("boss");
    
    cid.setCollapsed(()=>!Vars.ui.hudfrag.shown || !settings.getBool("svn-force-show-item-info"));
    boss.visibility=()=>Vars.ui.hudfrag.shown && settings.getBool("svn-force-show-boss-info");
    Vars.renderer.minZoom=0.3;
    Vars.renderer.maxZoom=15
  }catch(e){
    Log.info(e);
  }
});