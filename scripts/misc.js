try{
  global.svn.misc = {};
  const st = Core.settings, bun = Core.bundle;
  Vars.renderer.minZoom = st.getInt("svn-min-zoom", 2) / 10;
  Vars.renderer.maxZoom = st.getInt("svn-max-zoom", 15);
  Vars.maxSchematicSize = 256;
  let i, tmp, tmp2, tmp3;
  global.svn.evt.load(()=>{
    try{
      const field = global.svn.util.field;
      let dis = Touchable.disabled;
      let hf = Vars.ui.hudfrag;
      let [hg, fe] = [Vars.ui.hudGroup, "find(arc.func.Boolf)"];
      
      let ci = hg.find("coreinfo");
      global.svn.util.setTouchable(ci, dis);
      
      let cid = ci[fe](e=>{
        return e instanceof Collapser && e[fe](f=>f instanceof CoreItemsDisplay) != null;
      });
      cid.setCollapsed(()=> !(hf.shown && st.getBool("svn-force-show-item-info") || st.getBool("coreitems") || (Vars.mobile && !Core.graphics.isPortrait())) );
      
      let boss = ci.find("boss");
      const bv = boss.visibility;
      boss.visibility=()=>hf.shown && (st.getBool("svn-force-show-boss-info") || Vars.state.teams.bosses.size != 0 || bv.get());
      
      let tc = new global.svn.timeCtrl.TimeCtrl();
      let tct = tc.run();
      tct.setPosition(0, 120);
      const tctv = tct.visibility;
      tct.visibility = ()=> hf.shown && Core.settings.getBool("svn-time-control") && tctv.get();
      hg.addChild(tct);
      global.svn.misc.tc = tc;
      
      // Payload
      (function(){
        let conU = Vars.content.units();
        let tmpU;
        let pays = [];
        for(i = 0; i < conU.size; ++i){
          tmpU = conU.get(i);
          if(tmpU.sample instanceof Payloadc){
            pays.push({type: tmpU, cap: tmpU.payloadCapacity});
          }
        }
        let unlimit = function(){
          for(i of pays){
            i.type.payloadCapacity = Infinity;
          }
        }
        let limit = function(){
          for(i of pays){
            i.type.payloadCapacity = i.cap;
          }
        }
        let upc = 0;
        const upcR = ()=>{
          tmp = st.getBool("svn-unlimit-payload-cap");
          if(upc != tmp){
            upc = tmp;
            if(upc){
              unlimit();
            }else{
              limit();
            }
          }
        }
        upcR();
        Events.run(Trigger.update, upcR);
      })();
      
      
      // Greeting
      (function(){
        const [pls, scm] = [global.svn.players, global.svn.util.sendChatMessage];
        
        let wait = false, t;
        pls.selfJoin(function(){
          wait = true;
          t = new Thread(()=>{
            Thread.sleep(2000);
            wait = false;
            let tmp = "selfJoin:";
            for(i = 0; i < this.cur.size; ++i){
              tmp += "\n    " + this.cur.get(i).coloredName();
            }
            Log.info(tmp);
          }, "selfJoinWait");
          t.setDaemon(true);
          t.start();
        });
        
        const evt = function(t, grt){
          return p=>{
            if(wait) return;
            tmp = t + ":";
            for(i = 0; i < p.size; ++i){
              tmp += "\n    " + p.get(i).coloredName();
            }
            Log.info(tmp);
            if(st.getBool("svn-greet-msg")){
              tmp = grt + " ";
              for(i = 0; i < p.size; ++i){
                tmp2 = p.get(i);
                if(tmp2.isLocal()){
                  continue;
                }
                tmp2 = tmp2.coloredName() + "[]";
                tmp3 = i < p.size - 1 ? 4 : 1;
                if(tmp.length + tmp2.length + tmp3 <= Vars.maxTextLength){
                  tmp += tmp2;
                  if(i < p.size - 1){
                    tmp += ", ";
                  }else{
                    tmp += ".";
                  }
                }else{
                  tmp += ",...";
                  break;
                }
              }
              scm(tmp, 1111);
            }
          }
        }
        
        const pj = evt("join", "Welcome!");
        const pb = evt("back", "Welcome back!");
        const pl = evt("leave", "Bye and see you again!");
        pls.playerJoin(pj);
        pls.playerBack(pb);
        pls.playerLeave(pl);
      })();
      
      // Map export TODO
      (function(){
        let exportMap = function(map){
          if(!map){
            return;
          }
          let mf = map.file;
          if(!mf || !mf.exists()){
            Vars.ui.showInfo("@svn.map.file.notExists");
            return;
          }
          Vars.platform.showFileChooser(false, Core.bundle.get("svn.map.export") , "msav" , f=>{
            try{
              mf.copyTo(f);
            }catch(e){
              Vars.platform.shareFile(mf);
            }
          });
        }
      })();
      
      // Build logger TODO
      (function(){
        importPackage(Packages.mindustry.world.blocks);
        let bbe = new Seq();
        Events.on(WorldLoadEvent, e=>{
          bbe = new Seq();
        });
        let BuildData = function(be, time, team, play, unit, br, tile){
          this.be = be;
          this.time = time;
          this.team = team;
          this.play = play;
          this.unit = unit;
          this.br = br;
          // Save tile history
          this.floor = tile.floor();
          this.overlay = tile.overlay();
          this.block = tile.block();
          this.build = tile.build;
          this.tile = tile;
        }
        BuildData.prototype.toString = function(){
          if(!this.ts){ // Cache
            try{
              let tt = this.time;
              let s = Math.floor(tt % 60); s = s < 10 ? "0" + s: s;
              let m = Math.floor(tt / 60 % 60); m = m < 10 ? "0" + m : m;
              let h = Math.floor(tt / 60 / 60); h = h < 10 ? "0" + h : h;
              let time = h + ":" + m + ":" + s;
              let team = this.team instanceof Team ? this.team.coloredName() : "no team";
              let pln = this.play instanceof Player ? this.play.coloredName() : "";
              let unit = this.unit instanceof Unit ? this.unit.toString() : "unknown unit";
              let mode = this.br ?  "[red]deconstruct" : "[accent]construct";
              mode += (this.be ? "ing" : "ed") + "[]"; // NO NO NO!
              let block = this.build instanceof ConstructBlock$ConstructBuild  ? this.build.current : this.block;
              let bName = "no block";
              let bCode = "";
              if(block != Blocks.air){
                bName = block.localizedName;
                bCode = block.name;
              }
              let x = this.tile.x;
              let y = this.tile.y;
              this.ts = java.lang.String.format("[[%s]%s: %s [white](%s) %s %s (%s) at (%.0f, %.0f), %s",
              time, team, pln, unit, mode, bName, bCode, x, y, this.tile);
            }catch(e){
              this.ts = e.toString(); // WTF!
            }
          }
          return this.ts;
        }
        let doEvt = function(e){
          if(!Core.settings.getBool("svn-build-log")){
            return;
          }
          let be = 0;
          if(e instanceof BlockBuildBeginEvent){
            be = 1;
          }
          let u = e.unit;
          let ctrl = u.controller();
          let pler = u.isPlayer();
          if(ctrl && pler){
            let bd = new BuildData(be, Vars.state.tick / 60, e.team, ctrl, u, e.breaking, e.tile);
            bbe.add(bd);
            if(Core.settings.getBool("svn-build-log-show-in-console")){
              Log.info(bd.toString());
            }
          }
        }
        Events.on(BlockBuildBeginEvent, e=>{
          doEvt(e);
        });
        Events.on(BlockBuildEndEvent, e=>{
          doEvt(e);
        });
        
        let findBuildData = function(q){
          let fr = bbe.select(v=>{
            if(v instanceof BuildData){
              // TODO
            }
            return false;
          });
          
        }
      })();
      
      // Content list
      (()=>{ // Lambda
        let showList = function(data, selected, done, error, close, title, getString, custom, helpText){
          let typ = typeof data;
          if(typ == "object" && typ != "string" && !(data instanceof java.lang.String) && !(data instanceof Seq)){
            var {data, selected, done, error, close, title, getString, helpText} = data;
          }
          let dt = new Seq();
          if(typeof data == "string" || data instanceof java.lang.String){
            data = data.toString().split(/\r\n|\r|\n/gi);
          }
          try{
            dt.addAll(data);
          }catch(e){
            if(typeof error == "function"){
              error(e);
              return;
            }
            return;
          }
          let sl = new Seq();
          if(typeof selected == "string" || selected instanceof java.lang.String){
            selected = selected.toString().split(/\r\n|\r|\n/gi);
          }
          try{
            sl.addAll(selected);
          }catch(e){
          }
          const DT = dt.copy(), SL = sl.copy();
          let dlg = new BaseDialog(title != null && title != undefined && title.toString() || "@svn.content-list");
          dlg.addCloseButton();
          let con = dlg.cont;
          let itt = new Table();
          let lst = itt.getCells();
          let sel = new Seq();
          let it, str, ret;
          const init = ()=>{
            for(let i = 0; i < dt.size; ++i){
              it = dt.get(i);
              str = it.toString();
              if(typeof getString == "function"){
                ret = getString(it, i, dt);
                if(ret || ret === 0){
                  str = ret.toString();
                }
              }
              let tb = new TextButton(str, Styles.flatTogglet);
              tb.getLabel().setAlignment(Align.left);
              let tbc = itt.add(tb).margin(5).height(50).minWidth(200);
              if(typeof custom == "function"){
                ret = custom(it, i, dt);
                if(ret || ret === 0){
                  if(!(ret instanceof Element)){
                    ret = ret.toString();
                  }
                  tb.add(ret).right();
                }
              }
              itt.row();
              tb.getLabel().setWrap(false);
              tb.userObject = it;
              if(sl.indexOf(it) != -1){
                tb.setChecked(true);
                sel.add(tbc);
              }
              tb.changed(()=>{
                if(tb.isChecked()){
                  sel.add(tbc);
                  sel["sort(arc.func.Floatf)"](c=>lst.indexOf(c));
                }else{
                  sel.remove(tbc);
                }
              });
            }
          };
          init();
          con.pane(itt).grow().margin(5);
          
          let move = function(val){
            if(typeof val != "number" || val == 0){
              return;
            }
            if(sel.size == lst.size){
              return;
            }
            let dir = (val > 0) * 2 - 1;
            let len = sel.size, it, idx;
            let lel = lst.size, itl, nidx;
            for(let i = dir > 0 ? len - 1 : 0 ; i >= 0 && i < len; i -= dir){
              it = sel.get(i);
              idx = lst.indexOf(it);
              nidx = idx + val;
              nidx = nidx < 0 ? 0 : nidx >= lel ? lel - 1 : nidx;
              for(; nidx >= 0 && nidx < lel; nidx -= dir){
                itl = lst.get(nidx);
                if(nidx == idx){
                  break;
                }
                if(!itl.get().isChecked()){
                  break;
                }
              }
              if(nidx != idx){
                lst.remove(it);
                lst.insert(nidx, it);
              }
            }
            itt.invalidate();
          };
          
          con.pane(t=>{
            t.button(Icon.upOpen, Styles.squarei, ()=>{
            }).size(60).margin(15).get().addCaptureListener(extend(ElementGestureListener, {
              longPress: function(e, x, y){
                move(-Infinity);
                return true;
              },
              tap: function(e, x, y, c, k){
                move(-1);
              }
            }));
            t.row();
            t.button(Icon.downOpen, Styles.squarei, ()=>{
            }).size(60).margin(15).get().addCaptureListener(extend(ElementGestureListener, {
              longPress: function(e, x, y){
                move(Infinity);
                return true;
              },
              tap: function(e, x, y, c, k){
                move(1);
              }
            }));
            t.row();
            t.add().height(30);
            t.row();
            t.button(Icon.ok, Styles.squarei, ()=>{
              sel.clear();
              sel.addAll(lst);
              sel.each(c=>{
                c.checked(true);
              });
            }).size(60).margin(15);
            t.row();
            t.button(Icon.cancel, Styles.squarei, ()=>{
              sel.each(c=>{
                c.checked(false);
              });
              sel.clear();
            }).size(60).margin(15);
            t.row();
            t.add().height(60);
            t.row();
            t.button(Icon.refresh, Styles.squarei, ()=>{
              lst.clear();
              sel.clear();
              dt = DT.copy();
              sl = SL.copy();
              init();
              itt.invalidate();
            }).size(60).margin(15);
            if(helpText != null && helpText != undefined){
              helpText = helpText.toString();
              t.row();
              t.add().height(60);
              t.row();
              t.button("?", Styles.cleart, ()=>{
                Vars.ui.showInfo(helpText);
              }).size(60).margin(15);
            }
          }).width(200).growY().margin(5);
          
          if(typeof close == "function"){
            dlg.hidden(()=>{
              close();
            });
          }
          dlg.buttons.button("@ok", Icon.ok, ()=>{
            if(typeof done == "function"){
              let newData = new Seq();
              let selData = new Seq();
              lst.each(c=>{
                newData.add(c.get().userObject);
              });
              sel.each(c=>{
                selData.add(c.get().userObject);
              });
              done(newData, selData);
            }
            dlg.hide();
          });
          
          dlg.show();
        }
        global.svn.misc.showList = showList;
        
        // Tag list
        let bun = Core.bundle;
        let bunTags = bun.get("svn.schematics.tags");
        let help = bun.get("svn.schematics.tags.help");
        let tagList = ()=>{
          let sc = Vars.ui.schematics;
          let tags = Reflect.get(sc, "tags");
          let selectedTags = Reflect.get(sc, "selectedTags");
          let rebuildTags = Reflect.get(sc, "rebuildTags");
          let rebuildPane = Reflect.get(sc, "rebuildPane");
          showList(tags, selectedTags, (d, s)=>{
            let a = tags.copy(), b = d.copy();
            a.removeAll(b);
            let rem = a.copy();
            a = tags.copy(), b = d.copy();
            b.removeAll(a);
            let add = b.copy();
            
            // s.removeAll(rem);
            tags.clear();
            tags.addAll(d);
            selectedTags.clear();
            selectedTags.addAll(s);
            rebuildTags.run();
            rebuildPane.run();
            Core.settings.putJson("schematic-tags", java.lang.String, tags);
          }, e=>{
            Log.err(e);
          }, ()=>{
            
          }, bunTags, it=>{
            
          }, it=>{
            return "[gray]" + bun.format("schematic.tagged", Vars.schematics.all().count(s=>s.labels.contains(it)));
          }, help);
        };
        Vars.ui.schematics.buttons.button(bunTags, Icon.list, ()=>{
          tagList();
        });
      })();
      //
      
      // Buiding rotation button
      (function(){
        const con = Vars.control.input.config;
        const list = [];
        Vars.content.blocks().each(b=>{
          if(b.rotate){
            list.push(b);
            b.configurable = true;
          }
        });
        let tbl = field(con, "table").val;
        let bld, pb = field(con, "selected").val;
        const rot = ()=>{
          bld = field(con, "selected").val;
          if(bld && bld != pb && con.isShown() && bld.block.rotate){
            if(tbl.getChildren().size > 0){
              tbl.row();
            }
            tbl.table().growX().center().get().button(Icon.rotate, Styles.cleari, ()=>{
              Call.rotateBlock(Vars.player, bld, false);
            }).size(40);
            Core.app.post(()=>{
              tbl.pack();
            });
          }
          pb = bld;
        }
        // UnitFactory config fix
        let uff = function(bui){
          if(!bui || !(bui instanceof Packages.mindustry.gen.Building)){
            return;
          }
          let blk = bui.block;
          if(blk instanceof UnitFactory){
            if(blk.plans.size == 1){
              bui.currentPlan = 0;
            }
          }
        }
        let tce;
        Events.on(TileChangeEvent, tce = e=>{
          uff(e.tile.build);
        });
        let wle;
        Events.on(WorldLoadEvent, wle = e=>{
          Groups.build.each(b=>{
            uff(b);
          });
        });
        Events.run(Trigger.update, rot);
      })();
      
      // Memory viewer
      (function(){
        const con = Vars.control.input.config;
        const list = [];
        Vars.content.blocks().each(b=>{
          if(b instanceof MemoryBlock){
            list.push(b);
            b.configurable = true;
          }
        });
        let tbl = field(con, "table").val;
        let bld, pb = field(con, "selected").val;
        const up = ()=>{
          bld = field(con, "selected").val;
          if(bld && bld != pb && con.isShown() && bld instanceof MemoryBlock.MemoryBuild){
            if(tbl.getChildren().size > 0){
              tbl.row();
            }
            tbl.table().growX().center().get().button(Icon.eyeSmall, Styles.cleari, ()=>{
              showMem(bld);
            }).size(40);
            Core.app.post(()=>{
              tbl.pack();
            });
          }
          pb = bld;
        }
        Events.run(Trigger.update, up);
        const hg = Vars.ui.hudGroup, tb = "table(arc.func.Cons)", fi = "fill(arc.func.Cons)";
        const mTbl = new Table(Tex.buttonTrans),
        top = new Table(), mid = new Table(),
        bot = new Table(), lbl = new Label(""),
        ctrl = new Table(), cells = new Table(), pag = new Label("");
        let mem, vis = false, lbls;
        let i, beg = 0, len = 32;
        let tmp, tmp2, tmp3;
        mTbl.touchable = Touchable.enabled;
        mTbl.add(top).growX();
        mTbl.row();
        mTbl.image(Tex.whiteui, Pal.accent).growX().height(3).pad(6);
        mTbl.row();
        mTbl.add(mid).grow();
        mTbl.row();
        mTbl.image(Tex.whiteui, Pal.accent).growX().height(3).pad(6);
        mTbl.row();
        mTbl.add(bot).growX().bottom();
        
        lbl.setWrap(false);
        lbl.setEllipsis(true);
        lbl.setAlignment(Align.center);
        pag.setAlignment(Align.center);
        top.add(lbl).growX().height(50);
        mid.top().left();
        mid.pane(cells).grow();
        mid.row();
        mid.add(ctrl).top().right().height(50).padTop(6).growX();
        ctrl.top().left();
        ctrl[tb](t=>{
          t.top().left();
          t.button(Icon.upOpen, ()=>{
            if(mem && mem.length){
              tmp = mem.length;
              if(beg - len < 0){
                beg = Math.ceil((tmp - len) / len) * len;
              }else{
                beg -= len;
              }
              upMem();
            }
          }).top().left();
        }).top().left();
        ctrl[tb](t=>{
          t.add(pag).growX();
        }).growX();
        ctrl[tb](t=>{
          t.top().right();
          t.button(Icon.downOpen, ()=>{
            if(mem && mem.length){
              tmp = mem.length;
              if(beg + len >= tmp){
                beg = 0;
              }else{
                beg += len;
              }
              upMem();
            }
          }).top().right();
        }).top().right();
        cells.top().left();
        bot.button("@svn.button.hide", Icon.eyeOff, ()=>{
          vis = !vis;
        }).fillX().height(50).minWidth(200).get().getLabel().setWrap(false);
        const showMem = function(bld){
          if(bld instanceof MemoryBlock.MemoryBuild){
            lbl.setText(bld.block.emoji() + " " + bld.block.localizedName);
            mem = bld.memory;
            vis = true;
            upMem();
          }
        }
        const upMem = function(){
          if(!vis || !mem || len < 1){
            return;
          }
          cells.clearChildren();
          lbls = [];
          tmp = mem.length;
          if(beg >= tmp){
            beg = Math.ceil((tmp - len) / len) * len;
          }
          tmp2 = beg + len;
          if(tmp2 > tmp){
            tmp2 = tmp;
          }
          for(i = beg; i < tmp2; ++i){
            cells.add("" + i).padLeft(6).width(50);
            lbls.push(cells.add("" + mem[i]).fillX().height(40).get());
            cells.row();
          }
          tmp = Math.ceil(tmp / len);
          tmp2 = Math.ceil(tmp2 / len);
          pag.setText(bun.format("svn.label.page", tmp2 + "/" + tmp));
        }
        let dl = 1000;
        hg[fi](t=>{
          t.toFront();
          t.visibility= ()=>vis;
          t.add(mTbl).center().margin(16).minWidth(360);
          let lt = System.currentTimeMillis(), ct;
          t.update(()=>{
            ct = System.currentTimeMillis();
            if(ct - lt >= dl){
              lt = ct;
              if(lbls && lbls.length && beg < mem.length){
                for(i = 0; i < lbls.length && i + beg < mem.length; ++i){
                  tmp = lbls[i];
                  tmp.setText("" + mem[i + beg]);
                }
              }
            }
          });
        });
        const upDelay = function(t){
          if(typeof t === "number" && t >= 0){
            dl = t;
          }
        }
        const itemPerPage = function(l){
          if(typeof l === "number" && l > 0){
            len = l;
            upMem();
          }
        }
        const mv = {};
        mv.upDelay = upDelay;
        mv.upMem = upMem;
        mv.itemPerPage = itemPerPage;
        global.svn.misc.mv = mv;
      })();
      
      // Map utility
      (()=>{
        const map = global.svn.layout.left();
        const visAd = ()=>st.getBool("svn-map-edit-utility") && Vars.player.admin == Vars.net.active();
        const visAdSer = ()=>visAd() && Vars.net.server() == Vars.net.active();
        map.visibility = ()=>visAd() && Vars.ui.hudfrag.shown && !Vars.ui.minimapfrag.shown();
        const mapEditor = map.button(Icon.edit, ()=>{
          Vars.state.rules.editor = mapEditor.get().isChecked();
        }).visible(visAdSer);
        mapEditor.get().getStyle().imageCheckedColor = Pal.accent;
        const mapTesting = map.button(Icon.map, ()=>{
          Vars.state.playtestingMap = mapTesting.get().isChecked() ? Vars.state.map : null;
        }).visible(visAdSer);
        mapTesting.get().getStyle().imageCheckedColor = Pal.accent;
        map.row();
        
        let tr;
        const mapTeamCheat = map.button(Icon.power, ()=>{
          tr = Vars.player.team().rules();
          tr.cheat = !tr.cheat;
        }).update(()=>{
          mapTeamCheat.checked(Vars.player.team().rules().cheat);
        }).visible(visAdSer);
        mapTeamCheat.get().getStyle().imageCheckedColor = Pal.accent;
        const mapRules = map.button(Icon.fileTextFill, ()=>{
          global.svn.advRules.showCustomRules();
        }).visible(visAdSer);
        map.row();
        
        let lsc = Time.millis(), gap = 5;
        const syncClients = function(){
          const tim = Time.millis(), gapm = gap * 1000;
          if(tim - lsc < gapm){
            Vars.player.sendMessage(bun.format("svn.mapUtil.syncWait", gap));
            return;
          }
          lsc = tim;
          const pls = Groups.player;
          let i, pl, pli;
          for(i = 0; i < pls.size(); ++i){
            pl = pls.index(i);
            if(pl.isLocal()){
              continue;
            }
            pli = pl.getInfo();
            if(pl.con && tim - pli.lastSyncTime >= gapm){
              Call.worldDataBegin(pl.con);
              Vars.netServer.sendWorldData(pl);
              pli.lastSyncTime = tim;
              pl.sendMessage(bun.get("svn.mapUtil.synced")); // TODO Client language
            }
          }
        }
        const mapSync = map.button(Icon.refresh, ()=>{
          syncClients();
        }).visible(visAdSer);
        map.row();
        
        const teamDlg = global.svn.layout.baseDlg("@editor.teams");
        const teamName = new Label("");
        teamDlg.visf = visAd;
        teamDlg.cont.add(teamName).center().height(50).row();
        const fil = 0,
        clk = t=>{
          Call.adminRequest(Vars.player, Packets.AdminAction.switchTeam, t);
          //teamDlg.hide();
        },
        upd = t=>{
          return Vars.player.team() == t;
        },
        ipr = 0;
        const cont = global.svn.ele.teamChooser(0, clk, upd, ipr);
        teamDlg.cont.pane(cont).get().setScrollingDisabledX(true);
        let team;
        const mapTeam = map.button(Icon.players, ()=>{
          teamDlg.toggle();
        }).update(()=>{
          team = Vars.player.team(); 
          mapTeam.get().getStyle().imageUpColor = team.color;
          teamName.setText(team.coloredName());
        }).visible(visAd);
        
        let hlp;
        const mapHelp = map.button("?", ()=>{
          if(!hlp || !hlp.parent){
            hlp = global.svn.noti.add(bun.get("svn.mapUtil.help"));
          }else{
            global.svn.noti.remove(hlp);
          }
        }).visible(visAd);
        Events.on(WorldLoadEvent, ()=>{
          mapEditor.checked(Vars.state.editor);
          mapTesting.checked(Vars.state.playtestingMap != null);
          mapTeamCheat.checked(Vars.player.team().rules().cheat);
        });
      })();
      
      // You lost
      (function(){
        let go = Vars.ui.restart;
        go.shown(()=>{
          try{
            go.buttons.row();
            go.addCloseButton();
          }catch(e){
            Log.err(e);
          }
        });
      })();
      
      // END ClientLoadEvent
    }catch(e){
      Log.err(module.id + ": " + e);
    }
  });
}catch(e){
  Log.err(module.id + ": " + e);
}