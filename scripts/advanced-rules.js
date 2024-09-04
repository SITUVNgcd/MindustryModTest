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
          if(!f || typeof f !== "function"){
            f = c=>rules[n] = c;
          }
          const res = tbl.check(svnAdvD + n, f).top().left().pad(5);
          tbl.row();
          return res;
        }
        const button = function(n, f){
          if(!f || typeof f !== "function"){
            f = ()=>{};
          }
          const res = tbl.button(svnAdvD + n, f).top().left().pad(5).fillX();
          tbl.row();
          return res;
        }
        const selectContent = function(n, t, f){
          if(!f || typeof f !== "function"){
            f = t=>true;
          }
          return button(n, ()=>{
            let res = global.svn.util.call(crdE, "showBanned", svnAdvD + n, t, rules[n], extend(Packages.arc.func.Boolf, {
              get: function(t){
                return f(t);
              }
            }));
          });
        }
        try{
          const BOOL = {
            pvp: check("pvp"),
            pvpAutoPause: check("pvpAutoPause"),
            canGameOver: check("canGameOver"),
            possessionAllowed: check("possessionAllowed"),
            unitPayloadUpdate: check("unitPayloadUpdate"),
            showSpawns: check("showSpawns"),
            ghostBlocks: check("ghostBlocks"),
            logicUnitBuild: check("logicUnitBuild"),
            coreDestroyClear: check("coreDestroyClear"),
            borderDarkness: check("borderDarkness"),
            staticFog: check("staticFog"),
            disableOutsideArea: check("disableOutsideArea")
          };
          const OBJ = {
            revealedBlocks: selectContent("revealedBlocks", ContentType.block),
            hiddenBuildItems: selectContent("hiddenBuildItems", ContentType.item)
          };
          // TeamRules teams
          // float dragMultiplier
          // int env
          // Attributes attributes
          // Sector sector
          // ObjectSet<String> researched 
          // Color staticColor
          // Color dynamicColor
          // Color cloudColor
          // @Nullable String modeName
          // @Nullable String mission 
          // StringMap tags
          // @Nullable String customBackgroundCallback
          // @Nullable String backgroundTexture
          // float backgroundSpeed
          // float backgroundScl
          // float backgroundOffsetX
          // float backgroundOffsetY
          // @Nullable PlanetParams planetBackground
          
          advDlg.shown(()=>{
            if(rules){
              Object.keys(BOOL).forEach(k=>{
                BOOL[k].checked(rules[k]);
              });
            }
          });
        }catch(e){
          Log.err(e);
        }
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