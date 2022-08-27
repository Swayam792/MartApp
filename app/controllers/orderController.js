const { session } = require('passport/lib')
const Order = require('../models/order')

const orderController = () =>{
     return {
        async index (req, res) {
            const orders = await Order.find({ customerId : req.user._id}, null, {sort : { 'createdAt': -1 }});            
             res.header('Cache-Control', 'no-store')
             res.render('customer/orderTracking', {orders : orders})
         },
         async orderDetails(req, res){
            const order = await Order.findById(req.params.order_id);
                
            if(order && req.user._id.toString() === order.customerId.toString()){
               return res.render('customer/orderDetails', {order : order});
            }
            return res.redirect('/');
             
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
                Order.populate(result, { path : 'customerId' }, (err, result) => {
                    req.session.cart.TotalQty = 0;
                    if( req.session.cart.TotalQty == 0){
                        delete req.session.cart;
                    }
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderChanged', "add" , result);
                    return res.redirect('/');                    
                })
                // console.log("Order save successfully", result);
            }).catch((err) => {
                console.log("Error Occure", err);
                return res.redirect('/cart')
            })
         },
         cancelOrder (req, res) {
             const orderId = req.body._id;          
              
             Order.findByIdAndDelete(orderId).then((result) =>{                
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderChanged', "delete" , result);    
             }).catch((err) =>{
                console.log(err);
             })
              
             res.redirect('/track-order');
         }
     }
}

module.exports = orderController;