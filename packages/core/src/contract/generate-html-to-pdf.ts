import puppeteer, { PDFOptions } from 'puppeteer';

export const generateHtmlToPdf = async ({
  html,
  pdfOptions,
}: {
  html: string;
  pdfOptions?: PDFOptions;
  metadata: object;
}): Promise<Buffer> => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf(pdfOptions);
    await page.close();
    return Buffer.from(pdfBuffer);
  } catch (error) {
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
