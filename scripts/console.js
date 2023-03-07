
function line(s, r){
  if(s == undefined){
    s = "undefined";
  }else if(s == null){
    s = "null";
  }else{
    s = s.toString();
  }
  let tbl = new Table();
  let h = (r ? "[accent]< []" : "[#4488ff]> []");
  tbl.add(h + s.replace(/\[/gi, "[[")).top().left().wrap().padLeft(6).growX();
  tbl.button(Icon.copy, 24, ()=>{Core.app.setClipboardText(s);}).top().padLeft(6).padRight(6);
  return tbl;
}

function runScript(s){
  let r;
  try{
    let script = Vars.mods.getScripts();
    try{
      //r = script.context.evaluateString(script.scope, s, "situvn-console.js", 1);
      r = script.runConsole(s);
    }catch(e){
      r = e;
    }
    if(r == undefined){
      r = "undefined";
    }else if(r == null){
      r = "null";
    }else if(r instanceof Object){
      r = r.toString();
      //r = JSON.stringify(r, null, 2);
    }
  }catch(e){
    Vars.ui.showErrorMessage("SITUVN's mod exception\nSome thing gone wrong: " + e);
    return "null";
  }
  return r;
}
Events.on(ClientLoadEvent, () => {
  try{
    let hg = Vars.ui.hudGroup;
    hg["fill(arc.func.Cons)"](t=>{
      t.touchable = Touchable.childrenOnly;
      t.top().right();
      let tbl = t["table(arc.scene.style.Drawable,arc.func.Cons)"](Styles.black6, tbl=>{
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
            showCredits();
          }else if(s == ":clear" || s == ":cls"){
            info.clearChildren();
          }else{
            info.add(line(s, false)).top().left().growX();
            info.row();
            info.add(line(runScript(s), true)).top().left().growX();
            info.row();
            //Core.app.post(()=>scr.setScrollPercentY(1));
          }
        }).top().padLeft(6).padRight(6);
        
        tbl.top().right();
        tbl.setWidth(400);
        tbl.setHeight(600);
        tbl.toFront();
        tbl.visibility = ()=>{
          let chk = Vars.ui.hudfrag.shown;
          if(chk){
            //Core.input.setOnscreenKeyboardVisible(true);
            //Core.scene.setKeyboardFocus(inp);
          }
          return chk;
        };
      }).top().right().width(400).height(600).name("situvn-console").get();
      let dy = 0;
      let mp = hg.find("minimap");
      dy -= mp ? mp.height : 0;
      mp = hg.find("position");
      dy -= mp ? mp.height : 0;
      t.moveBy(0, dy);
    });
    runScript("function list(o,f){let r='',p;for(let i in o){p=o[i];r+=i+' ('+typeof(p)+')\n';if(f){f(p, i, o);};};return r;}");
  
  }catch(e){
    Vars.ui.showErrorMessage("SITUVN's mod exception\nSome thing gone wrong: " + e);
  }
});