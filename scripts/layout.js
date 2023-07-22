try{
  global.svn.evt.load(()=>{
    try{
      const hg = Vars.ui.hudGroup;
      const createTable = a=>{
        const tbl = new Table();
        tbl.setFillParent(true);
        tbl.toFront();
        tbl.align(a);
        const con = tbl.add(new Table()).align(a);
        hg.addChild(tbl);
        return con.get();
      }
      const tblTL = createTable(Align.topLeft), tblT = createTable(Align.top), tblTR = createTable(Align.topRight),
      tblL = createTable(Align.left), tblC = createTable(Align.center), tblR = createTable(Align.right),
      tblBL = createTable(Align.bottomLeft), tblB = createTable(Align.bottom), tblBR = createTable(Align.bottomRight);
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