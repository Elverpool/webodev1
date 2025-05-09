function setLightMode() {
    document
      .getElementById('theme-stylesheet')
      .setAttribute('href', '../styles/sunstyle.css');
}

function setDarkMode() {
    document
      .getElementById('theme-stylesheet')
      .setAttribute('href', '../styles/nightstyles.css');
}
//Aynı kodu iki kere yazma sebebimizi şu, index sayfasında yukardaki komutu çalıştırdığımızda başka bir klasöre gitmeye çalışıyor başında ../ olduğu için. O yüzden index sayfasına özel kod yazmamız lazım.
function isetLightMode() {
    document
      .getElementById('theme-stylesheet')
      .setAttribute('href', 'styles/sunstyle.css');
}

function isetDarkMode() {
    document
      .getElementById('theme-stylesheet')
      .setAttribute('href', 'styles/nightstyles.css');
}
