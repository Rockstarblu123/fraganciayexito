const puppeteer = require('puppeteer');

const instagram = {
  username: 'ku3ntaf4ke',
  password: '3311546193'
};

const randomDelay = (min, max) => new Promise(resolve => 
  setTimeout(resolve, min + Math.random() * (max - min)));

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: [
      '--start-maximized',
      '--disable-notifications',
      '--disable-blink-features=AutomationControlled',
      '--lang=es-ES'
    ],
    defaultViewport: null
  });

  try {
    const page = await browser.newPage();
    
    // Configuración anti-detección
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.evaluateOnNewDocument(() => {
      delete navigator.__proto__.webdriver;
    });

    // 2. Navegar a Facebook Business
    console.log('🚀 Accediendo a Facebook Business...');
    await page.goto('https://business.facebook.com/', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    await randomDelay(3000, 5000);

    console.log('proceso correctamente en la bandeja de mensajes');

    

  } catch (error) {
    console.error('❌ Error crítico:', error);
    await page.screenshot({ path: 'error.png' });
    console.log('📸 Captura de error guardada como error.png');
  } finally {
    console.log('⚠️ Mantén esta ventana abierta para inspección o Ctrl+C para cerrar');
    // await browser.close(); // Descomentar para cierre automático
  }
})();