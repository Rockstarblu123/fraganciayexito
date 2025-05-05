const puppeteer = require('puppeteer');

const instagram = {
  username: 'fragancia_y_exito',
  password: '*k9ñ;p6Y@'
};

// Función mejorada de espera con randomización
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
    await page.goto('https://www.instagram.com/accounts/login/', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await randomDelay(2000, 3000);
    await page.waitForSelector('input[name="username"]', { visible: true, timeout: 15000 });
    
    // Escribir credenciales con retraso humano
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

    // Scroll y click con movimiento humano
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

    // 4. Verificar redirección a Instagram
    if (page.url().includes('instagram.com')) {
      console.log('🔄 Redireccionado a Instagram');
      // Aquí puedes agregar más interacciones si es necesario
    }

    console.log('🎉 Flujo completado con éxito');
    await randomDelay(10000, 15000);

  } catch (error) {
    console.error('❌ Error crítico:', error);
    await page.screenshot({ path: 'error.png' });
    console.log('📸 Captura de error guardada como error.png');
  } finally {
    // await browser.close(); // Comentado para inspección manual
    console.log('⚠️ Mantén esta ventana abierta para inspección o Ctrl+C para cerrar');
  }
})();