import express from 'express';
import puppeteer from 'puppeteer';

export class Server {

    constructor({ port }) {
        this.port = port;
        this.app = express();
    }

    start = () => {

        this.app.use(express.json());
        this.app.use('/html2pdf/content', express.text({ type: 'text/html' }));

        this.app.get('/ping', this.ping);
        this.app.post('/echo', this.echo);
        this.app.post('/html2pdf/url', this.htmpToPdfUrl);
        this.app.post('/html2pdf/content', this.htmpToPdfContent);

        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
        });

    }

    ping = (req, res) => {
        res.send('pong');
    }

    echo = (req, res) => {
        console.log(req.body);
        res.send(req.body);
    };


    htmpToPdfUrl = async (req, res) => {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required in the request body' });
        }

        let browser;
        try {
            browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle0' });

            const pdfBuffer = await page.pdf({ format: 'A4' });

            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=generated.pdf',
                'Content-Length': pdfBuffer.length,
            });

            res.send(pdfBuffer);
        } catch (error) {
            console.error('PDF generation error:', error);
            res.status(500).json({ error: 'Failed to generate PDF' });
        } finally {
            if (browser) await browser.close();
        }
    };

    htmpToPdfContent = async (req, res) => {
        const  html = req.body;

        if (!html) {
            return res.status(400).json({ error: 'HTML content is required in the request body' });
        }

        let browser;
        try {
            browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.setContent(html, { waitUntil: 'networkidle0' });

            const pdfBuffer = await page.pdf({ format: 'A4' });

            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=generated.pdf',
                'Content-Length': pdfBuffer.length,
            });

            res.send(pdfBuffer);
        } catch (error) {
            console.error('PDF generation error:', error);
            res.status(500).json({ error: 'Failed to generate PDF' });
        } finally {
            if (browser) await browser.close();
        }
    }

}

