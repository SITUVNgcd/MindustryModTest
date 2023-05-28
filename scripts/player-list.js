try{
  global.svn.players = {};
  const aau = global.svn.util.addAllUnique;
  const el = new global.svn.evt.EventListener(), pj = "playerJoin", pb = "playerBack", pl = "playerLeave";
  const plg = Groups.player;
  let pla = new Seq(), pls = new Seq(), pln = new Seq(), plr = new Seq(), plb = new Seq(), tmp = new Seq();
  let i, p;
  Events.run(Trigger.update, ()=>{
    if(!Vars.net.active()) return;
    try{
      if(pls.size != plg.size() || pls.size != 0 && pls.get(pls.size - 1) != plg.index(plg.size() - 1)){
        plr.clear();
        plr.addAll(pls);
        pln.clear();
        plg.copy(pln);
        plr.removeAll(pln);
        pln.removeAll(pls);
        if(pln.size > 0){
          pls.addAll(pln);
          plb.clear();
          plb.addAll(pln);
          pln.removeAll(pla);
          plb.removeAll(pln);
          if(pln.size > 0){
            pla.addAll(pln);
            el.dispatch(pj, global.svn.players, pln);
          }
          if(plb.size > 0){
            el.dispatch(pb, global.svn.players, plb);
          }
        }
        if(plr.size > 0){
          pls.removeAll(plr);
          el.dispatch(pr, global.svn.players, plr);
        }
      }
    }catch(e){
      Log.err("players update: " + e);
    }
  });
  Events.on(WorldLoadEvent, ()=>{
    pla.clear();
    plg.copy(pla);
    pls.clear();
    plg.copy(pls);
    pln.clear();
    plb.clear();
    plr.clear();
  });
  
  const playerJoin = function(f){
    return el.add(pj, f);
  }
  const playerBack = function(f){
    return el.add(pb, f);
  }
  const playerLeave = function(f){
    return el.add(pl, f);
  }
  const playerJoinRemove = function(f){
    return el.remove(pj, f);
  }
  const playerBackRemove = function(f){
    return el.remove(pb, f);
  }
  const playerLeaveRemove = function(f){
    return el.remove(pl, f);
  }
  const clearEvt = function(){
    return el.clear.apply(el, arguments);
  }
  global.svn.players.all = pla;
  global.svn.players.cur = pls;
  global.svn.players.playerJoin = playerJoin;
  global.svn.players.playerBack = playerBack;
  global.svn.players.playerLeave = playerLeave;;
  global.svn.players.playerJoinRemove = playerJoinRemove;
  global.svn.players.playerBackRemove = playerBackRemove;
  global.svn.players.playerLeaveRemove = playerLeaveRemove;
  global.svn.players.clearEvt = clearEvt;
  
}catch(e){
  Log.err(module.id + ": " + e);
}