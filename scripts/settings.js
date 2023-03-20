Events.on(ClientLoadEvent, ()=>{
  const settings = Vars.ui.settings;
  const bd = Core.bundle;
  settings.addCategory("@setting.svn-settings.name", st=>{
    if(Vars.mobile){
      st.checkPref("svn-console", false);
      st.checkPref("svn-force-show-item-info", false);
      st.checkPref("svn-force-show-boss-info", false);
      st.checkPref("svn-tile-block-unit-info", false);
    }
  });
});