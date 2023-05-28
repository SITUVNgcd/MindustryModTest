try{
  global.svn.misc = {};
  let st = Core.settings;
  Vars.renderer.minZoom = st.getInt("svn-min-zoom", 2) / 10;
  Vars.renderer.maxZoom = st.getInt("svn-max-zoom", 15);
  Vars.maxSchematicSize = 256;
  let tmp;
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
      global.svn.misc.tc = tc;
      
      // Payload
      let conU = Vars.content.units();
      let tmpU;
      let pays = [];
      for(let i = 0; i < conU.size; ++i){
        tmpU = conU.get(i);
        if(tmpU.sample instanceof Payloadc){
          pays.push({type: tmpU, cap: tmpU.payloadCapacity});
        }
      }
      let unlimit = function(){
        for(let i of pays){
          i.type.payloadCapacity = Infinity;
        }
      }
      let limit = function(){
        for(let i of pays){
          i.type.payloadCapacity = i.cap;
        }
      }
      let upc = 0;
      const upcR = ()=>{
        tmp = st.getBool("svn-unlimit-payload-cap");
        if(upc != tmp){
          upc = tmp;
          if(upc){
            unlimit();
          }else{
            limit();
          }
        }
      }
      upcR();
      Events.run(Trigger.update, upcR);
      
      // Greeting
      const [pls, scm] = [global.svn.players, global.svn.util.sendChatMessage];
      const pj = p=>{
        scm("Welcome! " + p.get(0).coloredName());
      }
      const pb = p=>{
        scm("Welcome back! " + p.get(0).coloredName());
      }
      const pl = p=>{
        scm("Bye and see you again! " + p.get(0).coloredName());
      }
      const greet = function(){
        pls.playerJoin(pj);
        pls.playerBack(pb);
        pls.playerLeave(pl);
      }
      const ungreet = function(){
        pls.playerJoinRemove(pj);
        pls.playerBackRemove(pb);
        pls.playerLeaveRemove(pl);
      }
      let grp = 0;
      const grtR = ()=>{
        tmp = st.getBool("svn-greet-msg");
        if(grp != tmp){
          grp = tmp;
          if(grp){
            greet();
          }else{
            ungreet();
          }
        }
      }
      grtR();
      Events.run(Trigger.update, grtR);
    }catch(e){
      Log.err(module.id + ": " + e);
    }
  });
}catch(e){
  Log.err(module.id + ": " + e);
}