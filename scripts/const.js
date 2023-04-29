try{
  global.svn.const = {};
  // V7
  let ee = "⚠";
  let eb = "";
  let eu = "";
  let ei = "";
  let el = "";
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
  eb = emoji(c.blocks()).toString();
  eu = emoji(c.units()).toString();
  ei = emoji(c.items()).toString();
  el = emoji(c.liquids()).toString();
  global.svn.const.emojiIcons = ee;
  global.svn.const.emojiBlocks = eb;
  global.svn.const.emojiUnits = eu;
  global.svn.const.emojiItems = ei;
  global.svn.const.emojiLiquids = el;
  global.svn.const.emojiAll = ee + eb + eu + ei + el;
}catch(e){
  Log.err("const: " + e);
}