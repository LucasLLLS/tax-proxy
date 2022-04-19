import { Serializable } from "@vtex/api";
import { OrderformClient } from "./orderformClient";
import { getOrderForm } from "./queries/orderformQuery";


const getOrderformExtensions = {
    orderForm: {
    provider:"vtex.checkout-graphql@0.x",
    sender: "vtex.tax-proxy@0.x",
  },
};

// interface PromisingQueryResponse {
//   promisingQuery: GetOrderformInput;
// }

export class GetOrderformClient extends OrderformClient {
  public getOrderForm = <T extends Serializable = any>(
    variables: any,
    query: string = getOrderForm
  ) =>
    this.query<T>(query, variables, getOrderformExtensions, {
      metric: "get-orderform",
    });
}
