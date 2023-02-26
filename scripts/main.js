// From sk7725/TimeControl for testing
let cols = [Pal.lancerLaser, Pal.accent, Color.valueOf("cc6eaf")];
let maxCap = 2;

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
  showExcept(e);
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
//showCredits();
showConsole();
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

function showConsole(){
  try{
    Vars.settings.put("console", true);
  let dlg = new BaseDialog("Console");
  let con = Vars.ui.consolefrag;
  dlg.addCloseButton();
  //dlg.cont.pane(con).grow();
  con.visibility = ()=>true;
  dlg.show();
  }catch(e){
    showExcept(e);
  }
}

function showCredits(){
  let dialog = new BaseDialog("Mod credit");
  dialog.addCloseButton();
  dialog.cont.add("Mod by\n[#4488ff]SITUVN[]\n\nApart from sk7725/TimeControl for testing").fillX().wrap().get().setAlignment(Align.center);
  dialog.show();
}

function showExcept(e){
  let dialog = new BaseDialog("Exception!");
  dialog.addCloseButton();
  dialog.cont.add(e);
  dialog.show();
}

