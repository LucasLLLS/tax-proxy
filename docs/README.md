### PIXEL
```
$(window).on("orderFormUpdated.vtex", function (evt, orderForm) {
  if (
    orderForm.clientProfileData &&
    orderForm.clientProfileData.document &&
    orderForm.clientProfileData.document.length > 0
  ) {
    var settings = {
      url: "/app/tax-proxy/checkout/orderform",
      type: "POST",
      data: JSON.stringify({
        orderformId: orderForm.orderFormId,
        document: orderForm.clientProfileData.document,
      }),
    };

    // if(reUpdateOrderForm % 3 == 0 && window.location.hash == "#/payment" )
    if (
      paymentDataGlobal &&
      orderForm.paymentData.payments[0] &&
      (paymentDataGlobal.payments[0].installments !=
        orderForm.paymentData.payments[0].installments ||
        paymentDataGlobal.payments[0].paymentSystem !=
          orderForm.paymentData.payments[0].paymentSystem)
    ) {
      vtexjs.checkout
        .getOrderForm()
        .then(function (orderForm) {
          paymentDataGlobal = orderForm.paymentData;
          return vtexjs.checkout.sendAttachment(
            "paymentData",
            orderForm.paymentData
          );
        })
        .done(function (orderForm) {
          // console.log(orderForm)
          // console.log(orderForm.paymentData)
        });
    }
  }
  $.ajax(settings).done(function () {
    reUpdateOrderForm = reUpdateOrderForm + 1;
  });
});
```
