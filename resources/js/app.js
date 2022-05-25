import axios from 'axios'
  
const addToCart = document.querySelectorAll('.add-to-cart');
const cartDeleteBtn = document.querySelectorAll('.delete-btn')

//Making axios post request for updating the cart
const updateCart = (item) =>{
      axios.post('/update-cart', item)
      .then(() => {        
        alert('Item has been added to the cart');
        
      })
      .catch((err) => {
          console.log(err);
          alert('Something went wrong');
      })
} 

// Making axios call for deleting cart item

const deleteCartItem = (item) => {
    axios.post('/delete-cart-item', item)
    .then((res) =>{
        alert('Your item deleted from the cart section');
        document.location.reload();
        // return res.redirect('/');
    }).catch((err) => {
        console.log(err);
        alert('something went wrong');
    })
}
 
// Adding to the Cart
addToCart.forEach((btn) => {
    btn.addEventListener('click', () =>{
        let item = JSON.parse(btn.dataset.item);   
        console.log(btn.dataset);      
        updateCart(item);
    })
});

// Delete the cart item
cartDeleteBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        let item = JSON.parse(btn.dataset.item);
        // console.log(btn.dataset.item_id);
        deleteCartItem(item);
    })
})


