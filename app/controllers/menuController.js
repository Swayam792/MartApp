const Menu  = require('../models/menu')

const menuController =  () =>{
   return{
        async index (req, res) {
            const items = await Menu.find();
            return res.render('products/ourProduct', {items: items});
        },
        async getCategory (req, res) {
            const category = req.params.name; 
                      
            let items = await Menu.find(); 
                
            items = items.filter((item) => {
               return item.category === category
            })
           
            return res.render('products/ourProduct', {items: items});       
        }
   }  
}

module.exports = menuController;