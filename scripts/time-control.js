try{
  global.svn.module = module;
  global.svn.exports = exports;
  global.svn.timeCtrl = {};
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
    tbl.visibility = ()=> Vars.ui.hudfrag.shown && !Vars.ui.minimapfrag.shown() && (!Vars.mobile || input.lastSchematic == null || input.selectPlans.isEmpty());
    tbl.pack();
    Object.defineProperty(this, "tbl", {value: tbl, writable: false});
    return this.tbl;
  }
  global.svn.timeCtrl.TimeCtrl = TimeCtrl;
}catch(e){
  Log.err("time-control: " + e);
}