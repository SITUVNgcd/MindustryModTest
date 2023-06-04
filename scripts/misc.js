try{
  global.svn.misc = {};
  let st = Core.settings;
  Vars.renderer.minZoom = st.getInt("svn-min-zoom", 2) / 10;
  Vars.renderer.maxZoom = st.getInt("svn-max-zoom", 15);
  Vars.maxSchematicSize = 256;
  let i, tmp, tmp2, tmp3;
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
      (function(){
        let conU = Vars.content.units();
        let tmpU;
        let pays = [];
        for(i = 0; i < conU.size; ++i){
          tmpU = conU.get(i);
          if(tmpU.sample instanceof Payloadc){
            pays.push({type: tmpU, cap: tmpU.payloadCapacity});
          }
        }
        let unlimit = function(){
          for(i of pays){
            i.type.payloadCapacity = Infinity;
          }
        }
        let limit = function(){
          for(i of pays){
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
      })();
      // Greeting
      (function(){
        const [pls, scm] = [global.svn.players, global.svn.util.sendChatMessage];
        
        let wait = false, t;
        pls.selfJoin(function(){
          wait = true;
          t = new Thread(()=>{
            Thread.sleep(3000);
            wait = false;
          }, "selfJoinWait");
          t.setDaemon(true);
          t.start();
        });
        
        const evt = function(t, grt){
          return p=>{
            if(wait) return;
            tmp = t + ":";
            for(i = 0; i < p.size; ++i){
              tmp += "\n    " + p.get(i).coloredName();
            }
            Log.info(tmp);
            if(st.getBool("svn-greet-msg")){
              tmp = grt + " ";
              for(i = 0; i < p.size; ++i){
                tmp2 = p.get(i);
                if(tmp2.isLocal()){
                  continue;
                }
                tmp2 = tmp2.coloredName() + "[]";
                tmp3 = i < p.size - 1 ? 4 : 1;
                if(tmp.length + tmp2.length + tmp3 <= Vars.maxTextLength){
                  tmp += tmp2;
                  if(i < p.size - 1){
                    tmp += ", ";
                  }else{
                    tmp += ".";
                  }
                }else{
                  tmp += ",...";
                  break;
                }
              }
              scm(tmp);
            }
          }
        }
        
        const pj = evt("join", "Welcome!");
        const pb = evt("back", "Welcome back!");
        const pl = evt("leave", "Bye and see you again!");
        pls.playerJoin(pj);
        pls.playerBack(pb);
        pls.playerLeave(pl);
      })();
    }catch(e){
      Log.err(module.id + ": " + e);
    }
  });
}catch(e){
  Log.err(module.id + ": " + e);
}