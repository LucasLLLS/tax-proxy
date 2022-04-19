import { LogLevel } from '@vtex/api'
import { json } from 'co-body'
import { getOrderFormId } from '../dynamo/operations/orderformId'
import { vtexToProvider } from '../parsers/vtexToProvider'
// import { vtexToProviderMasterAccount } from '../parsers/vtexToProviderMasterAccount'
// import { getInfoBySku } from '../utils/producstInformation'

/*
This handler is responsible for receiving the request from the checkout,
which has an specific format; this request is going to be parsed to have
the format that is expected on the provider side. After that, it will call
the method that uses the provider API. It will give a response with the
taxes information. With that, it's necessary to parse it again to the
format that VTEX expects and this will be assigned to the body
*/
export async function taxSimulation(
  ctx: Context,
  next: () => Promise<unknown>
) {

  const {
    vtex: { workspace, account },
  } = ctx

  const body: CheckoutRequest = await json(ctx.req)
  let orderformId;
  try {


    // console.log("taxSimulation before adding orderFormid", body)

    // skip proxy if is master account
    // if(body.orderFormId) {
    //   let janisResponse: any = [ { id: 0, taxes: [  ] } ]
    //   janisResponse = await vtexToProviderMasterAccount(body, ctx)
    //   // console.log("janis", janisResponse)
    //   ctx.body = {
    //     hooks: [
    //       {
    //         major: 1,
    //         url: `https://${workspace}--${account}.myvtex.com/app/tax-provider/oms/invoice`,
    //       },
    //     ],
    //     itemTaxResponse: janisResponse,
    //   }
    //   ctx.set('Content-Type', 'application/vnd.vtex.checkout.minicart.v1+json')

    //   // console.log(ctx.body)

    //   return await next()
    // }

    // console.log("fuera del if")


    // Get the orderform-client from dynamo
    orderformId = await getOrderFormId(ctx.vtex.account,body.clientData.document)

    // console.log("--------------ofid------------")
    // console.log(orderformId)

    ctx.vtex.logger.log({
      message: 'proxyRequest',
      detail:{
        type: 'query',
      },
    },LogLevel.Info)

    if(orderformId.Items!.length>0){ // there is an orderform
      body.orderFormId = orderformId.Items![0].orderformId
    }else{ // If there isn't a orderform, wait a sec and ask again
      await sleep(300)
      orderformId = await getOrderFormId(ctx.vtex.account,body.clientData.document)
      ctx.vtex.logger.log({
        message: 'proxyRequest',
        detail:{
          type: 'retry',
          orderFormId: orderformId
        },
      },LogLevel.Info)
      if(orderformId.Items!.length>0){ // there is an orderform
        body.orderFormId = orderformId.Items![0].orderformId
      }else{
        ctx.vtex.logger.log({
          message: 'cant get orderformId',
          detail:{
            body,
            an: ctx.query.an,
            orderFormId: orderformId
          },
        },LogLevel.Error)
      }
    }
  } catch (error) {
    ctx.vtex.logger.log({
      message: 'cant get orderformId',
      detail:{
        body,
        an: ctx.query.an,
        orderformId: orderformId
      },
    },LogLevel.Error)
  }



  // Example of using Catalog Client to retrieve SKU information by ID
  // const productItems = await getInfoBySku(ctx, body)
  // console.log("taxSimulation adding orderFormid", body)

  // console.log("janis request body", body)

  // const sleep = (duration: any) => new Promise(resolve => {
  //   setTimeout(() => { resolve(null) }, duration)
  // })

  // await sleep(4000)

  // console.log(ctx)
  let janisResponse: any = [ { id: 0, taxes: [  ] } ]
  if(orderformId && orderformId.Items!.length>0){
    janisResponse = await vtexToProvider(body, ctx)
  }
  // const janisResponse = [ { id: 0, taxes: [  ] } ]
  // janisResponse = await vtexToProvider(body, ctx)
  // console.log("janis", janisResponse)
  // if(janisResponse.length > 0) {
  //   console.log("janis", janisResponse[0].taxes)
  // }

  // Mounting the response body
  ctx.body = {
    hooks: [
      {
        major: 1,
        url: `https://${workspace}--${account}.myvtex.com/app/tax-provider/oms/invoice`,
      },
    ],
    itemTaxResponse: janisResponse,
  }

  // console.log(ctx.body)

  // Necessary so the Checkout can understand body's format
  ctx.set('Content-Type', 'application/vnd.vtex.checkout.minicart.v1+json')

  await next()
}

function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
