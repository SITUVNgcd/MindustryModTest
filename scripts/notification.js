Events.on(ClientLoadEvent, ()=>{
  try{
    let hg = Vars.ui.hudGroup;
    let it = hg.find("infotable");
    global.svn.noti = {};
    let w = new WidgetGroup();
    w.visibility = ()=>Vars.ui.hudfrag.shown && !Vars.ui.minimapfrag.shown();
    w.setFillParent(true);
    w.touchable = Touchable.disabled;
    w.toFront();
    w.name = "svn-notification";
    let max = 5, ft = 3, dd = 7, count = 0;
    global.svn.noti.max = function(m){
      if(!m || typeof m != "number" || m < 1){
        return;
      }
      max = m;
      let childs = w.getChildren();
      while(childs.size >= max){
        w.removeChild(childs.get(0));
      }
    }
    global.svn.noti.fadeTime = function(t){
      if(!t || typeof t != "number" || t < 0 || t > 10){
        return;
      }
      ft = t;
    }
    global.svn.noti.defDur = function(d){
      if(!d || typeof d != "number" || d < 0){
        return;
      }
      dd = d;
      if(dd < ft){
        dd = ft;
      }
    }
    global.svn.noti.add = function(txt, dur, wrp){
      if(txt == null || txt == undefined){
        return;
      }
      if(typeof txt != "string"){
        txt = txt.toString();
      }
      if(!dur || typeof dur != "number"){
        dur = dd;
      }
      if(dur < ft){
        dur = ft;
      }
      if(typeof wrp != "boolean"){
        wrp = true;
      }
      let tbl = new Table(count % 2 ? Styles.black5 : Styles.black3);
      ++count;
      let lbl = tbl.margin(8).add(txt).style(Styles.outlineLabel).labelAlign(Align.topLeft);
      let dl = dur - ft;
      dl = dl < 0 ? 0 : dl;
      tbl.actions(
      Actions.delay(dl),
      Actions.fadeOut(ft, Interp.pow4In),
      Actions.remove()
      );
      w.addChild(tbl);
      tbl.update(()=>{
        let p = Core.scene;
        if(p != null){
          let w = p.width * 2 / 3;
          lbl.maxWidth(w);
          lbl.wrapLabel(wrp);
          tbl.width = w;
        }
      });
      tbl.pack();
      tbl.act(0.1);
      let childs = w.getChildren();
      while(childs.size >= max){
        w.removeChild(childs.get(0));
      }
    }
    w.pack();
    w.update(()=>{
      let yt = it.localToStageCoordinates(new Vec2(0,0)).y;
      let childs = w.getChildren();
      childs.each(e=>{
        e.setPosition(0, yt, Align.topLeft);
        yt -= e.height;
      });
    });
    hg.addChild(w);
  }catch(e){
    Log.err("announcelist: " + JSON.stringify(e));
    //global.log.err(e);
  }
});