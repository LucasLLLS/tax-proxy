import { IOClients } from '@vtex/api'

import { Catalog } from './catalog'
import { Checkout } from './checkout'
import { GetOrderformClient } from './graphql'
import { JanisClient } from './janis'
import { Logistics } from './logistics'
import Orderform from './orderform'
import { TaxProvider } from './taxProvider'

export class Clients extends IOClients {
  public get checkout() {
    return this.getOrSet('checkout', Checkout)
  }

  public get logistics() {
    return this.getOrSet('logistics', Logistics)
  }

  public get catalog() {
    return this.getOrSet('catalog', Catalog)
  }

  public get taxProvider() {
    return this.getOrSet('taxProvider', TaxProvider)
  }
  public get JanisClient() {
    return this.getOrSet('janisClient', JanisClient)
  }

  // * GRAPHQL CLIENT
  public get orderformClient() {
    return this.getOrSet("orderformClient", GetOrderformClient);
  }

  public get orderform() {
    return this.getOrSet("orderform", Orderform);
  }
}
