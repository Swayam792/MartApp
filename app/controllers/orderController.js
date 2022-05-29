const { session } = require('passport/lib')
const Order = require('../models/order')

const orderController = () =>{
     return {
        async index (req, res) {
            const orders = await Order.find({ customerId : req.user._id}, null, {sort : { 'createdAt': -1 }});            
             res.header('Cache-Control', 'no-store')
             return res.render('./customer/orderTracking', {orders : orders})
         },
         async orderDetails(req, res){
            const order = await Order.find({ _id : req.params.order_id});             
            return res.render('./customer/orderDetails', {order : order[0]})
         },
         postOrder(req, res){
            const {address, phone} = req.body;
            
            if(!address || !phone){
                req.flash('error','All field required');
                return res.redirect('/cart');
            }

            const order = new Order({
                customerId : req.user._id,
                phone: phone,
                address : address,
                items : req.session.cart
            });

            order.save()
            .then((result) => {
                console.log("Order save successfully", result);
                req.session.cart.TotalQty = 0;
                if( req.session.cart.TotalQty == 0){
                    delete req.session.cart;
                }
                return res.redirect('/');
            }).catch((err) => {
                console.log("Error Occure", err);
                return res.redirect('/cart')
            })
         }
     }
}

module.exports = orderController;