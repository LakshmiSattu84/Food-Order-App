import { useContext } from "react";
import CartContext from "../store/CartContext.jsx";
import Modal from "../UI/Modal.jsx";
import { currencyFormatter } from "../util/formatting.js";
import Input from "../UI/Input.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import Button from "../UI/Button.jsx";
import useHttp from "../hooks/useHttp.js";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};
export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);
    const { data, isLoading, error, sendRequest, clearData} = useHttp('http://localhost:3000/orders', requestConfig);

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + (item.price * item.quantity), 0);

    function handleClose() {
        userProgressCtx.hideCheckout();
    }

    function handleFinish() {
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }

    function handleSubmit(event) {
        event.preventDefault();

        const fd = new FormData(event.target);
        const customerData = Object.fromEntries(fd.entries()); // { email: xyz@gmail.com }

        sendRequest(JSON.stringify({
            order: {
             items: cartCtx.items,
             customer: customerData
            }
         }));

    }

    if (data && !error) {
        return (
            <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleFinish}>
                <h2>Success!!</h2>
                <p>Your Order was submitted Successfully!!</p>
                <p>We will get back to you with more details within next few mins.</p>
                <p className="modal-actions">
                    <Button onClick={handleFinish}>Okay</Button>
                </p>
            </Modal>
        )
    }

    return (
        <Modal open={userProgressCtx.progress === 'checkout'}>
            <form onSubmit={handleSubmit}>
                <h2>Checkout</h2>
                <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

                <Input label="Full Name" type="text" id="name" />
                <Input label="Email Address" type="email" id="email" />
                <Input label="Street" type="text" id="street" />

                <div className="control-row">
                    <Input label="Postal Code" type="text" id="postal-code" />
                    <Input label="City" type="text" id="city" />
                </div>

                <div className="modal-actions">
                    <Button type="button" textOnly onClick={handleClose}>Close</Button>
                    <Button>Submit Order</Button>
                </div>
            </form>
        </Modal>
    );
}