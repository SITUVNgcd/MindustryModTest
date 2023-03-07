let wloaded = false;
Events.on(WorldLoadEvent, () => {
  if(wloaded) return
  try{;
    let cmd = findCommandButton();
    let par = findParent(cmd);
    let cmdW = cmd.width;
    par.clear();
    par.add(cmd).width(cmdW);
    let up = par.button(Icon.add, ()=>{
      up.toggle();
    });
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