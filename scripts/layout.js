try{
  global.svn.evt.load(()=>{
    try{
      const hg = Vars.ui.hudGroup;
      const createTable = ()=>{
        const tbl = new Table();
        tbl.setFillParent(true);
        tbl.toFront();
        hg.addChild(tbl);
        return tbl.add(new Table());
      }
      const tblTL = createTable().top().left().get(), tblT = createTable().center().top().get(), tblTR = createTable().top().right().get(),
      tblL = createTable().center().left().get(), tblC = createTable().center().get(), tblR = createTable().center().right().get(),
      tblBL = createTable().bottom().left().get(), tblB = createTable().center().bottom().get(), tblBR = createTable().bottom().right().get();
      const tbs = [tblTL, tblT, tblTR, tblL, tblC, tblR, tblBL, tblB, tblBR];
      const take = p, b=>{
        const tbl = b && b instanceof Drawable ? new Table(b) : new Table();
        tbs[p].add(tbl);
        tbs.row();
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
  }
}catch(e){
  Log.err(module.id + ": " + e);
}