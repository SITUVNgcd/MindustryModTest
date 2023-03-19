Events.on(ClientLoadEvent, ()=>{
  const settings = Vars.ui.settings;
  const bd = Core.bundle;
  settings.addCategory(bd.get("situvngcd.settings", "SITUVNgcd"), st=>{
    st.checkPref(bd.get("situvngcd.settings.xxx", "xxx"), false);
  });
});