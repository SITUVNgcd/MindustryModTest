try{
  global.svn.advRules = {};
  global.svn.evt.load(()=>{
    try{
      // Advanced rules
      (function(){
        const mid = global.svn.util.field(Vars.ui.editor, "infoDialog").val;
        const crdE = global.svn.util.field(mid, "ruleInfo").val; // Editor rules
        const ptd = global.svn.util.field(Vars.ui.editor, "playtestDialog").val;
        const crdP = global.svn.util.field(ptd, "dialog").val; // Playtest rules
        const cgd = global.svn.util.field(Vars.ui.custom, "dialog").val;
        const crdG = global.svn.util.field(cgd, "dialog").val; // Custom game rules
        const crdC = new CustomRulesDialog();
        const crdAll = [crdE, crdP, crdG, crdC];
        let rules = null;
        const svnAdv = "@svn.advancedRules", svnAdvD = svnAdv + ".";
        const advDlg = new BaseDialog(svnAdv);
        advDlg.addCloseButton();
        const tbl = new Table().top().left();
        advDlg.cont.pane(tbl).top().left().scrollX(false).minWidth(300);
        const check = function(n, f){
          const res = tbl.check(svnAdvD + n, f).top().left().pad(5);
          tbl.row();
          return res;
        }
        const button = function(n, f){
          const res = tbl.button(svnAdvD + n, f).top().left().pad(5).fillX();
          tbl.row();
          return res;
        }
        const selectContent = function(n, t, f){
          return button(n, ()=>{
            let res = global.svn.util.call(crdE, "showBanned", svnAdvD + n, t, rules[n], extend(Packages.arc.func.Boolf, {
              get: function(t){
                return f(t);
              }
            }));
          });
        }
        const lub = check("logicUnitBuild", c=>rules.logicUnitBuild = c);
        const psa = check("possessionAllowed", c=>rules.possessionAllowed = c);
        const upu = check("unitPayloadUpdate", c=>rules.unitPayloadUpdate = c);
        const ssp = check("showSpawns", c=>rules.showSpawns = c);
        const gbl = check("ghostBlocks", c=>rules.ghostBlocks = c);
        const bdd = check("borderDarkness", c=>rules.borderDarkness = c);
        const rbl = selectContent("revealedBlocks", ContentType.block, t=>true);
        const hbi = selectContent("hiddenBuildItems", ContentType.item, t=>true);
        advDlg.shown(()=>{
          if(rules){
            lub.checked(rules.logicUnitBuild);
            psa.checked(rules.possessionAllowed);
            upu.checked(rules.unitPayloadUpdate);
            ssp.checked(rules.showSpawns);
            gbl.checked(rules.ghostBlocks);
            bdd.checked(rules.borderDarkness);
          }
        });
        
        const vl = extend(VisibilityListener, {
          handle: function(evt){
            if(!Core.settings.getBool("svn-map-advanced-rules")) return;
            if(evt instanceof VisibilityEvent && !evt.isHide()){
              const dlg = evt.targetActor || evt.listenerActor;
              if(dlg instanceof CustomRulesDialog){
                rules = global.svn.util.field(dlg, "rules").val;
              }
            }
          }
        });
        
        const addAdvancedRules = function(dlg){
          dlg = global.svn.util.toArrayByType(dlg, CustomRulesDialog);
          let res = 0, i, ii;
          for(i = 0; i < dlg.length; ++i){
            ii = dlg[i];
            ii.buttons.row();
            ii.buttons.button("@svn.advancedRules", ()=>{
              advDlg.show();
            });
            ii.addListener(vl);
          }
          return dlg.length;
        }
        const showCustomRules = function(rules){
          if(!rules || !(rules instanceof Rules)){
            rules = Vars.state.rules;
          }
          crdC.show(rules, ()=>rules.copy());
        }
        addAdvancedRules(crdAll);
        global.svn.advRules.addAdvancedRules = addAdvancedRules;
        global.svn.advRules.showCustomRules = showCustomRules;
      })();
    }catch(e){
      Log.err(module.id + ": " + e);
    }
  });
}catch(e){
  Log.err(module.id + ": " + e);
}