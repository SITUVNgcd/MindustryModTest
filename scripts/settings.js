try{
  const section = function(n, h){
    if(typeof n != "string"){
      n = "";
    }
    if(typeof h != "number" || h < 0){
      h = 10;
    }
    let res =  extend(SettingsMenuDialog.SettingsTable.Setting, n, {
      height: h,
      add: function(tbl){
        if(this.name == ""){
          tbl.image(Tex.clear).height(this.height).padTop(3);
        }else{
          tbl["table(arc.func.Cons)"](t=>{
            t.add(this.title).padTop(3);
          }).get().background(Tex.underline);
        }
        tbl.row();
      }
    });
    return res;
  }
  Events.on(ClientLoadEvent, () => {
    try{
      const settings = Vars.ui.settings;
      const bd = Core.bundle;
      settings.addCategory("@setting.svn-settings.name", st=>{
        if(Vars.mobile){
          st.pref(section("svn-section-console"));
          st.checkPref("svn-system-log", false);
          st.checkPref("svn-console", false);
          st.checkPref("svn-console-use-runConsole", false);
          st.pref(section("svn-section-chat"));
          st.checkPref("svn-chat-support", false);
          st.pref(section("svn-section-misc"));
          st.checkPref("svn-time-control", false);
          st.checkPref("svn-force-show-item-info", false);
          st.checkPref("svn-force-show-boss-info", false);
          st.checkPref("svn-tile-block-unit-info", false);
          st.checkPref("svn-chat-command-helper", false);
          st.checkPref("svn-crawler-arena-helper", false);
          st.checkPref("svn-unlimit-payload-cap", false);
          st.sliderPref("svn-min-zoom", Vars.renderer.minZoom, 1, 100, 1, v=>{
            v = v / 10;
            Vars.renderer.minZoom = v;
            return v;
          });
          st.sliderPref("svn-max-zoom", Vars.renderer.maxZoom, 10, 100, 1, v=>{
            Vars.renderer.maxZoom = v;
            return v;
          });
        }
      });
    }catch(e){
      Log.err(module.id + ": " + e);
    }
  });
}catch(e){
  Log.err(module.id + ": " + e);
}