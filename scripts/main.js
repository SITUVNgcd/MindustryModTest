// From sk7725/TimeControl for testing
let cols = [Pal.lancerLaser, Pal.accent, Color.valueOf("cc6eaf")];
let maxCap = 2;
/*
let conLog = null;
const console = {log: function(v){conLog && conLog.appendText(v + "\n");}};
*/

let con = new ConsoleDialog();
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
  table.table(Tex.pane, t => {
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
        con.show();
      }
    }).padLeft(6).get();
  });
  table.visibility = () => {
    if(!Vars.ui.hudfrag.shown || Vars.ui.minimapfrag.shown()) return false;
    if(!Vars.mobile) return true;
    
    let input = Vars.control.input;
    return input.lastSchematic == null || input.selectPlans.isEmpty();
  };
}

function ConsoleDialog(){
  let self = this;
  this.dlg = new BaseDialog("Console");
  this.dlg.addCloseButton();
  this.info = new Table();
  this.dlg.cont.pane(info).grow().top().left();
  this.dlg.cont.row();
  this.inp = dlg.cont.field("", (s)=>{
    self.inp.clearText();
    if(s == "credit"){
      //dlg.hide();
      showCredits();
    }else if(s == ":clear"){
      self.info.clearChildren();
    }else{
      self.info.add(line(s, false)).top().left().growX();
      self.info.row();
      self.info.add(line(Vars.mods.getScripts().runConsole(s), true)).top().left().growX();
      self.info.row();
    }
  }).growX().bottom().get();
  this.show = function(){
    this.dlg.show();
  }
}

function showCredits(){
  let dialog = new BaseDialog("Mod credit");
  dialog.addCloseButton();
  dialog.cont.add("Mod by\n[#4488ff]SITUVN[]\n\nApart from sk7725/TimeControl for testing").fillX().wrap().get().setAlignment(Align.center);
  dialog.show();
}

function line(s, r){
  let tbl = new Table();
  tbl.add((r ? "< " : "[lightgray]> ") + s.replace("[", "[[") + "[]").left().wrap().padLeft(6).growX();
  tbl.button(new TextureRegionDrawable(Icon.copy), 24, ()=>{Core.app.setClipboardText(s);}).top().padLeft(6).padRight(6);
  return tbl;
}

























