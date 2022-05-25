const Menu  = require('../models/menu')

const menuController =  () =>{
   return{
        async index (req, res) {
            const items = await Menu.find();
            return res.render('products/ourProduct', {items: items});
        }
   }  
}

module.exports = menuController;