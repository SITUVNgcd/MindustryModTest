let st = Core.settings;

Events.on(ClientLoadEvent, ()=>{
  try{
    Vars.ui.consolefrag.visibility=()=>(Vars.ui.minimapfrag.shown() || Vars.state.isMenu()) && st.getBool("svn-system-log");
    
    let hf = Vars.ui.hudfrag;
    let [hg, fe] = [Vars.ui.hudGroup, "find(arc.func.Boolf)"];
    let cid = hg[fe](e=>{
      return e instanceof Collapser && e[fe](f=>f instanceof CoreItemsDisplay) != null;
    });
    let boss = hg.find("boss");
    
    cid.setCollapsed(()=> !(hf.shown && st.getBool("svn-force-show-item-info") || st.getBool("coreitems") || (Vars.mobile && !Core.graphics.isPortrait())) );
    cid.touchable = Touchable.disabled
    const bv = boss.visibility;
    boss.touchable = Touchable.disabled;
    boss.visibility=()=>hf.shown && (st.getBool("svn-force-show-boss-info") || Vars.state.teams.bosses.size != 0 || bv.get());
  }catch(e){
    Log.err("misc: " + e);
  }
  
});

global.svn.misc = {};
Vars.renderer.minZoom = st.getInt("svn-min-zoom", 2) / 10;
Vars.renderer.maxZoom = st.getInt("svn-max-zoom", 15);

Vars.maxSchematicSize = 256;

const TimeCtrl = function(){
  
}
TimeCtrl.prototype.val = function(v){
  if(arguments.length > 0){
    if(typeof v == "number"){
      this.value = v; // TO DO!!!
    }
  }
  return this.value;
}
TimeCtrl.prototype.end = function(){
  if(this.tbl){
    this.tbl.remove();
    this.tbl.visible = false;
    return true;
  }
  return false;
}
TimeCtrl.prototype.run = function(){
  if(this.tbl){
    this.tbl.visible = true;
    return this.tbl;
  }
  const self = this;
  let maxCap = 2;
  let cols = [Pal.lancerLaser, Pal.accent, Color.valueOf("cc6eaf")];
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
    s.moved(v=>{
      if(c && c.isChecked() && v > maxCap){
        s.setValue(maxCap);
        return;
      }
      let t = Math.pow(2, v);
      Time.setDeltaProvider(()=>{
        return self.value = Math.min(Core.graphics.getDeltaTime() * 60 * t, 3 * t);
      });
      l.color(Tmp.c1.lerp(cols, (s.getValue() + 8) / 16));
    });
    c = t.check("Max: " + maxCap, true, (v)=>{
      if(v && s.getValue() > maxCap){
        s.setValue(maxCap);
      }
    }).padLeft(6).get();
  });
  let input = Vars.control.input;
  tbl.visibility = () => {
    if(!Core.settings.getBool("svn-time-control")) return false;
    if(!Vars.ui.hudfrag.shown || Vars.ui.minimapfrag.shown()) return false;
    if(!Vars.mobile) return true;
    return input.lastSchematic == null || input.selectPlans.isEmpty();
  };
  tbl.pack();
  Object.defineProperty(this, "tbl", {value: tbl, writable: false});
  return this.tbl;
}

const tc = new TimeCtrl(), tct = tc.run();
tct.setPosition(0, 120);
hg.addChild(tct);

global.svn.misc.timectrl = tc;