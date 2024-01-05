importPackage(Packages.java.util);
let wle;
Events.on(WorldLoadEvent, wle = () => {
  try{
    Events.remove(WorldLoadEvent, wle);
    const bun = Core.bundle;
    const ui = Vars.ui;
    const input = Vars.control.input;
    const player = Vars.player;
    const hg = Vars.ui.hudGroup;
    const sltUns = input.selectedUnits;
    
    // Add new stop command
    let stop = extend(UnitCommand, "stop", "none", u=>null, {
      localized: function(){
        return bun.get("svn.cmd.commandStop", "Stop");
      }
    });
    let ut, cmd, cmdt;
    for(let i in UnitTypes){
      ut = UnitTypes[i];
      if(ut instanceof UnitType){
        cmd = [];
        cmd.push(stop);
        for(let j in ut.commands){
          cmdt = ut.commands[j];
          if(cmdt != stop){
            cmd.push(cmdt);
          }
        }
        ut.commands = cmd;
      }
    }
    
    if(Vars.mobile){ // Mobile
      let cmd = findCommandButton();
      let par = cmd.parent;
      let uns, bul;
      
      hg["fill(arc.func.Cons)"](cont=>{
        cont.touchable = Touchable.childrenOnly;
        cont.bottom().left();
        cont.name = "svn-command-extended";
        cont.visibility = ()=>Vars.state.isGame() && !Vars.ui.minimapfrag.shown()
          && player.team().data().units["contains(arc.func.Boolf)"](u=>u.commandable);
        let assC = cont.table(Styles.black5).bottom().left().height(48).width(396).padLeft(0);
        let ass = assC.get();
        ass.touchable = Touchable.enabled;
        ass.visibility = ()=>input.mode == PlaceMode.none && input.selectPlans.isEmpty();
        let addAllUnique = function(s, t){
          let r = new Seq();
          t.each(u=>{
            if(s.addUnique(u)){
              r.add(u);
            }
          });
          return r;
        }
        let removeAll = function(s, t){
          let r = new Seq();
          // DO SOMETHING!!!
          return r;
        }
        let sltAllType = function(t, c){
          if(typeof t != "object" || (t != null && t.getClass && t.getClass() !== Seq)){
            t = null;
          }
          if(c == null || typeof c != "function"){
            c = _=>true;
          }
          let uns = new Seq();
          player.team().data().units.each(u=>{
            if((t == null || t.contains(u.type)) && u.isCommandable() && c(u)){
              uns.addUnique(u);
            }
          });
          return uns;
        };
        let sltScrType = function(t){
          return sltAllType(t, u=>{
            let pos = Core.input.mouseScreen(u.x, u.y);
            return pos.x >= 0 && pos.x <= Core.scene.viewport.getScreenWidth()
              && pos.y >= 0 && pos.y <= Core.scene.viewport.getScreenHeight();
          });
        };
        let sltAll = function(c){
          return sltAllType(0, c);
        };
        let sltScr = function(){
          return sltScrType();
        };
        let alu = ass.button(Icon.planet, ()=>{
          let uns = sltScr();
          let isScr = sltUns.containsAll(uns) || !uns.size;
          if(isScr){
            uns = sltAll();
          }
          let isAll = sltUns.containsAll(uns);
          if(uns.size && !isAll){
            global.svn.noti.add(bun.get(isScr ? "svn.cmd.selectAllMap" : "svn.cmd.selectAllScreen"));
            input.commandMode = true;
            sltUns.clear();
            addAllUnique(sltUns, uns);
            Events.fire(Trigger.unitCommandChange);
          }
        }).bottom().left().padLeft(6).size(50).growY().tooltip("Select all units").get();
        
        let alt = ass.button(Icon.units, ()=>{
          let ut = Seq();
          sltUns.each(u=>{
            ut.addUnique(u.type);
          });
          let uns = sltScrType(ut);
          let isScr = sltUns.containsAll(uns) || !uns.size;
          if(isScr){
            uns = sltAllType(ut);
          }
          let isAll = sltUns.containsAll(uns);
          if(uns.size && !isAll){
            global.svn.noti.add(bun.get(isScr ? "svn.cmd.selectTypeMap" : "svn.cmd.selectTypeScreen"));
            input.commandMode = true;
            addAllUnique(sltUns, uns);
            Events.fire(Trigger.unitCommandChange);
          }
        }).bottom().left().padLeft(6).size(50).growY().tooltip("Select by types").get();
        alt["setDisabled(arc.func.Boolp)"](()=>sltUns.isEmpty());
        
        let teams = [], tmp;
        let pat = new Table();
        pat.bottom().left();
        pat.height = Scl.scl(50);
        let teamBS = new TextButton.TextButtonStyle(Core.scene.getStyle(TextButton$TextButtonStyle));
        teamBS.checkedFontColor = Pal.accent;
        for(let i = 0; i < 9; ++i){
          let ii = i + 1;
          let units = new Seq();
          let islp = false;
          Events.on(WorldLoadEvent, () => {
            units.clear();
          });
          tmp = pat.button("" + ii, ()=>{
            if(islp){
              islp = false;
              return;
            }
            units["removeAll(arc.func.Boolf)"](u=>{
              return u.dead;
            });
            if(units.size){
              input.commandMode = true;
              sltUns.clear();
              addAllUnique(sltUns, units);
              Events.fire(Trigger.unitCommandChange);
            }
          }).bottom().left().size(50).growY().tooltip("Team " + ii);
          if(i != 0){
            tmp.padLeft(6);
          }
          let team = tmp.get();
          team.setProgrammaticChangeEvents(false);
          team.setStyle(teamBS);
          team.update(()=>{
            units["removeAll(arc.func.Boolf)"](u=>{
              return u.dead;
            });
            team.setChecked(!units.isEmpty());
          });
          team.addCaptureListener(extend(ElementGestureListener, {
            longPress: function(e, x, y){
              islp = true;
              if(!units.size && !sltUns.size){
                return;
              }
              units.clear();
              addAllUnique(units, sltUns);
              global.svn.noti.add(bun.format(units.size ? "svn.cmd.teamAssignedFormat" : "svn.cmd.teamClearedFormat", ii));
              return true;
            }
          }));
          teams.push({button: team, units: units});
        }
        let pan = new ScrollPane(pat);
        pan.setScrollingDisabledY(true);
        ass.add(pan).bottom().left().padLeft(6).height(50).growX();
        let hlp;
        ass.button("?", ()=>{
          if(!hlp || !hlp.parent){
            hlp = global.svn.noti.add(bun.get("svn.cmd.help"));
          }else{
            global.svn.noti.remove(hlp);
          }
        }).bottom().left().size(50).padLeft(6);
        ass.pack();
        
        cont.row();
        let empC = cont.add(new Element()).bottom().left().height(48); // On Queue button
        cont.row();
        let cmxC = cont.table(Styles.black5).bottom().left().height(48).padLeft(155);
        let cmx = cmxC.get();
        cmx.touchable = Touchable.enabled;
        cmx.visibility = ()=>input.commandMode;
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
                addAllUnique(uns, tmpuns);
              }else if(stt == -1){
                uns.removeAll(tmpuns);
                if(uns.size == 0){
                  stt = 0;
                }
              }
              sltUns.clear();
              addAllUnique(sltUns, uns);
              Events.fire(Trigger.unitCommandChange);
              evt = false;
            }
            uns = sltUns.copy();
          }catch(e){
            Log.err("command run unitcommand", e);
          }
        });
      });
    }else{ // Desktop
      
    }
  }catch(e){
    Log.err("command: " + e);
  }
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
  return findButton(TextButton, "command", "Command");
}

function findCancelButton(){
  return findButton(TextButton, "cancel", "Cancel");
}
function findButton(t, bt, dt, p){
  let txt = Core.bundle.get(bt, dt);
  if(!p || !(p instanceof Group)){
    p = Core.scene.root;
  }
  return p["find(arc.func.Boolf)"](e=>{
    return e instanceof t && e.getText() == txt;
  });
}