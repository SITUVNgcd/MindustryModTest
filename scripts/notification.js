Events.on(ClientLoadEvent, ()=>{
  try{
    let hg = Vars.ui.hudGroup;
    let it = hg.find("infotable");
    global.svn.noti = {};
    let w = new WidgetGroup();
    w.setFillParent(true);
    w.touchable = Touchable.disabled;
    w.name = "svn-notification";
    let notis = [];
    global.svn.noti.add = function(txt, dur){
      if(!txt){
        return;
      }
      if(typeof txt != "string"){
        txt = txt.toString();
      }
      if(!dur || typeof dur != "number"){
        dur = 5;
      }
      let tbl = new Table(Styles.black3);
      tbl.margin(8).add(txt).style(Styles.outlineLabel).labelAlign(Align.topLeft);
      tbl.update(()=>{
        let yt = Core.scene.height - it.localToStageCoordinates(new Vec2(0,0)).y;
        let n;
        for(let i = 0; i < notis.length; ++i){
          n = notis[i];
          if(n == tbl){
            break;
          }
          yt += n.height;
        }
        tbl.setPosition(0, yt, Align.topLeft);
      });
      tbl.actions(Actions.fadeOut(dur, Interp.pow4In), Actions.remove(), Actions.run(()=>{
        let idx = notis.indexOf(tbl);
        if(idx > -1){
          notis.splice(idx, 1);
        }
      }));
      tbl.pack();
      tbl.act(0.1);
      w.add(tbl);
      notis.push(tbl);
    }
    w.pack();
    hg.addChild(w);
  }catch(e){
    Log.err("announcelist: " + e);
    //global.log.err(e);
  }
});