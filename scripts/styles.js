try{
  global.svn.styles = {};
  global.svn.evt.load(()=>{
    const flati = new ImageButton.ImageButtonStyle(Styles.flati);
    Object.assign(flati, {
      up: Styles.black3,
      down: Styles.black5,
      imageUpColor: Color.white,
      imageDisabledColor: Color.darkGray,
      imageCheckedColor: Pal.accent
    });
    global.svn.styles.flati = flati;
    const flatt = new TextButton.TextButtonStyle(Styles.flatt);
    Object.assign(flatt, {
      up: Styles.black3,
      down: Styles.black5,
      disabledFontColor: Color.darkGray
      checkedFontColor: Pal.accent;
    });
    global.svn.styles.flatt = flatt;
  });
}catch(e){
  Log.err(module.id + ": " + e);
}