// var location = window.location;

const cartController = () => {
     return {
        index(req, res){
           return res.render('customer/cart');
        },
        update(req,res){
           
            if(!req.session.cart){
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart;

            // Check if item does not exist in cart
            if(!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + parseInt(req.body.price);
            } else {
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice =  cart.totalPrice + parseInt(req.body.price);
            }
            // req.session.cart = cart;
            return res.json({ totalQty: req.session.cart.totalQty });
        },
        delete(req, res){
            let cart = req.session.cart;
            
            // Update the cart price
            let price = (cart.items[req.body.item._id].qty) * (cart.items[req.body.item._id].item.price);
            let qty = cart.items[req.body.item._id].qty;
            cart.totalPrice = cart.totalPrice - price;   
            cart.totalQty = cart.totalQty - qty; 
            delete cart.items[req.body.item._id]
            //req.session.cart = cart;       
            if(cart.totalQty == 0){
                delete req.session.cart;
            }            
            res.redirect('/cart'); 
        }
     }
}

module.exports = cartController;