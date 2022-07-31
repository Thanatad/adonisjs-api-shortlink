import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UrlLink from '../../Models/UrlLink'

export default class RedirectsController {

  public async redirect(ctx: HttpContextContract) {
    const urlLink = await UrlLink.findBy('code', ctx.params.code)
    if (urlLink) {
      ctx.response.redirect(urlLink.url)
    } else {
      ctx.response.status(404)
    }
  }

}
