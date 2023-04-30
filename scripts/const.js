try{
  global.svn.const = {};
  // V7
  Events.on(ClientLoadEvent, ()=>{
    let ee = "⚠";
    let eb = "";
    let eu = "";
    let ei = "";
    let el = "";
    let es = "";
    let et = "";
    let emoji = function(seq){
      let r = "", ii;
      for(let i = 0; i < seq.size; ++i){
        ii = seq.get(i);
        if(!ii.hasEmoji()){
          continue;
        }
        r += ii.emoji();
      }
      return r;
    }
    const c = Vars.content;
    eb = emoji(c.blocks());
    eu = emoji(c.units());
    ei = emoji(c.items());
    el = emoji(c.liquids());
    es = emoji(c.statusEffects());
    for(let i of Team.all){
      et += i.emoji;
    }
    global.svn.const.emojiIcons = ee;
    global.svn.const.emojiBlocks = eb;
    global.svn.const.emojiUnits = eu;
    global.svn.const.emojiItems = ei;
    global.svn.const.emojiLiquids = el;
    global.svn.const.emojiStatusEffects = es;
    global.svn.const.emojiTeams = et;
    global.svn.const.emojiAll = ee + eb + eu + ei + el + es + et;
  });
}catch(e){
  Log.err("const: " + e);
}