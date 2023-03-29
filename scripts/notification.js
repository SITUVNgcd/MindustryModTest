try{
  global.svn.noti = {};
  let hg, it, w;
  Events.on(ClientLoadEvent, ()=>{
    hg = Vars.ui.hudGroup;
    it = hg.find("infotable");
    hg.addChild(w);
  });
  w = new WidgetGroup();
  svn.noti.ele = w;
  w.visibility = ()=>Vars.ui.hudfrag.shown && !Vars.ui.minimapfrag.shown();
  w.setFillParent(true);
  w.touchable = Touchable.disabled;
  w.toFront();
  w.name = "svn-notification";
  w.pack();
  w.update(()=>{
    let yt = it.localToStageCoordinates(new Vec2(0,0)).y;
    let childs = w.getChildren();
    childs.each(e=>{
      e.setPosition(0, yt, Align.topLeft);
      yt -= e.height;
    });
  });
  let count = 0;
  let max, ft, dd, col, tc, maxWP, maxWR;
  global.svn.noti.reset = function(){
    max = 5;
    ft = 3;
    dd = 7;
    col = "";
    tc = false;
    maxWP = 2/3;
    maxWR = 0;
  }
  global.svn.noti.reset();
  global.svn.noti.max = function(m){
    if(m != undefined && m != null && typeof m == "number" && m > 0){
      max = m;
      let childs = w.getChildren();
      while(childs.size >= max){
        w.removeChild(childs.get(0));
      }
    }
    return max;
  }
  global.svn.noti.fadeTime = function(t){
    if(t != undefined && t != null && typeof t == "number" && t >= 0){
      ft = t;
    }
    return ft;
  }
  global.svn.noti.defDur = function(d){
    if(d != undefined && d != null && typeof d == "number" && d > 0){
      dd = d;
      if(dd < ft){
        dd = ft;
      }
    }
    return dd;
  }
  global.svn.noti.color = function(c){
    if(c != undefined && c != null){
      col = global.svn.util.colorString(c);
    }
    return col;
  }
  global.svn.noti.useTeamColor = function(u){
    let t = typeof u;
    if(u != undefined && u != null && (t == "boolean" || t == "number")){
      if(t == "number"){
        u = !!u;
      }
      tc = u;
    }
    return tc;
  }
  global.svn.noti.maxWidth = function(mw){
    if(mw!= undefined && mw != null){
      if(typeof mw == "number" && mw > 0){
        if(mw > 0 && mw <= 1){
          maxWP = mw;
          maxWR = 0;
        }else{
          maxWP = 0;
          maxWR = mw;
        }
      }
    }
    return maxWP != 0 ? maxWP : maxWR;
  }
  global.svn.noti.clear = function(){
    w.clearChildren();
  }
  global.svn.noti.add = function(txt, dur, wrp, bgr){
    if(txt == null || txt == undefined){
      return;
    }
    if(typeof txt != "string"){
      try{
        txt = JSON.stringify(txt);
      }catch(e){
        txt = txt.toString();
      }
    }
    txt = "[" + (tc ? "#" + Vars.player.team().color.toString() : col) + "]" + txt;
    if(typeof dur != "number"){
      dur = dd;
    }
    if(dur < ft){
      dur = ft;
    }
    if(typeof wrp == "number"){
      wrp = !!wrp;
    }
    if(typeof wrp != "boolean"){
      wrp = true;
    }
    let tbl = new Table(count % 2 ? Styles.black5 : Styles.black3);
    ++count;
    if(bgr instanceof Drawable){
      tbl.background(bgr);
    }
    let lbl = tbl.margin(8).add(txt).style(Styles.outlineLabel).labelAlign(Align.topLeft);
    let dl = dur - ft;
    dl = dl < 0 ? 0 : dl;
    tbl.actions(
    Actions.delay(dl),
    Actions.fadeOut(ft, Interp.pow4In),
    Actions.remove()
    );
    w.addChild(tbl);
    let lb = lbl.get();
    tbl.update(()=>{
      let w = maxWP != 0 ? Core.scene.width * maxWP : maxWR;
      lb.width = w;
      lb.setWrap(wrp);
      lb.setEllipsis(!wrp);
      lb.pack();
      let gw = lb.getGlyphLayout().width;
      lbl.width(gw < w ? gw : w);
      tbl.pack();
    });
    tbl.pack();
    tbl.act(0.1);
    let childs = w.getChildren();
    while(childs.size > max){
      w.removeChild(childs.get(0));
    }
    return tbl;
  }
}catch(e){
  Log.err("notification: " + e);
}