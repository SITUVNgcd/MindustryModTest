Events.on(ClientLoadEvent, ()=>{
  try{
    const settings = Vars.ui.settings;
    const bd = Core.bundle;
    settings.addCategory("@setting.svn-settings.name", st=>{
      if(Vars.mobile){
        st.checkPref("svn-system-log", false);
        st.checkPref("svn-console", false);
        st.checkPref("svn-console-use-runConsole", false);
        st.checkPref("svn-force-show-item-info", false);
        st.checkPref("svn-force-show-boss-info", false);
        st.checkPref("svn-tile-block-unit-info", false);
        st.checkPref("svn-chat-command-helper", false);
        st.checkPref("svn-crawler-arena-helper", false);
        st.sliderPref("svn-min-zoom", Vars.renderer.minZoom, 0.1, 10, 0.1, v=>{
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
    Log.err("settings: " + e);
  }
});