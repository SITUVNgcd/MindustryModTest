Events.on(ClientLoadEvent, ()=>{
  const settings = Vars.ui.settings;
  const bd = Core.bundle;
  settings.addCategory("@setting.svn-settings.name", st=>{
    st.checkPref("svn-console", false);
  });
});