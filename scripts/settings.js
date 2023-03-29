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
        st.checkPref("svn-crawler-arena-helper", false);
      }
    });
  }catch(e){
    Log.err("settings: " + e);
  }
});