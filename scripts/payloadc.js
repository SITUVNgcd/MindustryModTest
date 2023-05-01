try{
  global.svn.payloadc = {};
  const PayCtrl = function(un, is){
    un = (un instanceof Unit || un instanceof Player) ? un : null;
    this.un = un;
    this.is = is || 46;
    this.func = null;
    this.up = true;
  }
  PayCtrl.prototype.unit = function(un){
    if(arguments.length > 0){
      if((un instanceof Unit || un instanceof Player) && this.un != un){
        this.un = un;
        this.up = true;
      }
    }
    return this.un instanceof Player ? this.un.unit() : this.un;
  }
  PayCtrl.prototype.imgSize = function(is){
    if(arguments.length > 0){
      if(typeof is != "number" || is < 1){
        is = 46;
      }
      if(this.is != is){
        this.is = is;
        this.up = true;
      }
    }
    return this.is;
  }
  PayCtrl.prototype.update = function(f){
    if(typeof f == "function" && this.func != f){
      this.func = f;
    }
    return this.func;
  }
  PayCtrl.prototype.end = function(){
    if(this.tbl){
      this.tbl.remove();
      this.tbl.visible = false;
      return true;
    }
    return false;
  }
  PayCtrl.prototype.run = function(){
    if(this.tbl){
      this.tbl.visible = true;
      return this.tbl;
    }
    const tbl = new Table();
    tbl.name = "svn-payload-control";
    const self = this;
    let pc = null, u;
    let vis, pu, pl, imgSize, rt;
    let i, j, k;
    tbl.update(()=>{
      const f = self.func;
      f && typeof f == "function" && f.call(self, self);
      u = self.unit();
      if(pu != u){
        pu = u;
        self.up = true;
      }
      vis = u && u instanceof Payloadc && u.payloads.size != 0 && !u.dead;
      if(!vis){
        tbl.clearChildren();
        return;
      }
      pl = u.payloads;
      if((pl && !pl.equals(pc)) || self.up){
        pc = pl.copy();
        self.up = false;
        imgSize = self.imgSize();
        tbl.clearChildren();
        for(i = 0; i < pl.size; ++i){
          const pli = pl.get(i), cont = pli.content();
          let ico = null, bld, blk, unit;
          if(cont instanceof Block){
            bld = pli.build,
            blk = pli.block();
            ico = cont.drawer && cont.drawer.preview || bld.displayIcon;
          }else if(cont instanceof UnitType){
            unit = pli.unit;
          }
          if(ico == null){
            ico = cont.fullIcon || cont.uiIcon || Icon.none;
          }
          const imgBtn = new ImageButton(ico);
          const img = imgBtn.getImage();
          const rd = blk && blk.rotate ? 1 : 90;
          const rf = rd * 4;
          imgBtn.update(()=>{
            
          });
          img.update(()=>{
            rt = 0;
            if(blk){
              rt = bld.rotation * 90 / rd - (90 * !blk.rotate);
            }else if(unit){
              rt = u.rotation - 90;
            }
            img.setRotationOrigin(rt, Align.center);
          });
          imgBtn.clicked(()=>{
            if(blk){
              if(blk.rotate){
                Call.rotateBlock(u.player, bld, true);
              }else{
                bld.rotation = (bld.rotation + rd) % rf;
              }
            }
          });/*
          imgBtn.addListener(extend(ElementGestureListener, {
            pan: function(e, x, y, dx, dy){
              const xc = imgBtn.width / 2, yc = imgBtn.height / 2,
              vec = new Vec2(x - xc, y - yc), ang = vec.angle();
              img.setRotationOrigin(ang - 90, Align.center);
            }
          }));*/
          imgBtn.resizeImage(imgSize);
          imgBtn.pack();
          tbl.add(imgBtn);
        }
      }
      tbl.pack();
    });
    Object.defineProperty(this, "tbl", {value: tbl, writable: false});
    return this.tbl;
  }
  global.svn.payloadc.PayCtrl = PayCtrl;
}catch(e){
  Log.err(module.id + ": " + e);
}