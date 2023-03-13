importPackage(Packages.java.util);
let wloaded = false;
Events.on(WorldLoadEvent, () => {
  if(wloaded){
    return;
  }
  try{
    let input = Vars.control.input;
    let player = Vars.player;
    let hg = Vars.ui.hudGroup;
    let sltUns = input.selectedUnits;
    if(Vars.mobile){ // Mobile
      let cmd = findCommandButton();
      let par = cmd.parent;
      let uns, bul;
      //cmd.getLabel().setWrap(false);
      //cmd.getLabelCell().padLeft(6);
      //cmd.pack();
      //par.clear();
      //par.add(cmd);
      
      hg["fill(arc.func.Cons)"](cont=>{
        cont.touchable = Touchable.childrenOnly;
        cont.bottom().left();
        cont.name = "command.js";
        cont.visibility = ()=>Vars.state.isGame() && !Vars.ui.minimapfrag.shown();
        let assC = cont.table(Styles.black5).bottom().left().height(50).width(400).padLeft(0);
        let ass = assC.get();
        let sltAll = function(c){
          try{
            if(typeof c != "function"){
              c = ()=>true;
            }
            uns = new Seq();
            player.team().data().units.each(u=>{
              if(u.isCommandable() && c(u)){
                uns.add(u);
              }
            });
            if(!input.commmandMode){
              input.commandMode = true;
            }
            sltUns.clear();
            sltUns.addAll(uns);
            Events.fire(Trigger.unitCommandChange);
          }catch(e){
            Log.err(e);
          }
        }
        let alu = ass.button(Icon.planet, ()=>{
          sltAll();
        }).bottom().left().padLeft(6).size(50).growY().tooltip("Select all units").get();
        let als = ass.button(Icon.units, ()=>{
          sltAll((u)=>{
            let pos = Core.input.mouseScreen(u.x, u.y);
            return pos.x => 0 && pos.x <= Core.scene.viewport.getScreenWidth() && pos.y >= 0 && pos.y <= Core.scene.viewport.getScreenHeight();
          });
        }).bottom().left().padLeft(6).size(50).growY().tooltip("Select all units in screen").get();
        
        let teams = [], tmp;
        let pat = new Table();
        pat.bottom().left();
        pat.height = Scl.scl(50);
        for(let i = 0; i < 9; ++i){
          let ii = i + 1;
          tmp = pat.button("" + ii, ()=>{
            print("Team: " + ii);
          }).bottom().left().size(50).growY().tooltip("Team " + ii);
          if(i != 0){
            tmp.padLeft(6);
          }
          teams.push(tmp.get());
        }
        let pan = new ScrollPane(pat);
        pan.setScrollingDisabledY(true);
        ass.add(pan).bottom().left().padLeft(6).height(50).growX();
        let clr = ass.button(Icon.none, ()=>{
          
        }).bottom().right().padLeft(6).padRight(6).size(50).growY().tooltip("Clear team number").get();
        let lp = extend(ElementGestureListener, {
          longPress: function(e, x, y){
            Log.info(e + " (" + x + "," + y + ")");
          }
        });
        alu.addCaptureListener(lp);
        als.addCaptureListener(lp);
        
        cont.row();
        let cmxC = cont.table(Styles.black5).bottom().left().height(50).padLeft(155);
        let cmx = cmxC.get();
        cmx.visibility = ()=>cmd.isChecked();
        let stt = 0;
        let add = cmx.button(Icon.add, ()=>{
          if(stt != 1){
            stt = 1
          }else{
            stt = 0;
          }
        }).bottom().left().padLeft(6).size(50).growY().tooltip("Add units").get();
        add.setProgrammaticChangeEvents(false);
        let addS = add.getStyle();
        addS.imageCheckedColor = Color.valueOf("4488ff");
        add.setStyle(addS);
        
        let rem = cmx.button(Icon.trash, ()=>{
          if(stt != -1 && !sltUns.isEmpty()){
            stt = -1
          }else{
            stt = 0;
          }
        }).bottom().left().padLeft(6).size(50).growY().tooltip("Remove units").get();
        rem.setProgrammaticChangeEvents(false);
        let remS = rem.getStyle();
        remS.imageCheckedColor = Color.valueOf("ff4488");
        rem.setStyle(remS);
        rem["setDisabled(arc.func.Boolp)"](()=>sltUns.isEmpty());
        
        let can = cmx.button(Icon.cancel, ()=>{
          input.selectedUnits.clear();
          let pstt = stt;
          if(stt != 0){
            stt = 0;
          }
          Events.fire(Trigger.unitCommandChange);
          if(pstt == 1){
            stt = 1;
          }
        }).bottom().left().padLeft(6).size(50).growY().tooltip("Deselect all units").get();
        can.setProgrammaticChangeEvents(false);
        can["setDisabled(arc.func.Boolp)"](()=>sltUns.isEmpty());
        
        cont.update(()=>{
          cmxC.padLeft(cmd.width).height(cmd.height);
          if(!cmd.isChecked()){
            stt = 0;
          }
          add.setChecked(stt == 1);
          rem.setChecked(stt == -1);
          if(!input.commandMode && uns && uns.size){
            uns = sltUns.copy();
          }
        });
        let evt = false;
        Events.run(Trigger.unitCommandChange, ()=>{
          try{
            if(uns && !evt && stt != 0){
              evt = true;
              let tmpuns = sltUns.copy();
              let i, idx;
              if(stt == 1){
                uns.addAll(tmpuns);
              }else if(stt == -1){
                uns.removeAll(tmpuns);
                if(uns.size == 0){
                  stt = 0;
                }
              }
              sltUns.clear();
              sltUns.addAll(uns);
              Events.fire(Trigger.unitCommandChange);
              evt = false;
            }
            uns = sltUns.copy();
          }catch(e){
            Log.info(e);
          }
        });
      });
    }else{ // Desktop
      
    }
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