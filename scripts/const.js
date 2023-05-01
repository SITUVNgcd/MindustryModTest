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
    let emoji = function(arr, beg, end){
      let len = -1;
      if(arr instanceof Seq){
        slen = arr.size;
        arr = arr.items;
      }
      if(!(arr instanceof Array)){
        return "";
      }
      if(len == -1){
        len = arr.length;
      }
      if(!beg || typeof beg != "number" || beg < 0){
        beg = 0;
      }
      if(!end || typeof end != "number" || end < 0 || end >= len){
        end = len - 1;
      }
      let r = "", ii, to;
      for(let i = beg; i <= end; ++i){
        ii = arr[i];
        to = typeof ii.emoji;
        r += to == "function" ? ii.emoji() : to == "string" ? ii.emoji : "";
      }
      return r;
    }
    const c = Vars.content;
    eb = emoji(c.blocks()) || eb;
    eu = emoji(c.units()) || eu;
    ei = emoji(c.items()) || ei;
    el = emoji(c.liquids()) || el;
    es = emoji(c.statusEffects()) || es;
    et = emoji(Team.all) || et;
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