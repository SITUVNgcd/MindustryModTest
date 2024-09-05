try{
  const hud = global.svn.util.hud;
  const net = global.svn.util.net;
  const defVis = ()=>net();
  global.svn.qc = {};
  const QuickChat = function(bs, ipr, name, bg){
    if(typeof bs != "number" || bs < 0){
      bs = 50;
    }
    if(typeof ipr != "number" || ipr < 1){
      ipr = 2;
    }
    this.bs = bs;
    this.ipr = ipr;
    const tbl = new Table();
    if(bg && bg instanceof Drawable){
      tbl.background(bg);
    }
    tbl.name = typeof name == "string" && name || "svn-quick-chat";
    tbl.visibility = ()=>hud() && net();
    Object.defineProperty(this, "tbl", {value: tbl, writable: false});
    Object.defineProperty(this, "items", {value: new Seq(), writable: false});
  }
  QuickChat.prototype.add = function(val, msg, vis){
    let res;
    if(val instanceof Element){
      res = this.tbl.add(val).height(this.bs).get();
    }else{
      if(typeof val == "string" || val instanceof Drawable){
        res = this.tbl.button(val, (val instanceof Drawable ? Styles.flati : Styles.flatt), ()=>{
          let ret = msg;
          if(typeof msg == "function"){
            ret = msg();
          }
          if(ret && typeof ret == "string" && ret != ""){
            Call.sendChatMessage(ret);
          }
        }).size(this.bs).get();
      }
    }
    if(res && res instanceof Element){
      if(typeof vis != "function"){
        vis = defVis;
      }
      res.visibility = vis;
      this.items.add(res);
      if(this.items.size % this.ipr == 0){
        this.tbl.row();
      }
      this.tbl.pack();
    }
    return res;
  }
  QuickChat.prototype.addEmpty = function(){
    this.items.add(this.tbl.add(new Element()).size(this.bs).get());
    if(this.items.size % this.ipr == 0){
      this.tbl.row();
    }
  }
  QuickChat.prototype.buttonSize = function(bs){
    if(arguments.length > 0 && typeof bs == "number" && bs > 0){
      this.bs = bs;
      this.repack();
    }
    return this.bs;
  }
  QuickChat.prototype.itemsPerRow = function(ipr){
    if(arguments.length > 0 && typeof ipr == "number" && ipr > 0){
      this.ipr = ipr;
      this.repack();
    }
    return this.ipr;
  }
  QuickChat.prototype.repack = function(){
    const tbl = this.tbl;
    const ite = this.items;
    let c = 0;
    tbl.clearChildren();
    for(let i = 0; i < ite.size; ++i){
      tbl.add(ite.get(i)).size(this.bs); // BUG
      ++c;
      if(c % this.ipr == 0){
        tbl.row();
      }
    }
    tbl.pack();
  }
  QuickChat.prototype.clear = function(){
    if(this.items.size > 0){
      this.items.clear();
      this.tbl.clearChildren();
      this.tbl.pack();
      return true;
    }
    return false;
  }
  global.svn.qc.QuickChat = QuickChat;
}catch(e){
  Log.err(module.id + ": " + e);
}