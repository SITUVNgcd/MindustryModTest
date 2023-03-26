try{
  let line = function(s, r){
    if(s == undefined){
      s = "undefined";
    }else if(s == null){
      s = "null";
    }else{
      s = s.toString();
    }
    if(typeof r == "boolean"){
      r = r ? 2 : 1;
    }
    if(typeof r != "number"){
      r = 0;
    }
    let tbl = new Table();
    let h = (r == 2 ? "[accent]< []" : r == 1 ? "[#4488ff]> []" : "");
    tbl.add(h + s.replace(/\[/gi, "[[")).top().left().wrap().padLeft(6).growX();
    tbl.button(Icon.copy, 24, ()=>{
      Core.app.setClipboardText(s);
    }).top().padLeft(6).padRight(6);
    tbl.pack();
    return tbl;
  }
  
  let runScript = function(s){
    let r;
    try{
      let script = Vars.mods.getScripts();
      try{
        let cxt = script.context, scp = script.scope;
        let sc = ctx.compileString(s, "svn-console.js", 1);
        if(sc != null){
          r = sc.exec(ctx, scp);
        }
        // r = script.runConsole(s);
        //r = script.context.evaluateString(script.scope, s, "situvn-console.js", 1);
        //r = eval(s);
      }catch(e){
        Log.err("console eval: " + e);
      }
      if(r == undefined){
        r = "undefined";
      }else if(r == null){
        r = "null";
      }else if(r instanceof Object){
        try{
        r = JSON.stringify(r, null, 2);
        }catch(e){
          r = r.toString();
        }
      }
    }catch(e){
      Log.err("eval: " + e);
      r = "null";
    }
    return r;
  }
  
  Events.on(ClientLoadEvent, () => {
    try{
      Vars.ui.consolefrag.visibility=()=>(Vars.ui.minimapfrag.shown() || Vars.state.isMenu()) && Core.settings.getBool("svn-system-log");
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
              info.add(line(runScript(s), true)).top().left().growX();
              info.row();
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
        }).top().right().width(400).height(600).name("situvn-console");
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
      let sss = `function list(o,f){ let r="",p,n,ns;if(o instanceof java.lang.Object){ns=[];for(let i in o){ns.push(i);}}else{ns=Object.getOwnPropertyNames(o);}for(let i of ns){p=o[i];n=typeof(p);try{if(p instanceof java.lang.Object){n=p.getClass().getName();}}catch(e){}r+=i+" ("+n+")\\n"; if(typeof(f)=="function"){f(p,i,o);}}return r;}`;
      runScript(sss);
    }catch(e){
      Log.err("console: " + e);
    }
  });
}catch(e){
  Log.err("console: " + e);
}