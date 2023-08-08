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
  
  const teamChooser = function(fil, clk, upd, ipr){
    if(typeof ipr !== "number" || ipr < 1){
      ipr = 8;
    }
    const cont = new Table();
    const butG = new ButtonGroup();
    let ts = Team.all;
    if(typeof fil === "function"){
      ts = ts.filter(fil);
    }
    let b, i, bc;
    for(i = 0; i < ts.length; ++i){
      let team = ts[i];
      b = new ImageButton(Tex.whiteui, Styles.clearNoneTogglei);
      b.margin(4);
      b.getImageCell().grow();
      b.getStyle().imageUpColor = team.color;
      if(typeof clk === "function"){
        b.clicked(()=>{
          clk(team, i);
        });
      }
      bc = cont.add(b).size(50).group(butG);
      if(typeof upd === "function"){
        bc.checked(()=>{
          return upd(team, i);
        });
      }
      if(i % ipr == (ipr - 1)){
        cont.row();
      }
    }
  }
  global.svn.ele.teamChooser = teamChooser;
}catch(e){
  Log.err(module.id + ": " + e);
}