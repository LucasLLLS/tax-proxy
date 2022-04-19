import { LogLevel } from '@vtex/api'
import { json } from 'co-body'
import { updateOrderform } from '../dynamo/operations/orderformId'
// import { getInfoBySku } from '../utils/producstInformation'

/*
This handler is responsible for receiving the request from the checkout,
which has an specific format; this request is going to be parsed to have
the format that is expected on the provider side. After that, it will call
the method that uses the provider API. It will give a response with the
taxes information. With that, it's necessary to parse it again to the
format that VTEX expects and this will be assigned to the body
*/
export async function saveOrderform(
  ctx: Context,
  next: () => Promise<unknown>
) {
  const body = await json(ctx.req)
  // console.log("-------------------saveOrderForm-------------------", body)

  try {
    let document = body.document
    if(document.includes('*')) {
      let fullOrderForm = await ctx.clients.orderform.orderFormRaw(body.orderformId);
      document = fullOrderForm?.data?.clientProfileData?.document
    }

    await updateOrderform(body.orderformId, ctx.vtex.account, document, new Date().getTime())
    ctx.vtex.logger.log({
      message: 'proxyRequest',
      detail:{
        type: 'saveOrderForm',
        orderFormId: body.orderformId
      },
    },LogLevel.Info)

    // Mounting the response body
    ctx.status = 201
  } catch (error) {
     ctx.status = 500
  }

  // Necessary so the Checkout can understand body's format
  ctx.set('Content-Type', 'application/vnd.vtex.checkout.minicart.v1+json')

  await next()
}
