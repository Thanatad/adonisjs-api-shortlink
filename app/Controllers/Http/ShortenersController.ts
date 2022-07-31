import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import UrlLink from '../../Models/UrlLink'
import shortid from 'shortid'
// import urlExists from 'url-exists-deep';
const urlExists = require('url-exists-deep');

export default class ShortenersController {

  public async index() {
    const urlLink = await UrlLink.all()
    return urlLink
  }


  public async createShortUrl(ctx: HttpContextContract) {
    {

      const url = await this.checkUrlExist(ctx.request.input('url'))
      const code = await this.checkCodeExist(shortid.generate())

      if (url === 2) {
        const urlLink = new UrlLink()
        urlLink.url = ctx.request.input('url')
        urlLink.code = code
        await urlLink.save()
        return this.customResponeUrl(urlLink)
      } else if (url === 1) {
        const urlLink = await UrlLink.findBy('url', ctx.request.input('url'))
        return this.customResponeUrl(urlLink)
      } else {
        return ctx.response.status(400).send({ message: 'URL is valid or exit' })
      }

    }
  }

  private async customResponeUrl(url: UrlLink | null) {
    return url?.serialize({
      fields: ['id', 'url', 'code', 'base_url', 'created_at']
    })
  }

  private async checkCodeExist(code: string) {
    const urlCode = await UrlLink.findBy('code', code)
    if (urlCode) {
      return shortid.generate()
    }
    return code
  }

  /**
   *
   * @param url
   * @returns 1 if url is data
   * @returns 2 if url is exist on database
   * @returns 3 if url is exist link
   * @returns
   */
  private async checkUrlExist(url: string) {
    const isUrlExist = await urlExists(url);
    if (isUrlExist) {
      const urlLink = await UrlLink.findBy('url', url)
      if (urlLink) {
        return 1
      } else {
        return 2
      }
    } else {
      return 3
    }
  }
}
