try{
  global.svn.evt.load(()=>{
    try{
      const hg = Vars.ui.hudGroup;
      const createTable = a=>{
        const tbl = new Table();
        tbl.setFillParent(true);
        tbl.toFront();
        tbl.align(a);
        const con = new Table().align(a);
        tbl.add(con).align(a).grow();
        hg.addChild(tbl);
        return con;
      }
      const tblTL = createTable(Align.topLeft), tblT = createTable(Align.top), tblTR = createTable(Align.topRight),
      tblL = createTable(Align.left), tblC = createTable(Align.center), tblR = createTable(Align.right),
      tblBL = createTable(Align.bottomLeft), tblB = createTable(Align.bottom), tblBR = createTable(Align.bottomRight);
      const tbs = [tblTL, tblT, tblTR, tblL, tblC, tblR, tblBL, tblB, tblBR];
      const take = (p, b)=>{
        const tbl = new Table();
        p = tbs[p];
        const al = p.getAlign();
        p.add(tbl).growX().align(al);
        p.row();
        tbl.align(al);
        const res = b && b instanceof Drawable ? new Table(b) : new Table();
        tbl.add(res).align(al);
        if(typeof b === "function"){
          b(res);
        }
        return res;
      }
      const layout = {};
      layout.topLeft = function(b){
        return take(0, b);
      }
      layout.top = function(b){
        return take(1, b);
      }
      layout.topRight = function(b){
        return take(2, b);
      }
      layout.left = function(b){
        return take(3, b);
      }
      layout.center = function(b){
        return take(4, b);
      }
      layout.right = function(b){
        return take(5, b);
      }
      layout.bottomLeft = function(b){
        return take(6, b);
      }
      layout.bottom = function(b){
        return take(7, b);
      }
      layout.bottomRight = function(b){
        return take(8, b);
      }
      
      layout.floatDlg = function(bg, mw, mh, pa){
        const hg = Vars.ui.hudGroup;
        const p = new Table();
        p.setFillParent(true);
        const tbl = new Table();
        tbl.background(bg && bg instanceof Drawable ? bg : Tex.buttonTrans);
        tbl.toFront();
        hg.addChild(p);
        if(typeof mw !== "number" || mw < 0){
          mw = 200;
        }
        if(typeof mh !== "number" || mh < 0){
          mh = 300;
        }
        if(typeof pa !== "number" || pa < 0){
          pa = 100;
        }
        p.add(tbl).minWidth(mw).minHeight(mh).pad(pa).margin(10);
        const top = new Table(), mid = new Table(), bot = new Table();
        //tbl.touchable = Touchable.enabled;
        tbl.add(top).growX().top().minHeight(60);
        tbl.row();
        tbl.image(Tex.whiteui, Pal.accent).growX().height(3).pad(6);
        tbl.row();
        tbl.add(mid).grow();
        tbl.row();
        tbl.image(Tex.whiteui, Pal.accent).growX().height(3).pad(6);
        tbl.row();
        tbl.add(bot).growX().bottom().minHeight(60);
        const res = {};
        res.vis = false;
        res.show = ()=>res.vis = true;
        res.hide = ()=>res.vis = false;
        res.toggle = ()=>res.vis = !res.vis;
        res.top = top;
        res.mid = mid;
        res.bot = bot;
        p.visibility = ()=>res.vis;
        return res;
      }
      layout.baseDlg = function(tit){
        if(!tit || typeof tit !== "string"){
          tit = "";
        }
        const dlg = layout.floatDlg();
        const lbl = new Label(tit);
        const but = new Table();
        const titf = t=>{
          if(typeof t === "string"){
            lbl.setText(t);
          }
        }
        lbl.getStyle().fontColor = Pal.accent;
        lbl.setAlignment(Align.center);
        dlg.tit = titf;
        dlg.cont = dlg.mid;
        dlg.buttons = but;
        dlg.top.add(lbl).growX().center().pad(6);
        dlg.bot.add(but).growX().row();
        dlg.bot.button("@svn.button.hide", Icon.eyeOff, ()=>{dlg.hide()}).minWidth(200);
        delete dlg.top;
        delete dlg.mid;
        delete dlg.bot;
        return dlg;
      }
      
      global.svn.layout = layout;
    }catch(e){
      Log.err(module.id + ": " + e);
    }
  });
}catch(e){
  Log.err(module.id + ": " + e);
}