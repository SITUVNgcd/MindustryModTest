let st = Core.settings;
let tc;

Events.on(ClientLoadEvent, ()=>{
  try{
    Vars.ui.consolefrag.visibility=()=>(Vars.ui.minimapfrag.shown() || Vars.state.isMenu()) && st.getBool("svn-system-log");
    
    let dis = Touchable.disabled;
    let hf = Vars.ui.hudfrag;
    let [hg, fe] = [Vars.ui.hudGroup, "find(arc.func.Boolf)"];
    
    let ci = hg.find("coreinfo");
    global.svn.util.setTouchable(ci, dis);
    
    let cid = ci[fe](e=>{
      return e instanceof Collapser && e[fe](f=>f instanceof CoreItemsDisplay) != null;
    });
    cid.setCollapsed(()=> !(hf.shown && st.getBool("svn-force-show-item-info") || st.getBool("coreitems") || (Vars.mobile && !Core.graphics.isPortrait())) );
    
    let boss = ci.find("boss");
    const bv = boss.visibility;
    boss.visibility=()=>hf.shown && (st.getBool("svn-force-show-boss-info") || Vars.state.teams.bosses.size != 0 || bv.get());
    
    let tc = new global.svn.timeCtrl.TimeCtrl();
    let tct = tc.run();
    tct.setPosition(0, 120);
    const tctv = tct.visibility;
    tct.visibility = ()=> hf.shown && Core.settings.getBool("svn-time-control") && tctv.get();
    hg.addChild(tct);
  }catch(e){
    Log.err("misc: " + e);
  }
  
});

global.svn.misc = {};
Vars.renderer.minZoom = st.getInt("svn-min-zoom", 2) / 10;
Vars.renderer.maxZoom = st.getInt("svn-max-zoom", 15);
Vars.maxSchematicSize = 256;
