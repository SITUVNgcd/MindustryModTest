try{
  global.svn.st = {};
  const flati = new ImageButton.ImageButtonStyle(Styles.flati);
  Object.assign(flati, {
    up: Styles.black3,
    down: Styles.black5
  });
  global.svn.st.flati = flati;
  const flatt = new TextButton.TextButtonStyle(Styles.flatt);
  Object.assign(flatt, {
    up: Styles.black3,
    down: Styles.black5
  });
  global.svn.st.flatt = flatt;
}catch(e){
  Log.err(module.id + ": " + e);
}