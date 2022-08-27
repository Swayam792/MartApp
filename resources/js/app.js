import axios from 'axios'; 
import moment from 'moment';
import Noty from 'noty';
import '../../node_modules/noty/src/noty.scss';
import '../../node_modules/noty/src/themes/mint.scss';
// import Razorpay from "razorpay"
 
const addToCart = document.querySelectorAll('.add-to-cart');
const cartDeleteBtn = document.querySelectorAll('.delete-btn');
const deleteItemSwitcher = document.querySelector('#post-delete-btn');
const postItemSwitcher = document.querySelector('#post-btn');
const updateItemSwitcher = document.querySelector('#post-update-btn');
const postItemForm = document.querySelector('#post-product');
const deleteItemForm = document.querySelector('#delete-post');
const updateItemForm = document.querySelector('#update-post');
const cancelOrderBtn = document.querySelector('#cancel-order');
const paymentBtn = document.querySelector('#payment-btn');

// Logic for responsive navbar   
let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');      
}

window.onscroll = () =>{      
    navbar.classList.remove('active');
} 
 
//Making axios post request for updating the cart
const updateCart = (item) => {
    axios.post('/update-cart', item)
        .then(() => {                       
            new Noty({
                type: 'success',
                timeout: 500,
                text: 'Item added to cart',
                progressBar: false,
            }).show();            
        })
        .catch((err) => {
            console.log(err);
            new Noty({
                type: 'error',
                timeout: 500,
                text: 'Something Went Wrong',
                progressBar: false,
            }).show();             
        })
}

// Making axios call for deleting cart item

const deleteCartItem = (item) => {
    axios.post('/delete-cart-item', item)
        .then((res) => {
            new Noty({
                type: 'success',
                timeout: 500,
                text: 'Your item has been deleted from the cart section',
                progressBar: false,
            }).show();
            
            document.location.reload();
             
        }).catch((err) => {
            console.log(err);
            new Noty({
                type: 'error',
                timeout: 500,
                text: 'Something Went Wrong',
                progressBar: false,
            }).show();      
        })
}

// Adding to the Cart
addToCart.forEach((btn) => {
    btn.addEventListener('click', () => {
        let item = JSON.parse(btn.dataset.item);         
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
});

//admin


//  Change order Status
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);

// Socket
const socket = io();



function initAdmin(socket) {
    const orderTableBody = document.querySelector('#orderTableBody');
    const adminTable = document.querySelector('.admin-table');
    let orders = []
    let markup

    axios.get('/admin/manage-orders', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        orders = res.data
        if(orders.length){
            markup = generateMarkup(orders)
            orderTableBody.innerHTML = markup
        }else{            
            adminTable.style.display = 'none';
        }
    }).catch(err => {
        console.log(err)
    })

    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                <p>${ menuItem.item.name } - ${ menuItem.qty } pcs </p>
            `
        }).join('')
      }

    function generateMarkup(orders) {
        return orders.map(order => {
            return `
                <tr>
                <td style="padding: 20px; color: orange; text-align: center;">
                    <p>${ order._id }</p>
                    <div>${ renderItems(order.items.items) }</div>
                </td>
                <td style="text-align: center ; padding: 10px;" >${ order.customerId.username }</td>
                <td  style="text-align: center; padding: 10px;">${ order.address }</td>
                <td style="text-align: center; padding: 10px;">
                    <div style="display: inline-block; postion: relative; width: 16rem">
                        <form action="/admin/order-status" method="POST">
                            <input type="hidden" name="orderId" value="${ order._id }">
                            <select name="status" onchange="this.form.submit()"
                               style=" width: 100%; padding: 8px; border-radius: 7px; ">
                                <option value="Order Picked"
                                    ${ order.status === 'Order Picked' ? 'selected' : '' }>
                                    Picked</option>
                                <option value="Order Packed" ${ order.status === 'Order Packed' ? 'selected' : '' }>
                                    Packed</option>
                                
                                <option value="Order Shipped" ${ order.status === 'Order Shipped' ? 'selected' : '' }>
                                    Shipped
                                </option>
                                <option value="Order Delivered" ${ order.status === 'Order Delivered' ? 'selected' : '' }>
                                    Delivered
                                </option>
                            </select>
                        </form>
                        
                    </div>
                </td>
                <td style="text-align: center; padding: 10px;">
                    ${ moment(order.createdAt).format('hh:mm A') }
                </td>               
            </tr>
        `
        }).join('')
    }
    
    socket.on('orderChanged', (action ,order) => {   
         
        if(action === 'add'){
            orders.unshift(order)   
            new Noty({
                type: 'success',
                timeout: 2000,
                text: 'New Order Recieved',
                progressBar: false,
            }).show();      
        }else{
            orders.shift(order)   
            new Noty({
                type: 'success',
                timeout: 2000,
                text: `User Delete order ${order._id}`,
                progressBar: false,
            }).show();  
        }        
        orderTableBody.innerHTML = ''
        orderTableBody.innerHTML = generateMarkup(orders)
    });        

   
}
 
// Switch On the delete item form
 
deleteItemSwitcher?.addEventListener('click', () => {
    postItemForm.classList.add('hidden');
    deleteItemForm.classList.remove('hidden')
    updateItemForm.classList.add('hidden');
});

postItemSwitcher?.addEventListener('click', () => {
    postItemForm.classList.remove('hidden');
    deleteItemForm.classList.add('hidden')
    updateItemForm.classList.add('hidden');
});

updateItemSwitcher?.addEventListener('click', () => {
    postItemForm.classList.add('hidden');
    deleteItemForm.classList.add('hidden')
    updateItemForm.classList.remove('hidden');
});

// Update 
const order_status_client = document.querySelector('#order-status-client'); 
let time = document.querySelector('#time')

const updateStatus = (order) =>{
      order_status_client.innerHTML = order.status;
       
      time.innerText = moment(order.updatedAt);      
}
 
if(order){
    socket.emit('join', `order_${order._id}`);
}

let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')) {
   initAdmin(socket)
   socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated' ,(data) =>{
    const UpdatedOrder = {...order};
    UpdatedOrder.updatedAt = moment().format();
    UpdatedOrder.status = data.status;
    updateStatus(UpdatedOrder);
});
 
// Cancel Order btn
const cancelOrder = (order) =>{
    axios.post(`/track-order/cancel-order`,order)
    .then((result) => {
        new Noty({
            type: 'success',
            timeout: 500,
            text: 'Order Deleted Successfully. Go Back !',
            progressBar: false,
        }).show();              
        document.location.reload();
    }).catch((err) => {
        console.log(err);    
        new Noty({
            type: 'error',
            timeout: 500,
            text: 'Something went wrong',
            progressBar: false,
        }).show();        
    })
}

cancelOrderBtn?.addEventListener('click', () =>{    
   const order = JSON.parse(cancelOrderBtn.dataset.order);     
   cancelOrder(order);    
}); 

//payment integration
paymentBtn?.addEventListener('click', async (e) => {
    let info = (await axios.get("/getAmount"));
    let amount = info.data.amount;  
    
    amount = JSON.parse(amount);
    
    axios.post("/payment", {amount: amount}).then((res) => {        
        var options = {
            key: process.env.KEY_ID,          
            name: "Swayam Prakash Barik",             
            description: "Test Transaction",          
            order_id: res.data.id, 
            callback_url: "/verify",           
            "theme": {
                "color": "#3399cc"
            }
        }

        var rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();
        // console.log(res);
    });
})  

 
 