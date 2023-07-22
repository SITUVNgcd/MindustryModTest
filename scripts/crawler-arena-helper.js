try{
  global.svn.cah = {};
  let w, hg;
  global.svn.evt.load(() => {
    hg = Vars.ui.hudGroup;
    hg.addChild(w);
  });
  const cmdPrefix = "/";
  const ulist = "upgrades";
  const uto = "upgrade";
  let buildArgs = function(cmd){
    const args = arguments;
    if(args.length < 1){
      return "";
    }
    let res = cmdPrefix;
    res += cmd;
    let len = args.length;
    if(len > 1){
      for(let i = 1; i < len; ++i){
        res += " " + args[i];
      }
    }
    return res;
  }
  w = new WidgetGroup();
  w.visibility = ()=>Vars.ui.hudfrag.shown && !Vars.ui.minimapfrag.shown()
    && Core.settings.getBool("svn-crawler-arena-helper") ;//&& Vars.net.active();
  w.setFillParent(true);
  w.touchable = Touchable.childrenOnly;
  w.name = "svn-crawler-arena-helper";
  global.svn.cah.ele = w;
}catch(e){
  Log.err(module.id + ": " + e);
}