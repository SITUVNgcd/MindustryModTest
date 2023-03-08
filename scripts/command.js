let wloaded = false;
Events.on(WorldLoadEvent, () => {
  if(wloaded){
    return;
  }
  try{;
    let cmd = findCommandButton();
    let par = cmd.parent;
    let cmdW = cmd.width;
    cmd.getLabel().setWrap(false);
    cmd.pack();
    par.clear();
    par.add(cmd);
    let tbl = par["table(arc.scene.style.Drawable)"](Styles.black5).height(cmd.height).get();
    tbl.visibility = ()=>cmd.isChecked();
    let stt = 0;
    let add = tbl.button(Icon.add, ()=>{
      if(stt != 1){
        stt = 1
      }else{
        stt = 0;
      }
    }).padLeft(6).growY().center().get();
    add.setProgrammaticChangeEvents(false);
    let addS = add.getStyle();
    addS.imageCheckedColor = Color.valueOf("4488ff");
    add.setStyle(addS);
    
    let rem = tbl.button(Icon.trash, ()=>{
      if(stt != -1){
        stt = -1
      }else{
        stt = 0;
      }
    }).padLeft(6).growY().center().get();
    rem.setProgrammaticChangeEvents(false);
    let remS = rem.getStyle();
    remS.imageCheckedColor = Color.valueOf("ff4488");
    rem.setStyle(remS);
    
    let can = tbl.button(Icon.cancel, ()=>{
      Vars.control.input.selectedUnits.clear();
    }).padLeft(6).growY().center().get();
    can.setProgrammaticChangeEvents(false);
    
    tbl.update(()=>{
      if(!cmd.isChecked()){
        stt = 0;
      }
      add.setChecked(stt == 1);
      rem.setChecked(stt == -1);
    });
    Log.info("CMD H:" + cmd.height);
  }catch(e){
    Log.info(e);
  }
  wloaded = true;
});

function findCommandGroup(){
  let hg = Vars.ui.hudGroup;
  return hg["find(arc.func.Boolf)"](e=>{
    let cc, cm;
    let [bd, cf] = [Core.bundle, "get(java.lang.String,java.lang.String)"];
    let [cct, cmt] = [bd[cf]("command", "Command"), bd[cf]("cancel", "Cancel")];
    if(e instanceof WidgetGroup){
      e.forEach(f=>{
        if(f.getText){
          if(f.getText() == cct){
            cc = f;
          }
          if(f.getText() == cmt){
            cm = f;
          }
        }
      });
    }
    return cc != null && cm != null;
  });
}

function findCommandButton(){
  let hg = Vars.ui.hudGroup;
  return hg["find(arc.func.Boolf)"](e=>{
    let [bd, cf] = [Core.bundle, "get(java.lang.String,java.lang.String)"];
    let cct = bd[cf]("command", "Command");
    return e instanceof TextButton && e.getText() == cct;
  });
}

function findParent(c){
  if(!c){
    return null;
  }
  let hg = Vars.ui.hudGroup;
  return hg["find(arc.func.Boolf)"](e=>{
    let cc = null;
    e.forEach(f=>{
      if(f == c){
        cc = f;
      }
    });
    return c == cc;
  });
}