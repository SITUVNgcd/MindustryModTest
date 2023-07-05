try{
  const sv7SVN = "https://raw.githubusercontent.com/SITUVNgcd/MindustryModTest/master/servers_v7.json";
  let loaded = false;
  const getServers = function(){
    Http.get(sv7SVN).error(e=>{
      Log.err("Error while loading " + sv7SVN + "\n" + e);
    }).submit(r=>{
      const rs = r.getResultAsString();
      try{
        const sers = JSON.parse(rs);
        Core.app.post(()=>{
          global.svn.util.updateServer(sers);
        });
        Log.info("Server loaded!");
        loaded = true;
      }catch(e){
        Log.err("Error while parsing result\n" + e);
      }
    });
  }
  Events.on(ClientLoadEvent, ()=>{
    let t = new Thread(()=>{
      let n = 5;
      while(n && !loaded){
        getServers()
        --n;
        Thread.sleep(10000);
      }
    }, "getServers");
    t.setDaemon(true);
    t.start();
  });
}catch(e){
  Log.err(module.id + ": " + e);
}