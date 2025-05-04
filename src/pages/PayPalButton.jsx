import { useEffect } from "react";

const PayPalButton = ({ total, onSuccess }) => {
  useEffect(() => {
    const addPaypalScript = () => {
      const script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=AeqsWweTyQ43_HYsTr-RlayDARhG3JegZeG_8YVcOVGmVJfhtZ1xp5l1ZFAjAht8cTflMBOaqZRsX4BP&currency=USD";
      script.addEventListener("load", () => {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: total.toFixed(2),
                  },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              onSuccess(details); // gọi hàm xử lý khi thanh toán thành công
            });
          },
        }).render("#paypal-button-container");
      });
      document.body.appendChild(script);
    };

    addPaypalScript();
  }, [total, onSuccess]);

  return <div id="paypal-button-container" className="mt-4" />;
};

export default PayPalButton;