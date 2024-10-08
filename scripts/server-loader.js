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
  global.svn.evt.load(()=>{
    let loaded = false;
    let t = new Thread(()=>{
      Thread.sleep(1000); // Wait for defaultServers load.
      let n = 5;
      while(n-- && !loaded){
        getServers(0, v=>{
          if(v) loaded = true;
        });
        Thread.sleep(10000);
      }
    }, "getServers");
    t.setDaemon(true);
    t.start();
    
    const join = Vars.ui.join, tit = join.titleTable, con = join.cont, but = join.buttons;
    // Remove overlay button state
    join.clearChildren();
    join.add(tit).growX().row();
    join.add(con).expand().fill().row();
    join.add(but).fillX();
    
    const inBut = !Vars.steam && !Vars.mobile;
    const manDlg = new BaseDialog("@svn.manage"), manCon = manDlg.cont;
    manDlg.addCloseButton();
    const remSer = global.svn.util.field(join, "servers").val;
    const makeServers = function(data){
      let res = new Seq();
      if(!data || typeof data !== "string" || data.length == 0){
        return res;
      }
      let tmp;
      data = data.split(/\s*\r*\n\s*/gi);
      data.forEach(d=>{
        if(d){
          tmp = new JoinDialog.Server();
          global.svn.util.call(tmp, "setIP", d);
          res.add(tmp);
        }
      });
      return res;
    }
    manCon.button("@svn.join.remote.import", ()=>{
      Vars.ui.showConfirm("@warning", "@svn.join.remote.import.confirm", ()=>{
        let data = Core.app.getClipboardText();
        remSer.clear();
        remSer.add(makeServers(data));
        Core.app.post(()=>{
          global.svn.util.call(join, "setupRemote");
          global.svn.util.call(join, "refreshRemote");
        });
      });
    }).expandX().minWidth(200);
    manCon.row();
    manCon.button("@svn.join.remote.add", ()=>{
      let data = Core.app.getClipboardText();
      let sers = makeServers(data);
      let tmp;
      sers.each(sa=>{
        tmp = remSer["contains(arc.func.Boolf)"](sb=>{
          return global.svn.util.call(sa, "displayIP").val.toString() == global.svn.util.call(sb, "displayIP").val.toString();
        });
        if(!tmp){
          remSer.add(sa);
        }
      });
      Core.app.post(()=>{
        global.svn.util.call(join, "setupRemote");
        global.svn.util.call(join, "refreshRemote");
      });
    }).expandX().minWidth(200);
    manCon.row();
    manCon.button("@svn.join.remote.copy", ()=>{
      let str = "";
      remSer.each(s=>{
        str += global.svn.util.call(s, "displayIP").val.toString() + "\n";
      });
      Core.app.setClipboardText(str);
    }).expandX().minWidth(200);
    manCon.row();
    manCon.button("@svn.join.remote.save", ()=>{
      global.svn.util.call(join, "saveServers");
    }).expandX().minWidth(200);
    
    but.row();
    if(inBut) but.add();
    but.add();
    const re = but.button("@hosts.refresh", Icon.refresh, ()=>{
      re.setDisabled(true);
      getServers(()=>{
        global.svn.util.call(join, "refreshAll");
        re.setDisabled(false);
      });
    }).get();
    const man = but.button("@svn.manage", Icon.list, ()=>{
      manDlg.show();
    });
    but.add();
    if(inBut) but.add();
    
  });
}catch(e){
  Log.err(module.id + ": " + e);
}