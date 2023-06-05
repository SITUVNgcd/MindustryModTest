try{
  global.svn.players = {};
  const aau = global.svn.util.addAllUnique;
  const el = new global.svn.evt.EventListener(), sj = {}, pn = {}, pb = {}, pl = {};
  const plg = Groups.player;
  const pla = new Seq(), pls = new Seq(), pln = new Seq(), pll = new Seq(), plb = new Seq(), tmp = new Seq();
  let up = true;
  let i, p;
  Events.run(Trigger.update, ()=>{
    if(!Vars.state.isGame() || !Vars.net.active()) return;
    try{
      if(pls.size != plg.size() || pls.size != 0 && pls.get(pls.size - 1) != plg.index(plg.size() - 1)){
        pll.clear();
        pll.addAll(pls);
        pln.clear();
        plg.copy(pln);
        pll.removeAll(pln);
        pln.removeAll(pls);
        if(pln.size > 0){
          pls.addAll(pln);
          plb.clear();
          plb.addAll(pln);
          pln.removeAll(pla);
          plb.removeAll(pln);
          if(pln.size > 0){
            pla.addAll(pln);
            el.dispatch(pn, global.svn.players, pln);
          }
          if(plb.size > 0){
            Log.info(plb.toString());
            el.dispatch(pb, global.svn.players, plb);
          }
        }
        if(pll.size > 0){
          pls.removeAll(pll);
          el.dispatch(pl, global.svn.players, pll);
        }
      }
    }catch(e){
      Log.err("players update: " + e);
    }
  });
  Events.on(WorldLoadEndEvent, ()=>{
    pla.clear();
    plg.copy(pla);
    pls.clear();
    plg.copy(pls);
    pln.clear();
    plb.clear();
    pll.clear();
    el.dispatch(sj, global.svn.players);
  });
  
  const selfJoin = function(f){
    return el.add(sj, f);
  }
  const playerJoin = function(f){
    return el.add(pn, f);
  }
  const playerBack = function(f){
    return el.add(pb, f);
  }
  const playerLeave = function(f){
    return el.add(pl, f);
  }
  const selfJoinRemove= function(f){
    return el.remove(sj, f);
  }
  const playerJoinRemove = function(f){
    return el.remove(pn, f);
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
  global.svn.players.selfJoin = selfJoin;
  global.svn.players.playerJoin = playerJoin;
  global.svn.players.playerBack = playerBack;
  global.svn.players.playerLeave = playerLeave;
  global.svn.players.selfJoinRemove = selfJoinRemove;
  global.svn.players.playerJoinRemove = playerJoinRemove;
  global.svn.players.playerBackRemove = playerBackRemove;
  global.svn.players.playerLeaveRemove = playerLeaveRemove;
  global.svn.players.clearEvt = clearEvt;
  
}catch(e){
  Log.err(module.id + ": " + e);
}