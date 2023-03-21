Events.on(ClientLoadEvent, ()=>{
  try{
    let hg = Vars.ui.hudGroup;
    let it = hg.find("infotable");
    global.svn.noti = {};
    let w = new WidgetGroup();
    w.setFillParent(true);
    w.touchable = Touchable.disabled;
    w.name = "svn-notification";
    let notis = [], max = 5, ft = 3, count = 0;
    global.svn.noti.max = function(m){
      if(!m || typeof m != "number" || m < 1){
        return;
      }
      max = m;
      while(notis.length > max){
        w.removeChild(notis.splice(0, 1)[0]);
      }
    }
    global.svn.noti.fadeTime = function(t){
      if(!t || typeof t != "number" || t < 0 || t > 10){
        return;
      }
      ft = t;
    }
    global.svn.noti.add = function(txt, dur){
      if(txt == null || txt = undefined){
        return;
      }
      if(typeof txt != "string"){
        txt = txt.toString();
      }
      if(!dur || typeof dur != "number" || dur < ft){
        dur = ft;
      }
      let tbl = new Table(count % 2 ? Styles.black5 : Styles.black3);
      ++count;
      tbl.margin(8).add(txt).style(Styles.outlineLabel).labelAlign(Align.topLeft);
      tbl.update(()=>{
        let yt = it.localToStageCoordinates(new Vec2(0,0)).y;
        let n;
        for(let i = 0; i < notis.length; ++i){
          n = notis[i];
          if(n == tbl){
            break;
          }
          yt -= n.height;
        }
        tbl.setPosition(0, yt, Align.topLeft);
      });
      let dl = dur - ft;
      dl = dl < 0 ? 0 : dl;
      tbl.actions(
      Actions.delay(dl),
      Actions.fadeOut(ft, Interp.pow4In),
      Actions.run(()=>{
        let idx = notis.indexOf(tbl);
        if(idx > -1){
          notis.splice(idx, 1);
        }
      }),
      Actions.remove()
      );
      tbl.pack();
      tbl.act(0.1);
      while(notis.length >= max){
        w.removeChild(notis.splice(0, 1)[0]);
      }
      w.addChild(tbl);
      notis.push(tbl);
    }
    w.pack();
    hg.addChild(w);
  }catch(e){
    Log.err("announcelist: " + e);
    //global.log.err(e);
  }
});