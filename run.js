const { firefox } = require('playwright');
const fs = require('fs');

async function recursiveScrape(startUrl, maxDepth = 2, limit = 100) {
    const browser = await firefox.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 854, height: 480 }
    });
    // 854x480;


    const visited = new Set();
    const queue = [{ url: startUrl, depth: 0 }];
    const results = [];

    while (queue.length > 0) {
        const { url, depth } = queue.shift();

        // Skip if already visited or too deep
        if (visited.has(url) || depth > maxDepth) continue;

        console.log(`🚀 Scraping (${depth}/${maxDepth}): ${url}`);
        visited.add(url);
        limit--;
        if (limit <= 0) {
            console.log('⚠️  Limit reached, stopping crawl.');
            break;
        }

        const page = await context.newPage();
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded'}, { timeout: 100000 });

            await page.waitForTimeout(3000);

            // 1. EXTRACT DATA (Adjust selectors for your target)
            const pageData = await page.evaluate(() => ({
                title: document.title,
                h1: document.querySelector('h1')?.innerText,
                context: document.querySelector('.mw-parser-output')?.innerHTML
            }));
            results.push({ url, ...pageData });
            filename = `results/${url.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
            fs.writeFileSync(filename, JSON.stringify(pageData, null, 2));
            console.log(`Results saved to ${filename}`);

            // 2. FIND NEW LINKS
            if (depth < maxDepth) {
                const links = await page.$$eval('a', as => as.map(a => a.href));
                for (const link of links) {
                    // Only follow internal links (example)
                    if (link.startsWith(startUrl) && !visited.has(link)) {
                        queue.push({ url: link, depth: depth + 1 });
                    }
                }
            }
        } catch (err) {
            console.error(`❌ Failed ${url}: ${err.message}`);
        } finally {
            await page.close();
        }
    }

    await browser.close();


    return results;
}

results = recursiveScrape('https://terraria.fandom.com/wiki/', 1,10)