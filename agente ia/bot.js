const puppeteer = require('puppeteer');

const instagram = {
  username: 'fragancia_y_exito',
  password: '*k9ñ;p6Y@'
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

    // 1. Login en Instagram
    console.log('🌐 Iniciando sesión en Instagram...');
    await page.goto('https://www.instagram.com/', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await randomDelay(2000, 3000);
    await page.waitForSelector('input[name="username"]', { visible: true, timeout: 15000 });
    
    await page.type('input[name="username"]', instagram.username, { 
      delay: 80 + Math.random() * 100 
    });
    await randomDelay(1000, 1500);
    
    await page.type('input[name="password"]', instagram.password, {
      delay: 100 + Math.random() * 150
    });
    await randomDelay(1500, 2000);
    
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
    console.log('✅ Sesión de Instagram iniciada');
    await randomDelay(3000, 5000);

    // 2. Navegar a Facebook Business
    console.log('🚀 Accediendo a Facebook Business...');
    await page.goto('https://business.facebook.com/', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    await randomDelay(3000, 5000);

    // 3. Hacer clic en el botón de Instagram
    console.log('🔍 Buscando botón de login con Instagram...');
    const instagramButton = '#login-panel-container > div > div > div > div:nth-child(4) > div > div';
    
    await page.waitForSelector(instagramButton, {
      visible: true,
      timeout: 15000
    });

    await page.evaluate((selector) => {
      document.querySelector(selector).scrollIntoView();
    }, instagramButton);
    
    await randomDelay(1000, 2000);
    await page.click(instagramButton, {
      delay: 100 + Math.random() * 100,
      button: 'left'
    });
    console.log('✅ Botón de Instagram clickeado');
    await randomDelay(5000, 8000);

    // 4. Click en bandeja de mensajes (después de redirección)
    console.log('📨 Accediendo a mensajes...');
    const messagesButton = '#mount_0_0_6c > div > div:nth-child(1) > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div.x78zum5.xdt5ytf.x10cihs4.x1t2pt76.x1n2onr6.x1ja2u2z > span > div > div > div:nth-child(3) > div > div > div.xrbpyxo.x5yr21d.x1y5idc5 > div > div > div.x1iyjqo2.xs83m0k.x6ikm8r.x10wlt62 > div > div.x78zum5.xdt5ytf.x1iyjqo2.x1n2onr6 > nav > ul > div > div:nth-child(3) > div > li > div > div > a';
    
    // Esperar a que el dashboard esté completamente cargado
    await page.waitForSelector(messagesButton, {
      visible: true,
      timeout: 50000
    });

    await randomDelay(5000, 7000);
    await page.evaluate((selector) => {
      document.querySelector(selector).scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, messagesButton);

    await randomDelay(5000, 7000);
    await page.click(messagesButton, {
      delay: 150 + Math.random() * 150,
      button: 'left'
    });
    console.log('✅ Bandeja de mensajes abierta');
    await randomDelay(5000, 8000);

    console.log('🎉 Flujo completado con éxito');

  } catch (error) {
    console.error('❌ Error crítico:', error);
    await page.screenshot({ path: 'error.png' });
    console.log('📸 Captura de error guardada como error.png');
  } finally {
    console.log('⚠️ Mantén esta ventana abierta para inspección o Ctrl+C para cerrar');
    // await browser.close(); // Descomentar para cierre automático
  }
})();