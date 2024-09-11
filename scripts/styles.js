try{
  global.svn.styles = {};
  global.svn.evt.load(()=>{
    const flati = new ImageButton.ImageButtonStyle(Styles.flati);
    Object.assign(flati, {
      up: Styles.black3,
      down: Styles.black5,
      imageUpColor: Color.white,
      imageDisabledColor: Color.darkGray,
      imageCheckedColor: Color.white
    });
    global.svn.styles.flati = flati;
    const flatt = new TextButton.TextButtonStyle(Styles.flatt);
    Object.assign(flatt, {
      up: Styles.black3,
      down: Styles.black5,
      disabledFontColor: Color.darkGray,
      checkedFontColor: Color.white
    });
    global.svn.styles.flatt = flatt;
    const flattoglet = new TextButton.TextButtonStyle(Styles.flattoglet);
    Object.assign(flatt, {
      up: Styles.black3,
      down: Styles.black5,
      disabledFontColor: Color.darkGray,
      checkedFontColor: Color.white
    });
    global.svn.styles.flatt = flattoglet;
  });
}catch(e){
  Log.err(module.id + ": " + e);
}