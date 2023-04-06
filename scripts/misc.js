Events.on(ClientLoadEvent, ()=>{
  try{
    let st = Core.settings;
    let hf = Vars.ui.hudfrag;
    let [hg, fe] = [Vars.ui.hudGroup, "find(arc.func.Boolf)"];
    let cid = hg[fe](e=>{
      return e instanceof Collapser && e[fe](f=>f instanceof CoreItemsDisplay) != null;
    });
    let boss = hg.find("boss");
    
    
    cid.setCollapsed(()=> !(hf.shown && st.getBool("svn-force-show-item-info") || st.getBool("coreitems") || (Vars.mobile && !Core.graphics.isPortrait())) );
    let bv = boss.visibility;
    boss.visibility=()=>hf.shown && (st.getBool("svn-force-show-boss-info") || bv.get());
    
    Vars.renderer.minZoom=0.2;
    Vars.renderer.maxZoom=20;
  }catch(e){
    Log.err("misc: " + e);
  }
});