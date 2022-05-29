import axios from 'axios';
// import { initAdmin } from './admin';
import moment from 'moment';

const addToCart = document.querySelectorAll('.add-to-cart');
const cartDeleteBtn = document.querySelectorAll('.delete-btn');
const deleteItemSwitcher = document.querySelector('#post-delete-btn');
const postItemSwitcher = document.querySelector('#post-btn');
const updateItemSwitcher = document.querySelector('#post-update-btn');
const postItemForm = document.querySelector('#post-product');
const deleteItemForm = document.querySelector('#delete-post');
const updateItemForm = document.querySelector('#update-post');

initAdmin();
 
//Making axios post request for updating the cart
const updateCart = (item) => {
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
        .then((res) => {
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
    btn.addEventListener('click', () => {
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
});

//admin


function initAdmin() {
    const orderTableBody = document.querySelector('#orderTableBody')
    let orders = []
    let markup

    axios.get('/admin/manage-orders', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        orders = res.data
        console.log(orders);
        markup = generateMarkup(orders)
        orderTableBody.innerHTML = markup
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
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${ order._id }">
                            <select name="status" onchange="this.form.submit()"
                               style=" width: 100%; padding: 8px; border-radius: 7px; ">
                                <option value="Order Picked"
                                    ${ order.status === 'Order Picked' ? 'selected' : '' }>
                                    PIcked</option>
                                <option value="Order Packed" ${ order.status === 'Order Packed' ? 'selected' : '' }>
                                    Packed</option>
                                
                                <option value="Order Shipped" ${ order.status === 'delivered' ? 'selected' : '' }>
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
   
}
 
// Switch On the delete item form
deleteItemSwitcher.addEventListener('click', () => {
    postItemForm.classList.add('hidden');
    deleteItemForm.classList.remove('hidden')
    updateItemForm.classList.add('hidden');
});

postItemSwitcher.addEventListener('click', () => {
    postItemForm.classList.remove('hidden');
    deleteItemForm.classList.add('hidden')
    updateItemForm.classList.add('hidden');
});

updateItemSwitcher.addEventListener('click', () => {
    postItemForm.classList.add('hidden');
    deleteItemForm.classList.add('hidden')
    updateItemForm.classList.remove('hidden');
});

// admin part

 


