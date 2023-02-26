let names = [];
let named = "";
for(let name in this){
  names.push({name: name, val: this[name]});
  named += name + "\n";
}

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
__main__();

// From sk7725/TimeControl for testing
let cols = [Pal.lancerLaser, Pal.accent, Color.valueOf("cc6eaf")];
let maxCap = 2;

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
showCredits();
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

function showCredits(){
    BaseDialog dialog = new BaseDialog("@credits");
    dialog.addCloseButton();
    dialog.cont.add("@credits.text").fillX().wrap().get().setAlignment(Align.center);
    dialog.cont.row();
    let contributors = ["SITUVNgcd"];
    if(!contributors.isEmpty()){
      dialog.cont.image().color(Pal.accent).fillX().height(3f).pad(3f);
      dialog.cont.row();
      dialog.cont.add("@contributors");
      dialog.cont.row();
      dialog.cont.pane(new Table(){{
        let i = 0;
        left();
        for(let c in contributors){
          add("[lightgray]" + c).left().pad(3).padLeft(6).padRight(6);
          if(++i % 3 == 0){
              row();
          }
        }
      }});
    }
    dialog.show();
  }
}

