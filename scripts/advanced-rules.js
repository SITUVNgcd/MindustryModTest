try{
  Events.on(ClientLoadEvent, ()=>{
    try{
      // Advanced rules
      (function(){
        const mid = global.svn.util.field(Vars.ui.editor, "infoDialog").val;
        const crdE = global.svn.util.field(mid, "ruleInfo").val; // Editor rules
        const ptd = global.svn.util.field(Vars.ui.editor, "playtestDialog").val;
        const crdP = global.svn.util.field(ptd, "dialog").val; // Playtest rules
        const cgd = global.svn.util.field(Vars.ui.custom, "dialog").val;
        const crdG = global.svn.util.field(cgd, "dialog").val; // Custom game rules
        const crdAll = [crdE, crdP, crdG];
        let rules = null;
        const advDlg = new BaseDialog("@svn.advancedRules");
        advDlg.addCloseButton();
        const tbl = new Table().top().left();
        advDlg.cont.pane(tbl).scrollX(false).minWidth(300);
        const check = function(n, f){
          const res = tbl.check(n, f);
          cont.row();
          return res;
        }
        const lub = check("@svn.advancedRules.logicUnitBuild", c=>{
          rules.logicUnitBuild = c;
        });
        const ccp = check("@svn.advancedRules.coreCapture", c=>{
          rules.coreCapture = c;
        });
        const psa = check("@svn.advancedRules.possessionAllowed", c=>{
          rules.possessionAllowed = c;
        });
        const fsp = check("@svn.advancedRules.fire", c=>{
          rules.fire = c;
        });
        const upu = check("@svn.advancedRules.unitPayloadUpdate", c=>{
          rules.unitPayloadUpdate = c;
        });
        const ssp = check("@svn.advancedRules.showSpawns", c=>{
          rules.showSpawns = c;
        });
        const gbl = check("@svn.advancedRules.ghostBlocks", c=>{
          rules.ghostBlocks = c;
        });
        const dwp = check("@svn.advancedRules.disableWorldProcessors", c=>{
          rules.disableWorldProcessors = c;
        });
        const bdd = check("@svn.advancedRules.borderDarkness", c=>{
          rules.borderDarkness = c;
        });
        advDlg.shown(()=>{
          lub.checked(rules.logicUnitBuild);
          ccp.checked(rules.coreCapture);
          psa.checked(rules.possessionAllowed);
          fsp.checked(rules.fire);
          upu.checked(rules.unitPayloadUpdate);
          ssp.checked(rules.showSpawns);
          gbl.checked(rules.ghostBlocks);
          dwp.checked(rules.disableWorldProcessors);
          bdd.checked(rules.borderDarkness);
        });
        const advBtn= new TextButton("@svn.advancedRules");
        advBtn.getLabel().setWrap(false);
        advBtn.clicked(()=>{
          if(rules){
            advDlg.show();
          }
        });
        const resetTxt = Core.bundle.get("settings.reset"),
        infTxt = Core.bundle.get("rules.infiniteresources");
        const build = function(dlg){
          const cont = dlg.cont,
          main = global.svn.util.field(dlg, "main").val;
          rules = global.svn.util.field(dlg, "rules").val;
          const reset = main["find(arc.func.Boolf)"](e=>e instanceof TextButton && e.getText() == resetTxt);
          const inf = main["find(arc.func.Boolf)"](e=>e instanceof CheckBox && e.getText() == infTxt);
          const re = ()=>{
            build(dlg);
          };
          reset.changed(re);
          inf.changed(re);
          if(main){
            cont.clear();
            cont.add(advBtn).minWidth(200).expandX().height(50);
            cont.row();
            cont.pane(main).scrollX(false);
          }
        }
        const adv = extend(VisibilityListener, {
          handle: function(evt){
            if(!Core.settings.getBool("svn-map-advanced-rules")) return;
            if(evt instanceof VisibilityEvent && !evt.isHide()){
              const dlg = evt.targetActor || evt.listenerActor;
              if(dlg instanceof CustomRulesDialog){
                build(dlg);
              }
            }
          }
        });
        const advancedRules = function(dlg, show){
          dlg = global.svn.util.toArrayByType(dlg, CustomRulesDialog);
          if(typeof show !== "boolean"){
            show = !!show;
          }
          let res = 0, i, ii;
          for(i = 0; i < dlg.length; ++i){
            ii = dlg[i];
            if(show){
              res += ii.addListener(adv);
            }else{
              res += ii.removeListener(adv);
            }
          }
          return res;
        }
        const showAdvancedRules = function(show){
          if(arguments.length == 0){
            show = true;
          }
          return advancedRules(crdAll, show);
        }
        const hideAdvancedRules = function(){
          return showAdvancedRules(false);
        }
        showAdvancedRules();
        global.svn.misc.showAdvancedRules = showAdvancedRules;
        global.svn.misc.hideAdvancedRules = hideAdvancedRules;
      })();
    }catch(e){
      Log.err(module.id + ": " + e);
    }
  });
}catch(e){
  Log.err(module.id + ": " + e);
}