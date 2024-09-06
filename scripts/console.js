try{
  global.svn.con = {
    err: {}
  };
  let flati, flatt;
  global.svn.evt.load(()=>{
    flati = global.svn.styles.flati;
    flatt = global.svn.styles.flatt;
  });
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
    tbl.button(Icon.copy, flati, ()=>{
      Core.app.setClipboardText(s);
    }).top().padLeft(3).padRight(3).size(50);
    tbl.pack();
    return tbl;
  }
  let running = false;
  let runScript = function(s, rc){
    let r, err;
    try{
      let script = Vars.mods.getScripts();
      let ctx = script.context, scp = script.scope;
      try{
        if(rc){
          r = script.runConsole(s);
        }else{
          r = ctx.evaluateString(scp, s, "situvn-console.js", 1);
        }
      }catch(e){
        global.svn.con.err.lastError = e;
        Log.err("console eval: " + global.svn.util.toJson(e));
        err = (err || "") + JSON.stringify(e) + "\n";
      }
    }catch(e){
      Log.err("console stringify: " + global.svn.util.toJson(e));
      err = (err || "") + global.svn.util.toJson(e) + "\n";
    }
    return {res: r, err: err};
  }
  
  global.svn.evt.load(() => {
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
          
          const CLS = {};
          const cls = ()=>{
            info.clearChildren();
            info.pack();
            return CLS;
          }
          const CLSX = CLS.toString();
          global.svn.con.cls = cls;
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
            let sy = info.height;
            info.add(line(s, 4, c)).top().left().growX();
            info.row();
            Core.app.post(()=>{
              pan.setScrollY(sy);
            });
          }
          global.svn.con.log = conlog;
          
          inp = new TextArea("");
          bot = tbl.table().growX().bottom().get();
          tbl.row();
          scr = tbl.pane(info).top().left().grow();
          let pan = scr.get();
          bot.button(Icon.upOpen, flati, ()=>{
            if(hisPos > 0){
              --hisPos;
            }
            inp.setText(his[hisPos]);
          }).top().size(50);
          bot.button(Icon.downOpen, flati, ()=>{
            if(hisPos < his.length - 1){
              ++hisPos;
            }
            inp.setText(his[hisPos]);
          }).top().size(50);
          bot.button(Icon.paste, flati, ()=>{
            inp.setText(Core.app.getClipboardText());
          }).top().size(50);
          bot.add(inp).growX().top().height(50);
          bot.button(Icon.rightOpen, flati, ()=>{
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
              cls();
            }else{
              pan.pack();
              let sy = info.height;
              info.add(line(s, false)).top().left().growX();
              info.row();
              const rc = Core.settings.getBool("svn-console-use-runConsole");
              let r = runScript(s, rc);
              if(r.err && r.err != ""){
                info.add(line(r.err, 2)).top().left().growX();
                info.row();
              }
              let res = r.res;
              if(res != (rc ? CLSX : CLS)){
                res = global.svn.util.toJson(r.res, 0, 2, 0);
                info.add(line(res, true)).top().left().growX();
                info.row();
                info.pack();
                pan.pack();
                Core.app.post(()=>{
                  pan.setScrollY(sy);
                });
              }
            }
          }).top().size(50);
          
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
      });
    }catch(e){
      Log.err("console: " + e);
    }
  });
}catch(e){
  Log.err(module.id + ": " + e);
}