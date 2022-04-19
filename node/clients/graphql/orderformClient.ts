import {
    AppGraphQLClient,
    GraphQLClient,
    InstanceOptions,
    IOContext,
    RequestConfig,
    Serializable,
  } from "@vtex/api";
  
  /**
   * App class grhapql client to connect to IO apps of type graphql client
   */
  export class OrderformClient extends AppGraphQLClient {
    protected graphql: GraphQLClient;
  
    constructor(context: IOContext, options?: InstanceOptions) {
      super("vtex.checkout-graphql@0.x", context, options);
      this.graphql = new GraphQLClient(this.http);
    }
    public query = async <T extends Serializable>(
      query: string,
      variables: any,
      extensions: any,
      config: RequestConfig
    ) => {
      return this.graphql.query<T, GetOrderformInput>(
        {
          extensions,
          query,
          variables,
        },
        {
          ...config,
          params: {
            ...config.params,
            locale: this.context.locale,
          },
          url: "",
        }
      );
    };
  }
  