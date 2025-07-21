const puppeteer = require('puppeteer');

async function generatePDF(url, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.pdf({ path: outputPath, format: 'A4' });
  await browser.close();
}

// Usage
generatePDF('https://google.com', 'google.pdf')
  .then(() => console.log('PDF generated successfully'))
  .catch(err => console.error('Error generating PDF:', err));
