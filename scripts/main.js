// From sk7725/TimeControl for testing
let cols = [Pal.lancerLaser, Pal.accent, Color.valueOf("cc6eaf")];
let maxCap = 2;
let con = null, cre = null;
function __main__(){
  if(!Vars.headless){
    var tc = new Table();

    Events.on(ClientLoadEvent, () => {
      tc.bottom().left();
      addTable(tc);
      Vars.ui.hudGroup.addChild(tc);
      if(Vars.mobile) tc.moveBy(0, Scl.scl(46));
    });
  }
}
try{
  __main__();
} catch (e){
  Vars.ui.showException("SITUVN's mod exception", e);
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
    let b = t.button(new TextureRegionDrawable(Icon.refresh), 24, () => s.setValue(0)).padLeft(6).get();
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
  let col = table.collapser(tbl, (s)=>true).left().bottom().padLeft(6).width(400).height(400).get();
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
    let his = [];
    let hisPos = -1;
    let info, bot, scr, idx;
    his.push("");
    con = new BaseDialog("Console");
    con.addCloseButton();
    info = new Table().top().left();
    bot = con.cont.table().growX().bottom().get();
    con.cont.row();
    scr = con.cont.pane(info).top().left().grow();
    bot.button(new TextureRegionDrawable(Icon.up), 24, ()=>{
      if(hisPos > 0){
        --hisPos;
      }
      inp.setText(his[hisPos]);
    }).top().padLeft(6);
    bot.button(new TextureRegionDrawable(Icon.down), 24, ()=>{
      if(hisPos < his.length - 1){
        ++hisPos;
      }
      inp.setText(his[hisPos]);
    }).top().padLeft(6);
    inp = bot.area("", (s)=>{
      
    }).growX().top().padLeft(6).height(50).get();
    bot.button(new TextureRegionDrawable(Icon.right), 24, ()=>{
      let s = inp.getText();
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
        info.add(line(Vars.mods.getScripts().runConsole(s), true)).top().left().growX();
        info.row();
        //Core.app.post(()=>scr.setScrollPercentY(1));
      }
    }).top().padLeft(6).padRight(6);
  }
  con.show();
  Core.input.setOnscreenKeyboardVisible(true);
  Core.scene.setKeyboardFocus(inp);
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
  let tbl = new Table();
  tbl.add((r ? "< " : "[lightgray]> ") + s.replace("[", "[[") + "[]").top().left().wrap().padLeft(6).growX();
  tbl.button(new TextureRegionDrawable(Icon.copy), 24, ()=>{Core.app.setClipboardText(s);}).top().padLeft(6).padRight(6);
  return tbl;
}
























