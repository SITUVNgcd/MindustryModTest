try{
  global.svn.serverLoader = {};
  const sv7SVN = "https://raw.githubusercontent.com/SITUVNgcd/MindustryModTest/master/servers_v7.json";
  const def = ()=>{};
  const getServers = function(done, ok, err){
    if(typeof done !== "function"){
      done = def;
    }
    if(typeof ok !== "function"){
      ok = done;
    }
    if(typeof err !== "function"){
      err = done;
    }
    Http.get(sv7SVN).error(e=>{
      Log.err("Error while loading " + sv7SVN + "\n" + e);
      err(e);
    }).submit(r=>{
      const rs = r.getResultAsString();
      try{
        const sers = JSON.parse(rs);
        Core.app.post(()=>{
          global.svn.util.updateServer(sers);
          ok(sers);
        });
        Log.info("Server loaded!");
      }catch(e){
        Log.err("Error while parsing result\n" + e);
        err(e);
      }
    });
  }
  global.svn.serverLoader.getServers = getServers;
  Events.on(ClientLoadEvent, ()=>{
    let loaded = false;
    let t = new Thread(()=>{
      Thread.sleep(1000); // Wait for defaultServers load.
      let n = 5;
      while(n-- && !loaded){
        getServers(v=>{
          if(v) loaded = true;
        });
        Thread.sleep(10000);
      }
    }, "getServers");
    t.setDaemon(true);
    t.start();
    
    const join = Vars.ui.join, but = join.buttons;
    const inBut = !Vars.steam && !Vars.mobile;
    but.row();
    if(inBut) but.add();
    but.add();
    const re = but.add("@hosts.refresh", Icon.refresh, ()=>{
      re.setDisabled(true);
      getServers(()=>{
        global.svn.util.call(join, "refreshAll");
        re.setDisabled(false);
      });
    });
    but.add(); // Empty button
    but.add();
    if(inBut) but.add();
  });
}catch(e){
  Log.err(module.id + ": " + e);
}