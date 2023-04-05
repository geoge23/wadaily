import Cache from 'node-cache'
import Parser from 'rss-parser'
import * as cheerio from 'cheerio'

const RSS_URL = "https://thebutterknifewa.com/feed/"

const butterknifeCache = new Cache()
const parser = new Parser()

export default async function getButterknifeArticles() {
    let articles = butterknifeCache.get('articles')
    if (articles == undefined) {
        const feed = await parser.parseURL(RSS_URL)
        articles = feed.items.map(e => {
            return {
                title: e.title,
                url: e.link,
                image: getImageURLFromArticle(e)
            }
        })
        articles = articles
            .sort((a, b) => {
                if (!a.image) return 1
                if (!b.image) return -1
                return new Date(b.date) - new Date(a.date)
            })
            .map(e => {
                // If the image doesn't exist or is not from thebutterknifewa, replace it with the logo
                if (!e.image || !/thebutterknifewa\.files\.wordpress\.com/.test(e.image)) return { ...e, image: 'https://thebutterknifewa.files.wordpress.com/2023/01/butterknife-logo-1.png' }
                return e
            })
        butterknifeCache.set('articles', articles, 6000)
    }
    return articles
}

function getImageURLFromArticle(article) {
    const $ = cheerio.load(article['content:encoded'])
    const image = $('img').first()
    const src = image.attr('src')
    return src
}