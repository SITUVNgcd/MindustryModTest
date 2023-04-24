// From sk7725/TimeControl for testing
let cols = [Pal.lancerLaser, Pal.accent, Color.valueOf("cc6eaf")];
let maxCap = 2;
let con = null, cre = null, conx = null;
let commandGroup, coreInfo;

  
function __main__(){
  /*
  let tc = new Table();
  tc.bottom().left();
  addTable(tc);
  Vars.ui.hudGroup.addChild(tc);
  if(Vars.mobile) tc.moveBy(0, Scl.scl(120));
  
  
  commandGroup = findCommandGroup();
  coreInfo = findCoreInfo();
  */
}

if(!Vars.headless){
  Events.on(ClientLoadEvent, () => {
    try{
      __main__();
    }catch(e){
      Log.err("main: " + e);
    }
  });
}


function addTable(table){
  let tbl = new Table(Tex.pane, t => {
    let s = new Slider(-8, 8, 1, false);
    let c = null;
    s.setValue(0);
    let l = t.label(() => {
      let v = s.getValue();
      if(v >= 0){
          return "x" + Math.pow(2, v);
      }else{
          return "x1/" + Math.pow(2, Math.abs(v));
      }
    }).growX().width(8.5 * 8).color(Pal.accent);
    let b = t.button(Icon.refresh, 24, () => s.setValue(0)).padLeft(6).get();
    b.getStyle().imageUpColor = Pal.accent;
    t.add(s).padLeft(6).minWidth(200);
    s.moved(v => {
      if(c && c.isChecked() && v > maxCap){
        s.setValue(maxCap);
        return;
      }
      let t = Math.pow(2, v);
      Time.setDeltaProvider(() => Math.min(Core.graphics.getDeltaTime() * 60 * t, 3 * t));
      l.color(Tmp.c1.lerp(cols, (s.getValue() + 8) / 16));
    });
    c = t.check("Max: " + maxCap, true, (v)=>{
      if(v && s.getValue() > maxCap){
        s.setValue(maxCap);
        showConsole();
      }
    }).padLeft(6).get();
  });
  let col = Collapser(tbl, false);
  table.button(Icon.right, 50, ()=>{
    col.toggle(false);
  }).padLeft(6).width(50).height(50);
  table.add(col).padLeft(6).left().bottom().width(400).height(60).get();
  table.visibility = () => {
    if(!Vars.ui.hudfrag.shown || Vars.ui.minimapfrag.shown()) return false;
    if(!Vars.mobile) return true;
    let input = Vars.control.input;
    return input.lastSchematic == null || input.selectPlans.isEmpty();
  };
}

let inp;
function showConsole(){
  if(!con){
    con = new BaseDialog("Console");
    con.addCloseButton();
    setupConsoleTable(con.cont);
  }
  con.show();
  //Core.input.setOnscreenKeyboardVisible(true);
  //Core.scene.setKeyboardFocus(inp);
}

function setupConsoleTable(tbl){
  if(!tbl){
    tbl = new Table();
  }
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
  return tbl;
}

function showCredits(){
  if(!cre){
    cre = new BaseDialog("Mod credit");
    cre.addCloseButton();
    cre.cont.add("Mod by\n[#4488ff]SITUVN[]\n\nApart from sk7725/TimeControl for testing").fillX().wrap().get().setAlignment(Align.center);
    }
  cre.show();
}

function line(s, r){
  if(s == undefined){
    s = "undefined";
  }else if(s == null){
    s = "null";
  }
  let tbl = new Table();
  tbl.add((r ? "[accent]< []" : "[#4488ff]> []") + s.replace("[", "[[") + "[]").top().left().wrap().padLeft(6).growX();
  tbl.button(Icon.copy, 24, ()=>{Core.app.setClipboardText(s);}).top().padLeft(6).padRight(6);
  return tbl;
}

function runScript(s){
  let r;
  try{
    let script = Vars.mods.getScripts();
    try{
      r = script.context.evaluateString(script.scope, s, "situvn-console.js", 1);
    }catch(e){
      try{
        r = script.runConsole(s);
      }catch(ee){
        r = e;
      }
    }
    if(r == undefined){
      r = "undefined";
    }else if(r == null){
      r = "null";
    }else if(r instanceof Object){
      r = JSON.stringify(r, null, 2);
    }
  }catch(e){
    Log.err("eval: " + e);
    return "null";
  }
  return r;
}

/* for mobile*/
function findCommandGroup(){
  let hg = Vars.ui.hudGroup;
  if(hg == null){
    return null;
  }
  return hg["find(arc.func.Boolf)"](e=>{
    let cc, cm;
    let [bd, cf] = [Core.bundle, "get(java.lang.String,java.lang.String)"];
    let [cct, cmt] = [bd[cf]("command", "Command"), bd[cf]("cancel", "Cancel")];
    if(e instanceof WidgetGroup){
      e.forEach(f=>{
        if(f.getText){
          if(f.getText() == cct){
            cc = f;
          }
          if(f.getText() == cmt){
            cm = f;
          }
        }
      });
    }
    return cc != null && cm != null;
  });
}

function findCoreInfo(){
  let hg = Vars.ui.hudGroup;
  if(hg == null){
    return null;
  }
  return hg.find("coreinfo");
}






let setUncaughtExceptionHandler = function(f) {
  Vars.mods.getScripts().context.setErrorReporter(
    new JavaAdapter(
      Packages.rhino.ErrorReporter,
      new function() {
        let handle = function(type) {
          return function(message,sourceName,line,lineSource,lineOffset) {
            f({
	            type: type,
	            message: String(message),
	            sourceName: String(sourceName),
	            line: line,
	            lineSource: String(lineSource),
	            lineOffset: lineOffset
            });
          };
        };
    
        ["warning","error","runtimeError"].forEach(function(name) {
          this[name] = handle(name);
        },this);
      }
    )
  );
};

let getExceptionInfo = function(e){
  let inf = "No info!";
  try{
    if(typeof global.svn.util.toJson == "function"){
      inf = global.svn.util.toJson(e, 0, 0, 1);
    }else{
      inf = JSON.stringify(e);
    }
  }catch(x){
    try{
      inf = e.toString();
    }catch(xx){}
  }
  return inf;
}

let deepFreeze = function(obj, it){
  if(obj instanceof java.lang.Object){
    return false;
  }
  if(!(it instanceof Array)){
    it = [];
  }
  try{
    let props = Object.getOwnPropertyNames(obj);
    let val, ni, i;
    for(let name of props){
      val = obj[name];
      ni = 1;
      for(i of it){
        if(i === val){
          ni = 0;
          break;
        }
      }
      if(ni && val && (typeof val === "object" || typeof val === "function")){
        it.push(val);
        deepFreeze(val, it);
      }
    }
  }catch(e){}
  return Object.freeze(obj);
}

try{
  setUncaughtExceptionHandler(function(e){
    let de = getExceptionInfo(e);
    Log.err("Uncaught exception!!! " + de);
  });
  Object.defineProperty(global, "svn", {value: {}, writable: false});
  Object.defineProperty(this, "svn", {value: global.svn, writable: false});
  
  
  const name = "situvngcd-test-mod";
  const modules = [
    "util",
    "notification",
    "settings",
    "console",
    "command",
    "chat-command-helper",
    "crawler-arena-helper",
    
    "misc",
  ];
  for(let i = 0, module; i < modules.length; ++i){
    try{
      module = modules[i];
      require(module);
    }catch(e){
      Log.err("Module loading error! Module: " + module + ", Error: " +  e);
    }
  }
  //deepFreeze(global.svn);
  Object.freeze(global.svn);
  if(typeof global.svn.util.toJson == "function"){
    Object.defineProperty(this, "json", {value: global.svn.util.toJson, writable: false});
  }
  if(typeof global.svn.con.print == "function"){
    Object.defineProperty(this, "conlog", {value: global.svn.con.print, writable: false});
  }
}catch(e){
  Log.err("svn-main: " + e);
}