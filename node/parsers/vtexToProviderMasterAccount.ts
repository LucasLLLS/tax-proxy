import { LogLevel } from '@vtex/api'

export const vtexToProviderMasterAccount = async (checkoutRequest: any, ctx: Context) => {
  // Parse here the checkout request to the expected format
  try {
    if(checkoutRequest.orderFormId == null || checkoutRequest.orderFormId == undefined){
      // not going to call anything
      ctx.vtex.logger.log({
        message: 'nullOrderform',
        detail:{
          data: checkoutRequest

        },
      },LogLevel.Warn)
    }
    // console.log("before tndTaxRequestWithoutAn")
    const response = await ctx.clients.JanisClient.tndTaxRequest(checkoutRequest, ctx.query.an)
    // console.log("after tndTaxRequestWithoutAn")
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
      },LogLevel.Error)
    }else{
      ctx.vtex.logger.log({
        message: 'janisClientError',
        detail:{
          error,
          an: ctx.query.an,
        },
      },LogLevel.Error)
    }
    return []
  }
}
