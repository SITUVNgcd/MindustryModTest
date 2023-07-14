try{
  global.svn.misc = {};
  const st = Core.settings, bun = Core.bundle;
  Vars.renderer.minZoom = st.getInt("svn-min-zoom", 2) / 10;
  Vars.renderer.maxZoom = st.getInt("svn-max-zoom", 15);
  Vars.maxSchematicSize = 256;
  let i, tmp, tmp2, tmp3;
  Events.on(ClientLoadEvent, ()=>{
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
        bot.button(bun.get("svn.button.hide"), Icon.eyeOff, ()=>{
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
      
      // Advanced rules
      (function(){
        const mid = global.svn.util.field(Vars.ui.editor, "infoDialog").val;
        const crdE = global.svn.util.field(mid, "ruleInfo").val; // Editor rules
        const ptd = global.svn.util.field(Vars.ui.editor, "playtestDialog").val;
        const crdP = global.svn.util.field(ptd, "dialog").val; // Playtest rules
        const cgd = global.svn.util.field(Vars.ui.custom, "dialog").val;
        const crdG = global.svn.util.field(cgd, "dialog").val; // Custom game rules
        const crdAll = [crdE, crdP, crdG];
        let rules = null;
        const advDlg = new BaseDialog("@svn.advanceRules");
        advDlg.addCloseButton();
        const lub = advDlg.cont.check("@svn.advanceRules.logicUnitBuild", false, c=>{
          rules.logicUnitBuild = c;
        });
        advDlg.shown(()=>{
          lub.checked(rules.logicUnitBuild);
        });
        const advBtn= new TextButton("@svn.advanceRules");
        advBtn.getLabel().setWrap(false);
        advBtn.clicked(()=>{
          if(rules){
            advDlg.show();
          }
        });
        const resetTxt = Core.bundle.get("settings.reset"),
        infTxt = Core.bundle.get("rules.infiniteresources");
        const build = function(dlg){
          const cont = dlg.cont,
          main = global.svn.util.field(dlg, "main").val;
          rules = global.svn.util.field(dlg, "rules").val;
          const reset = main["find(arc.func.Boolf)"](e=>e instanceof TextButton && e.getText() == resetTxt);
          const inf = main["find(arc.func.Boolf)"](e=>e instanceof CheckBox && e.getText() == infTxt);
          const re = ()=>{
            build(dlg);
          };
          reset.changed(re);
          inf.changed(re);
          if(main){
            cont.clear();
            cont.add(advBtn).minWidth(200).expandX().height(50);
            cont.row();
            cont.pane(main).scrollX(false);
          }
        }
        const adv = extend(VisibilityListener, {
          handle: function(evt){
            if(!Core.settings.getBool("svn-map-advanced-rules")) return;
            if(evt instanceof VisibilityEvent && !evt.isHide()){
              const dlg = evt.targetActor || evt.listenerActor;
              if(dlg instanceof CustomRulesDialog){
                build(dlg);
              }
            }
          }
        });
        const advanceRules = function(dlg, show){
          dlg = global.svn.util.toArrayByType(dlg, CustomRulesDialog);
          if(typeof show !== "boolean"){
            show = !!show;
          }
          let res = 0, i, ii;
          for(i = 0; i < dlg.length; ++i){
            ii = dlg[i];
            if(show){
              res += ii.addListener(adv);
            }else{
              res += ii.removeListener(adv);
            }
          }
          return res;
        }
        const showAdvancedRules = function(show){
          if(arguments.length == 0){
            show = true;
          }
          return advancedRules(crdAll, show);
        }
        const hideAdvanceRules = function(){
          return showAdvanceRules(false);
        }
        showAdvancedRules();
        global.svn.misc.showAdvancedRules = showAdvancedRules;
        global.svn.misc.hideAdvancedRules = hideAdvancedRules;
      })();
      
      // END ClientLoadEvent
    }catch(e){
      Log.err(module.id + ": " + e);
    }
  });
}catch(e){
  Log.err(module.id + ": " + e);
}