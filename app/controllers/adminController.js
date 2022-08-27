const { then } = require('laravel-mix');
// const { initAdmin } = require('../../resources/js/admin');
const Menu = require('../models/menu');
const Order = require('../models/order');
 

const adminController = () => {
      return {
          index(req, res){
             return res.render('admin/adminPage')    
          },
          async manage_items(req, res) {
              const items = await Menu.find({});
              return res.render('admin/manageItem', {items : items})
          },
          postItem (req, res) {
              const { name,category, price, image } = req.body;
              name = name.trim();
              price = price.trim();
              image = image.trim();
              category = category.trim();
              if(!name || !price || !image){
                  req.flash("error","All field is mandotory");
                  return res.redirect('/admin/manage-items');
              }

              const menu = new Menu( {
                  name: name,
                  category: category,
                  price: price,
                  image: image
              });

              menu.save()
              .then((result) => {
                  console.log('Item Added Successfully');;                                   
              }).catch((err) => {
                  console.log(err);                   
              })
              return res.redirect('/admin/manage-items');
          },
          async updateItem (req, res) {
            //   console.log(req.body);
              var {id, name,category, price, image} = req.body;
              id = id.trim();
              price = price.trim();
              image = image.trim();
              name = name.trim();
              category = category.trim();
              if(id === ''){
                  req.flash('Id is requied');
                  return res.redirect('/admin/manage-items');
              }
              
              const items = await Menu.find({ _id : id});
              const item = items[0];
              if( name === ''){                  
                  name = item.name;
              }
              if( category === ''){                  
                category = item.category;
              }
              if(price === ''){                
                  price = item.price;
              }

              if(image === ''){               
                  image = item.image;
              }

              const updateDoc = {
                $set :{
                    name : name,
                    category: category,
                    price : price,
                    image : image
                }
              };
             
            Menu.updateMany( {_id : req.body.id}, updateDoc , (err, result) => {
                if(err){
                    console.log(err);
                }
                console.log(result);
                return res.redirect('/admin/manage-items');
            })

          },
          deleteItem (req, res) {
             var {id} = req.body;
             id = id.trim();
             Menu.deleteOne({_id : id}, (err, result) => {
                if(err){
                    console.log(err);
                }
                console.log(result);
                return res.redirect('/admin/manage-items');
             })
          },
          manageOrder(req, res) { 
              
            Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).populate('customerId', '-password').exec((err, orders) => {
                // return res.json(orders)
               console.log(req.xhr);
                if(req.xhr) {
                    return res.json(orders);
                } else {   
                    console.log(err);                 
                    return res.render('admin/manageOrders')
                }
            });          
          }
      }
}

module.exports = adminController;