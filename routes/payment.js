const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");


const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET
})

router.post("/payment", async(req, res) => {
    try{
      const instance = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET
      });
      
      let amount = req.body.amount;       
      const options = {
        amount:  amount*100,
        currency: "INR",
        receipt: crypto.randomBytes(10).toString("hex")
      }

      await razorpay.orders.create(options, (err, order) => {
        return res.json(order);
      })      
      
    }catch(err){
        console.log(err);
        res.status(500).json({ message : "Internal Server Error!"})
    }
});

router.post("/verify", async (req, res) => {
    try{
       const { 
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
       } = req.body;

       const sign = razorpay_order_id + "|" + razorpay_payment_id;
       const expectedSign = crypto.createHmac("sha256", process.env.KEY_SECRET).update(sign.toString()).digest("hex");
       
       if(razorpay_signature === expectedSign){
        return res.status(200).json({ message: "Payment verified success"});
       }else{
        return res.status(400).json({ message: "Invalid signature sent!"});
       }
    }catch (error){
       console.log(error);
       res.status(500).json({message: "Internal Server Error!"});
    }
});

router.get("/getAmount", (req, res) => {   
  return res.json({amount : req.session.cart.totalPrice});
})

module.exports = router;
