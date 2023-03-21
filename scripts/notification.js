Events.on(ClientLoadEvent, ()=>{
  try{
    let hg = Vars.ui.hudGroup;
    let it = hg.find("infotable");
    global.svn.noti = {};
    hg["fill(arc.func.Cons)"](t=>{
      t.touchable = Touchable.disabled;
      t.top().left();
      t.name = "svn-notification";
      let notis = [];
      global.svn.noti.add = function(txt){
        if(!txt){
          return;
        }
        if(typeof txt != "string"){
          txt = txt.toString();
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
          t.setPosition(0, yt, Align.topLeft);
        });
        tbl.actions(Actions.fadeOut(duration, Interp.pow4In), Actions.remove(), Actions.run(()=>{
          let idx = notis.indexOf(tbl);
          if(idx > -1){
            notis.splice(idx, 1);
          }
        }));
        tbl.pack();
        tbl.act(0.1);
        t.add(tbl);
        notis.push(tbl);
      }
    });
  }catch(e){
    Log.err("announcelist: " + e);
    //global.log.err(e);
  }
});