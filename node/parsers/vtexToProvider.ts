import { LogLevel } from '@vtex/api'

export const vtexToProvider = async (checkoutRequest: any, ctx: Context) => {
  // Parse here the checkout request to the expected format
  try {
    if(checkoutRequest.orderFormId == null || checkoutRequest.orderFormId == undefined){
      // not going to call anything
      ctx.vtex.logger.log({
        message: 'nullOrderform',
        detail:{
          data: checkoutRequest

        },
      }, LogLevel.Warn)
      return []
    } else {

      // const sleep = (duration: any) => new Promise(resolve => {
      //   setTimeout(() => { resolve(null) }, duration)
      // })
      // console.log("1")
      // await sleep(0)
      // console.log("2")
      // console.log(new Date())
      // const responseOrderform: any = await ctx.clients.orderformClient.getOrderForm({orderformId: checkoutRequest.orderFormId})
      // console.log("1--------------------", responseOrderform.data.orderForm.clientProfileData)
      // console.log("1--------------------", responseOrderform.data.orderForm.paymentData)
      // checkoutRequest.clientData = responseOrderform.data.orderForm.clientProfileData
      // checkoutRequest.paymentData = responseOrderform.data.orderForm.paymentData
      // console.log(checkoutRequest.paymentData)
      // console.log(new Date())
      const responseOrderform2: any = await ctx.clients.orderform.orderFormRaw(checkoutRequest.orderFormId);
      // console.log("1--------------------")
      // console.log("2--------------------", responseOrderform2.status)
      // console.log("2--------------------", responseOrderform2.data)
      checkoutRequest.clientData = responseOrderform2.data.clientProfileData
      checkoutRequest.paymentData = responseOrderform2.data.paymentData

      // console.log("3--------------------", responseOrderform2.status !== 200)
      // console.log("4--------------------", responseOrderform2.status !== '200')
      if (responseOrderform2.status !== 200) {
        return []
      }
      // console.log(new Date())

      // checkoutRequest.paymentData = {
      //   payments: [{
      //     paymentSystem: responseOrderform2.data.paymentData.payments[0].paymentSystem,
      //     installments: responseOrderform2.data.paymentData.payments[0].installments
      //   }]
      // }
      // if(responseOrderform.data.orderForm.orderFormId == "b564f45939d64f4b8bbd0469512bd30c"){
      //   console.log(checkoutRequest.paymentData)
      // }
      // console.log(checkoutRequest.paymentData)


    }
  } catch (error) {
    if(error.code == 'ECONNABORTED'){
      ctx.vtex.logger.log({
        message: 'orderFormTimeout',
        detail:{
          error,
          an: ctx.query.an,
        },
      }, LogLevel.Error)
    } else {
      ctx.vtex.logger.log({
        message: 'orderFormError',
        detail:{
          error,
          an: ctx.query.an,
        },
      }, LogLevel.Error)
    }
    return []
  }
  try {
    // return []
    // console.log("TND Body------")
    // console.log(checkoutRequest)
    const response = await ctx.clients.JanisClient.tndTaxRequest(checkoutRequest, ctx.query.an)
    // console.log("after TND Request")
      ctx.vtex.logger.log({
        message: 'janisClientResponse',
        detail:{
          status: response.status,
          data: response.data,
          headers: response.headers

        },
      },LogLevel.Info)

      // console.log("\n\n\n\n@@@@@@@@@@\n",JSON.stringify(checkoutRequest),"\nJANIS RESPONSE ",JSON.stringify(response.data));

      return response.data
  } catch (error) {
    // console.log(error.config.baseURL);
    // console.log("error", error)

    if(error.code == 'ECONNABORTED'){
      ctx.vtex.logger.log({
        message: 'janisClientTimeout',
        detail:{
          error,
          an: ctx.query.an,
        },
      }, LogLevel.Error)
    } else {
      ctx.vtex.logger.log({
        message: 'janisClientError',
        detail:{
          error,
          an: ctx.query.an,
        },
      }, LogLevel.Error)
    }
    return []
  }
}
