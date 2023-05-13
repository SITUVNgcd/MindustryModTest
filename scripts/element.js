try{
  global.svn.ele = {};
  const ibs = new ImageButton.ImageButtonStyle(Icon.upOpen, null, Icon.downOpen, null, null, null);
  const expand = function(tt, bg, def){
    const exp = new Table(), con = new Table(), col = new Collapser(con, true), tog = new ImageButton(ibs);
    const tbl = extend(Table, {
      cont: con,
      name: "expand",
    });
    if(!(tt instanceof Element)){
      tt = new Label(tt.toString());
    }
    if(bg instanceof Drawable){
      tbl.background(bg);
    }
    if(typeof def == "number"){
      def = !!def;
    }
    if(typeof def != "boolean"){
      def = false;
    }
    let stt = def, ptt = null, tit;
    tbl.add(top).height(50).growX();
    tbl.row();
    tbl.add(col).growX();
    tit = top.add(tt).left().height(50).padLeft(6).growX().get();
    top.add(tog).right().size(50);
    
    top.clicked(()=>{
      ptt = stt;
      stt = !stt;
    });
    top.update(()=>{
      if(ptt !== stt){
        ptt = stt;
        col.setCollapsed(!stt);
        tog.setChecked(stt);
        if(tt instanceof Button){
          tt.setChecked(stt);
        }
      }
    });
    return tbl;
  }
  
  global.svn.ele.expand = expand;
}catch(e){
  Log.err(module.id + ": " + e);
}