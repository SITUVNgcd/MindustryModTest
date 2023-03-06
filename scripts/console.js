function Console(){
  let tbl = new Table();
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
  this.tbl = tbl;
}


function line(s, r){
  if(s == undefined){
    s = "undefined";
  }else if(s == null){
    s = "null";
  }else{
    s = String.valueOf(s);
  }
  let tbl = new Table();
  let h = (r ? "[accent]< []" : "[#4488ff]> []");
  tbl.add(h + s.replace("[", "[[")).top().left().wrap().padLeft(6).growX();
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
      r = String.valueOf(r);
      //r = JSON.stringify(r, null, 2);
    }
  }catch(e){
    Vars.ui.showErrorMessage("SITUVN's mod exception\nSome thing gone wrong: " + e);
    return "null";
  }
  return r;
}
Events.on(ClientLoadEvent, () => {
  global.con = new Console();
  let hg = Vars.ui.hudGroup;
  con.tbl.top().right();
  con.tbl.setWidth(400);
  con.tbl.setHeight(600);
  con.tbl.setZIndex(999);
  con.tbl.update(()=>{
    con.tbl.moveBy(hg.getWidth() - 400, hg.getHeight() - 600);
  });
  con.tbl.visibility = ()=>{
    let chk = global.c && global.c.isChecked();
    if(chk){
      //Core.input.setOnscreenKeyboardVisible(true);
      //Core.scene.setKeyboardFocus(inp);
    }
    return chk;
  }
  hg.addChild(con.tbl);
});