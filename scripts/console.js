try{
  global.svn.con = {};
  let lt = ["exec", "return", "error", "warn", "info"];
  let line = function(s, r, c){
    if(s == undefined){
      s = "undefined";
    }else if(s == null){
      s = "null";
    }else{
      s = s.toString();
    }
    if(typeof r == "string"){
      for(let i in lt){
        if(lt[i] == r){
          r = i;
        }
      }
    }
    if(typeof r == "boolean"){
      r = r ? 1 : 0;
    }
    if(typeof r != "number"){
      r = 4;
    }
    if(typeof c != "boolean" && typeof c != "number"){
      c = false;
    }
    c = !!c;
    let tbl = new Table();
    let h = (r == 0 ? "[#4488ff]> []" : r == 1 ? "[accent]< []" : r == 2 ? "[red]" : r == 3 ? "[#ff8800]" : "");
    h += c ? s : s.replace(/\[/gi, "[[");
    
    tbl.add(h).top().left().wrap().padLeft(6).growX();
    tbl.button(Icon.copy, 24, ()=>{
      Core.app.setClipboardText(s);
    }).top().padLeft(6).padRight(6);
    tbl.pack();
    return tbl;
  }
  let running = false;
  let runScript = function(s){
    let r, err;
    try{
      let script = Vars.mods.getScripts();
      let ctx = script.context, scp = script.scope;
      try{
        if(Core.settings.getBool("svn-console-use-runConsole")){
          r = script.runConsole(s);
        }else{
          r = ctx.evaluateString(scp, s, "situvn-console.js", 1);
          r = global.svn.util.toJson(r, 0, 2, 0);
        }
      }catch(e){
        Log.err("console eval: " + global.svn.util.toJson(e));
        err = (err || "") + JSON.stringify(e) + "\n";
      }
    }catch(e){
      Log.err("console stringify: " + global.svn.util.toJson(e));
      err = (err || "") + global.svn.util.toJson(e) + "\n";
    }
    return {res: r, err: err};
  }
  
  Events.on(ClientLoadEvent, () => {
    try{
      let hg = Vars.ui.hudGroup;
      hg["fill(arc.func.Cons)"](t=>{
        t.touchable = Touchable.childrenOnly;
        t.top().right();
        t.name = "svn-console";
        let tbl = t.table(Styles.black3, tbl=>{
          let inp;
          let his = [];
          let hisPos = 0;
          let info, bot, scr, idx;
          his.push("");
          info = new Table().top().left();
          info.touchable = Touchable.childrenOnly;
          
          
          const conlog = function(s, c){
            if(arguments.length == 0){
              return;
            }
            if(s == undefined){
              s = "undefined";
            }else if(s == null){
              s = "null";
            }
            if(typeof s != "string"){
              s = s.toString();
            }
            if(arguments.length < 2){
              c = true;
            }
            info.add(line(s, 4, c)).top().left().growX();
            info.row();
          }
          global.svn.con.log = conlog;
          
          bot = tbl.table().growX().bottom().get();
          tbl.row();
          scr = tbl.pane(info).top().left().grow();
          let pan = scr.get();
          bot.button(Icon.up, 24, ()=>{
            if(hisPos > 0){
              --hisPos;
            }
            inp.setText(his[hisPos]);
          }).top().padLeft(6);
          bot.button(Icon.down, 24, ()=>{
            if(hisPos < his.length - 1){
              ++hisPos;
            }
            inp.setText(his[hisPos]);
          }).top().padLeft(6);
          inp = bot.area("", (s)=>{
            
          }).growX().top().padLeft(6).height(50).get();
          bot.button(Icon.right, 24, ()=>{
            let s = inp.getText();
            if(s == ""){
              return;
            }
            inp.clearText();
            idx = his.indexOf(s);
            if(idx >= 0){
              his.splice(idx, 1);
            }
            hisPos = his.length;
            his[hisPos - 1] = s;
            his.push("");
            if(s == ":credit" || s == ":cre"){
              
            }else if(s == ":clear" || s == ":cls"){
              info.clearChildren();
              info.pack();
            }else{
              pan.pack();
              let sy = info.height;
              info.add(line(s, false)).top().left().growX();
              info.row();
              let r = runScript(s);
              if(r.err && r.err != ""){
                info.add(line(r.err, 2)).top().left().growX();
                info.row();
              }
              info.add(line(r.res, true)).top().left().growX();
              info.row();
              info.pack();
              pan.pack();
              Core.app.post(()=>{
                pan.setScrollY(sy);
              });
            }
          }).top().padLeft(6).padRight(6);
          
          tbl.top().right();
          tbl.setWidth(400);
          tbl.setHeight(600);
          tbl.toFront();
          tbl.visibility = ()=>Vars.ui.hudfrag.shown && Core.settings.getBool("svn-console");
        }).top().right().width(400).height(600);
        let dy = 0;
        let mp = hg.find("minimap");
        if(mp){
          mp.pack();
          dy += mp.height;
        }
        mp = hg.find("position");
        if(mp){
          mp.pack();
          dy += mp.height;
        }
        tbl.padTop(Scl.scl(dy));
      });/*
      let sss = `function list(o,f){ let r="",p,n,ns;if(o instanceof java.lang.Object){ns=[];for(let i in o){ns.push(i);}}else{ns=Object.getOwnPropertyNames(o);}for(let i of ns){p=o[i];n=typeof(p);try{if(p instanceof java.lang.Object){n=p.getClass().getName();}}catch(e){}r+=i+" ("+n+")\\n"; if(typeof(f)=="function"){f(p,i,o);}}return r;}`;
      runScript(sss);*/
    }catch(e){
      Log.err("console: " + e);
    }
  });
}catch(e){
  Log.err(module.id + ": " + e);
}