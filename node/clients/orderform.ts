import { InstanceOptions, IOContext, ExternalClient } from "@vtex/api";
import { getConfig } from '../credentials/credentials'

export default class Orderform extends ExternalClient {
    constructor(ctx: IOContext, options?: InstanceOptions) {
      super("https://api.vtex.com", ctx, {
        ...options,
        headers: {
          ...options?.headers,
          'X-VTEX-API-AppKey': getConfig(ctx).appKey,
          'X-VTEX-API-AppToken': getConfig(ctx).appToken,
        },
      })
      console.log(options?.headers)
    }


    public orderFormRaw = (orderFormId?: string, refreshOutdatedData = false) => {
        return this.http.getRaw<CheckoutOrderForm>(
          this.routes.orderForm(
            orderFormId,
            this.getOrderFormQueryString(refreshOutdatedData)
          ),
          { metric: 'checkout-orderForm' }
        )
      }

      private get routes() {
        const base = '/api/checkout/pub'
        return {
          orderForm: (orderFormId?: string, queryString?: string) =>
            `${base}/orderForm/${orderFormId ?? ''}${queryString}`,

        }
      }
      private getOrderFormQueryString = (refreshOutdatedData?: boolean) => {
        // if (refreshOutdatedData)
        //   return `?refreshOutdatedData=${refreshOutdatedData}`
        console.log(refreshOutdatedData)
        // console.log("GET ORDER FORM")
        // console.log(this.context.account)
        return `?an=${this.context.account}&disableAutoCompletion=true`
      }
}
