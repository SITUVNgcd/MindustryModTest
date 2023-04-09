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
    cid.touchable = Touchable.disabled
    let bv = boss.visibility;
    boss.touchable = Touchable.disabled;
    boss.visibility=()=>hf.shown && (st.getBool("svn-force-show-boss-info") || Vars.state.teams.bosses.size != 0 || bv.get());
    
    Vars.renderer.minZoom = st.getInt("svn-min-zoom", 2) / 10;
    Vars.renderer.maxZoom = st.getInt("svn-max-zoom", 15);
  }catch(e){
    Log.err("misc: " + e);
  }
  
});