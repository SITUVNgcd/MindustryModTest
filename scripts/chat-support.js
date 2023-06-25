try{
  global.svn.cs = {};
  let i, j, tmp, tmp2;
  const sendChatMessage = global.svn.util.sendChatMessage,
  rainbow = global.svn.util.rainbow,
  colStr = global.svn.util.colStr,
  fitWidth = global.svn.util.fitWidth;
  Events.on(ClientLoadEvent, ()=>{
    const darkIps = ["128.140.88.66", "130.61.76.9", "62.109.8.200", "darkdustry.net"],
    darkCrawlerPorts = [3003, 5000];
    let getIp = global.svn.util.getIp;
    let getPort = global.svn.util.getPort;
    let tmpIp, tmpPort;
    let darkServer = function(){
      tmpIp = getIp();
      for(i = 0; i < darkIps.length; ++i){
        if(tmpIp == darkIps[i]){
          return true;
        }
      }
      return false;
    }
    let darkCrawler = function(){
      if(!darkServer()){
        return false;
      }
      tmpPort = getPort();
      for(i = 0; i < darkCrawlerPorts.length; ++i){
        if(tmpPort == darkCrawlerPorts[i]){
          return true;
        }
      }
      return false;
    }
    const QuickChat = global.svn.qc.QuickChat;
    tbl && tbl.remove();
    let hg = Vars.ui.hudGroup;
    let qc = new QuickChat(50, 2, "svn-command-support");
    let sz = 50;
    let tbl = qc.tbl;
    let cmdHelp = qc.add("?", "/help");
    let cmdSync = qc.add(Icon.refresh, "/sync");
    let cmdPlayers = qc.add(Icon.players, "/players", ()=>darkServer());
    let cmdMaps = qc.add(Icon.map, "/maps", ()=>darkServer());
    let cmdStats = qc.add(Icon.paste, "/stats", ()=>darkServer());
    let cmdSettings = qc.add(Icon.settings, "/settings", ()=>darkServer());
    let cmdUpgrade = qc.add(Icon.units, "/upgrade", ()=>darkCrawler());
    qc.addEmpty();
    let cmdChatEmoji = qc.add(Icon.chat, ()=>{chatEmoji()});
    hg.addChild(tbl);
    hg.pack();
    tbl.setPosition(0, 500);
    tbl.pack();
    tbl.visibility = ()=>Vars.ui.hudfrag.shown && !Vars.ui.minimapfrag.shown() && Core.settings.getBool("svn-chat-support");
    
    let PayCtrl = global.svn.payloadc.PayCtrl;
    let pup = function(){
      let u = Vars.player;
      let ph = new PayCtrl(u, 32);
      ph.run();
      return ph;
    }
    ph && typeof ph.end == "function" && ph.end();
    let ph = pup();
    let pupTbl = ph.tbl;
    hg.addChild(pupTbl);
    pupTbl.setPosition(0, 450);
    pupTbl.pack();
    pupTbl.visibility = ()=>Vars.ui.hudfrag.shown && !Vars.ui.minimapfrag.shown() && Core.settings.getBool("svn-chat-support");
    
    let ibs = new ImageButton.ImageButtonStyle(Icon.upOpen, null, Icon.downOpen, null, null, null);
    let cat = function(tt, arr, clk, ipr){
      let tbl = new Table(Styles.black5), top = new Table(Styles.black8), bot = new Table(Styles.black9);
      let cls = new Collapser(bot, true);
      let lbl, tog, stt = false;
      let cnt, i, tmp, tmp2;
      if(!(tt instanceof Element)){
        tt = new Label(tt.toString());
      }
      tbl.add(top).height(50).growX();
      tbl.row();
      tbl.add(cls).growX();
      lbl = top.add(tt).left().height(50).padLeft(6).growX().get();
      tog = new ImageButton(ibs);
      top.add(tog).right().size(50);
      let aLen = -1;
      if(arr && arr instanceof Seq){
        aLen = arr.size;
        arr = arr.items;
      }
      if(typeof clk != "function"){
        clk = ()=>{};
      }
      let isz = 50;
      let iprA = false;
      if(typeof ipr != "number" || ipr < 1){
        iprA = true;
        ipr = Math.floor((Core.scene.width - 12) / isz) || 9;
      }
      cnt = 0;
      if(arr && typeof arr == "string" || arr instanceof Array){
        if(aLen == -1){
          aLen = arr.length;
        }
        let seq = new Seq();
        for(i = 0; i < aLen; ++i){
          let ii = arr[i];
          if(typeof ii == "string" || ii instanceof Drawable){
            tmp = bot.button(ii, Styles.flatBordert, ()=>{clk(ii)}).height(isz);
            if(typeof arr == "string"){
              tmp.width(isz);
            }
            fitWidth(tmp);
            seq.add(tmp.get());
            ++cnt;
            if(cnt % ipr == 0){
              bot.row();
            }
          }
        }
        if(iprA){
          let prevW = bot.width;
          bot.update(()=>{
            if(prevW != bot.width){
              prevW = bot.width;
              cnt = 0;
              ipr = Math.floor((bot.width - 30) / isz);
              bot.clearChildren();
              for(i = 0; i < seq.size; ++i){
                tmp = bot.add(seq.get(i)).height(isz);
                if(typeof arr == "string"){
                  tmp.width(isz);
                }
                fitWidth(tmp);
                ++cnt;
                if(cnt % ipr == 0){
                  bot.row();
                }
              }
            }
          });
        }
      }else if(arr && arr instanceof EntityGroup){
        let ent = new Seq();
        bot.update(()=>{
          if(ent.size != arr.size() || ent.size != 0 && arr.size() != 0 && ent.get(ent.size - 1) != arr.index(arr.size() - 1)){
            ent.clear();
            arr.copy(ent);
            bot.clearChildren();
            for(i = 0; i < ent.size; ++i){
              let cn = ent.get(i).coloredName() + "[]";
              bot.button(cn, Styles.flatBordert, ()=>{clk(cn)}).growX().height(isz);
              let pn = ent.get(i).plainName(); // Strings.stripColors
              bot.button(pn, Styles.flatBordert, ()=>{clk(pn)}).growX().height(isz);
              bot.row();
            }
          }
        });
      }else if(arr === global.svn.players || arr === global.svn.players.cur){
        arr = global.svn.players;
        let it, pls = arr.cur;
        const nf = ()=>{};
        const up = ()=>{
          bot.clearChildren();
          bot.add(rainbow("Colored_name")).growX().height(isz).labelAlign(Align.center);
          bot.add("Plain name").growX().height(isz).labelAlign(Align.center);
          bot.add("#ID").growX().height(isz).labelAlign(Align.center);
          bot.row();
          for(i = 0; i < pls.size; ++i){
            it = pls.get(i);
            let cn = it.coloredName() + "[]";
            bot.button(cn, Styles.flatBordert, ()=>{clk(cn)}).growX().height(isz);
            let pn = it.plainName(); // Strings.stripColors
            bot.button(pn, Styles.flatBordert, ()=>{clk(pn)}).growX().height(isz);
            let id = "#" + it.id;
            bot.button(id, Styles.flatBordert, ()=>{clk(id)}).growX().height(isz);
            bot.row();
          }
        }
        up();
        arr.selfJoin(up);
        arr.playerJoin(up);
        arr.playerBack(up);
        arr.playerLeave(up);
      }
      top.clicked(()=>{
        stt = !stt;
      });
      top.update(()=>{
        cls.setCollapsed(!stt);
        tog.setChecked(stt);
      });
      return tbl;
    }
    
    let msg, ed;
    let chatEmoji = function(){
      if(ed && ed instanceof BaseDialog){
        ed.show();
        return ed;
      }
      ed = new BaseDialog("Chat with Emojis");
      const c = ed.cont, maxLen = Vars.maxTextLength;
      c.top();
      let t, scr, txt, idl, kbu, kbd, ipc, len, all, cut, cpy, pst, send, tmp, tmp2, tmp3, col;
      let etbl, escr, escrC, ico, blk, uni, ite, liq, stt, tea, cmd, pls;
      let txtc, emoc;
      txt = new TextArea("");
      txt.setMaxLength(maxLen);
      txt.setProgrammaticChangeEvents(true);
      txt.tapped(()=>{
        Core.input.setOnscreenKeyboardVisible(true);
      });
      idl = global.svn.util.field(txt, "inputDialogListener").val;
      txt.removeListener(idl);
      scr = c.pane(txt).top().height(100).growX().padLeft(6).padRight(6).get();
      scr.setScrollingDisabled(true, false);
      scr.setFadeScrollBars(false);
      c.row();
      t = c.table().top().growX().height(50).get();
      kbu = t.button(Icon.upOpen, ()=>{
        Core.input.setOnscreenKeyboardVisible(true);
      }).size(50).left().padLeft(6).get();
      kbd = t.button(Icon.downOpen, ()=>{
        Core.input.setOnscreenKeyboardVisible(false);
      }).size(50).left().padLeft(6).get();
      if(idl){
        ipc = t.check("System input", c=>{
          if(c){
            txt.addListener(idl);
          }else{
            txt.removeListener(idl);
            Core.input.setOnscreenKeyboardVisible(true);
          }
        }).height(50).left().padLeft(6).get();
      }
      len = t.add(new Label("")).height(50).growX().padRight(6).get();
      len.setAlignment(Align.right);
      all = t.button(Icon.move, ()=>{
        txt.selectAll();
      }).size(50).right().padRight(6).get();
      cut = t.button("Cut", ()=>{
        txt.cut();
      }).size(50).right().padRight(6).get();
      cpy = t.button(Icon.copy, ()=>{
        tmp = txt.getSelection();
        if(!tmp || tmp == ""){
          tmp = txt.getText();
        }
        if(tmp && tmp != ""){
          Core.app.setClipboardText(tmp);
        }
      }).size(50).right().padRight(6).get();
      pst = t.button(Icon.paste, ()=>{
        txt.paste(Core.app.getClipboardText(), true);
      }).size(50).right().padRight(12).get();
      send = t.button(Icon.right, ()=>{
        tmp = txt.getText();
        if(tmp && tmp != ""){
          sendChatMessage(tmp);
          txt.clearText();
        }
      }).size(50).right().padRight(6).get();
      c.row();
      let tool = c.table().top().left().growX().height(50).get();
      let rainC = tool.button(rainbow("Rainbow"), ()=>{
        tmp = txt.getSelection();
        tmp2 = txt.getText();
        if(!tmp || tmp == ""){
          tmp = tmp2;
        }
        if(tmp && tmp != ""){
          tmp3 = rainbow(tmp);
          if(tmp != tmp2){
            txt.paste(tmp3, true);
          }else{
            txt.setText(tmp3);
          }
        }
      }).left();
      fitWidth(rainC);
      c.row();
      
      etbl = new Table();
      etbl.top();
      escrC = c.pane(etbl).grow().height(Core.scene.height / 2).top().padTop(12);
      escr = escrC.get();
      escr.setScrollingDisabled(true, false);
      emoc = t=>{
        if(typeof t == "string"){
          txt.paste(t, true);
        }
      }
      ico = etbl.add(cat("Icons", global.svn.const.emojiIcons, emoc)).growX().top().get();
      etbl.row();
      blk = etbl.add(cat("Blocks", global.svn.const.emojiBlocks, emoc)).growX().top().get();
      etbl.row();
      uni = etbl.add(cat("Units", global.svn.const.emojiUnits, emoc)).growX().top().get();
      etbl.row();
      ite = etbl.add(cat("Items", global.svn.const.emojiItems, emoc)).growX().top().get();
      etbl.row();
      liq = etbl.add(cat("Liquids", global.svn.const.emojiLiquids, emoc)).growX().top().get();
      etbl.row();
      stt = etbl.add(cat("Status Effects", global.svn.const.emojiStatusEffects, emoc)).growX().top().get();
      etbl.row();
      tea = etbl.add(cat("Teams", global.svn.const.emojiTeams, emoc)).growX().top().get();
      etbl.row();
      const cmds = ["/help ", "/stats ", "/upgrade ", "/maps", "/rtv ", "/players", "/settings"];
      cmd = etbl.add(cat("Commands", cmds, emoc)).growX().top().get();
      etbl.row();
      pls = etbl.add(cat("Players", global.svn.players, emoc)).growX().top().get();
      let prevW = c.width;
      c.update(()=>{
        tmp = txt.getText().toString() == "";
        tmp2 = txt.getText() == txt.getSelection();
        all.setDisabled(tmp || tmp2);
        send.setDisabled(tmp);
        tmp = txt.getSelection() == "";
        cut.setDisabled(tmp);
        cpy.setDisabled(tmp);
        Core.scene.setKeyboardFocus(txt);
        if(prevW != c.width){
          prevW = c.width;
          escrC.height(c.height / 2);
          c.pack();
        }
      });
      ed.addCloseButton();
      ed.closeOnBack();
      ed.setMovable(true);
      ed.setResizable(true);
      ed.setResizeBorder(20);
      ed.shown(()=>{
        Core.input.setOnscreenKeyboardVisible(true);
        txt.selectAll();
      });
      ed.hidden(()=>{
        msg = txt.getText().toString();
      });
      ed.show();
      const gr = [new Color(0, 1, 0), new Color(1, 1, 0), new Color(1, 0, 0)];
      txtc = ()=>{
        tmp = txt.getText().length;
        col = tmp / maxLen;
        //col = "[" + (col >= 1 ? "red" : col > 0.75 ? "orange" : col > 0.5 ? "yellow" : "green") + "]";
        col = "[#" + colStr(Tmp.c1.lerp(gr, col)) + "]";
        len.setText(col + tmp + "/" + maxLen);
      };
      txt.changed(txtc);
      txt.setText(msg || "");
      txt.setCursorPosition(txt.getText().toString().length);
      return ed;
    }
  });
}catch(e){
  Log.err(module.id + ": " + e);
}