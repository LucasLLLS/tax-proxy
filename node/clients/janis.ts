import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'
import { getConfig } from '../credentials/credentials'

export class JanisClient extends ExternalClient {
  public constructor(ctx: IOContext, options?: InstanceOptions) {
    super(getConfig(ctx).baseUrl, ctx, options)
  }

  public async tndTaxRequest(data: CheckoutRequest,an:string) {
    const config = getConfig(this.context)
    // console.log("janis config")
    // console.log(config)
    return this.http.postRaw(config.taxHub + `?seller=${an}`, data, {
      headers: {
        'Accept': 'application/json',
        Authorization: config.loginCredentials.Authorization,
        'Content-Type': 'application/json',
        'janis-client': config.loginCredentials.janisClient,
        'Proxy-Authorization': this.context.authToken,
        'X-Vtex-Use-Https': true,
        'header-tax-proxy': 'back'
      },
    })
  }

  public async tndTaxRequestWithoutAn(data: CheckoutRequest) {
    const config = getConfig(this.context)
    // console.log("janis config")
    // console.log(config)
    // console.log(data)
    return this.http.postRaw(config.taxHub, data, {
      headers: {
        'Accept': 'application/json',
        Authorization: config.loginCredentials.Authorization,
        'Content-Type': 'application/json',
        'janis-client': config.loginCredentials.janisClient,
        'Proxy-Authorization': this.context.authToken,
        'X-Vtex-Use-Https': true,
      },
    })
  }
}
