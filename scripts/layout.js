try{
  global.svn.evt.load(()=>{
    try{
      const hg = Vars.ui.hudGroup;
      const createTable = (x, y)=>{
        const tbl = new Table();
        tbl.setFillParent(true);
        tbl.toFront();
        const con = tbl.add(new Table());
        if(x == 1 || y == 1){
          tbl.center();
        }
        if(x == 2){
          tbl.right();
        }else{
          tbl.left();
        }
        if(y == 2){
          tbl.top();
        }else{
          tbl.bottom();
        }
        hg.addChild(tbl);
        return con.get();
      }
      const tblTL = createTable(0, 2), tblT = createTable(1, 2); tblTR = createTable(2, 2);
      tblL = createTable(0, 1), tblC = createTable(1, 1), tblR = createTable(2, 1);
      tblBL = createTable(0, 0), tblB = createTable(1, 0), tblBR = createTable(2, 0);
      const tbs = [tblTL, tblT, tblTR, tblL, tblC, tblR, tblBL, tblB, tblBR];
      const take = (p, b)=>{
        const tbl = b && b instanceof Drawable ? new Table(b) : new Table();
        p = tbs[p];
        p.add(tbl);
        p.row();
        if(typeof b === "function"){
          b(tbl);
        }
        return tbl;
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
      global.svn.layout = layout;
    }catch(e){
      Log.err(module.id + ": " + e);
    }
  });
}catch(e){
  Log.err(module.id + ": " + e);
}