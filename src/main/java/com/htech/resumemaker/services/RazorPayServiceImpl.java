package com.htech.resumemaker.services;


import com.htech.resumemaker.Repository.OrderRepository;
import com.htech.resumemaker.dto.UserDTO;
import com.htech.resumemaker.model.OrderEntity;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RazorPayServiceImpl implements RazorPayService {

    private final OrderRepository orderRepository;
    private final UserService userService;
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;
    @Override
    public Order createOrder(Double amount, String currency) throws RazorpayException {
        ///  ism humne RazorpayClient ka object banaya hai
        /// aur usme humne key id aur secret pass kiya hai
        /// aur uske baad json ka  order object create kiya hai
        /// aur usme humne amount, currency, receipt aur payment_capture pass kiya hai
        /// amount ko 100 se multiply kiya hai kyuki razorpay me amount paise me hota hai
        /// aur currency ko INR set kiya hai
        /// receipt ko unique id set kiya hai
        /// aur payment_capture ko 1 set kiya hai kyuki hum auto capture payment karna chahte hain
        // auto capture payment ka matlab hai ki jab user payment karega to uska payment automatically capture ho jayega
        // then
        try {
            RazorpayClient razorpayClient= new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount",amount * 100);
            // multiply by 100 to convert to paise
            // Razorpay works with the smallest currency unit, so for INR, amounts are in paise.
            // For example, to charge ₹500.00, you need to specify 50000 paise.
            // This is why we multiply the amount in rupees by 100.
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", "order_rcptid"+ System.currentTimeMillis()); // Unique receipt ID
            orderRequest.put("payment_capture", 1); // Auto capture payment || 0 for manual capture
            return razorpayClient.orders.create(orderRequest);
        } catch (RazorpayException e) {
            System.out.println("Error while creating Razorpay order: " + e.getMessage());
            e.printStackTrace();
            throw new RazorpayException("RazorPay Error"+e.getMessage());

        }
    }

    @Override
    public Map<String, Object> verifyPayment(String razorpayOrderId) throws RazorpayException {
        Map<String,Object> returnValue = new HashMap<>();
        try {
            RazorpayClient razorpayClient =new RazorpayClient(razorpayKeyId,razorpayKeySecret);
            // now razorpay client have all the details to connect to razorpay
            Order order_info= razorpayClient.orders.fetch(razorpayOrderId);
            // it must show the order details like in this format
            // {razorpayorderid=order_9A33XWu170gUtm, entity=order, amount=50000, amount_paid=50000, amount_due=0,
            // currency=INR, receipt=order_rcptid_11, status=paid, attempts=0,
            // created_at=1396989820}
            if (order_info.get("status").toString().equalsIgnoreCase("paid")) {
                OrderEntity existingOrder = orderRepository.findByOrderId(razorpayOrderId).orElseThrow(()->
                        new RuntimeException("Order not found"+ razorpayOrderId));
                if (existingOrder.getPayment()) { // if payment is already done
                    returnValue.put("message", "Payment failed for this order.");
                    returnValue.put("status", false);
                    return returnValue;
                }
                UserDTO userDto = userService.getUserByClerkId(existingOrder.getClerkId());
                userDto.setCredits(userDto.getCredits() + existingOrder.getCredits()); // add credits to user
                userService.saveUser(userDto);
                existingOrder.setPayment(false); // why false?
                // because payment is done, so we set it to false to indicate that payment is completed
                // if we set it to true, it will indicate that payment is pending
                orderRepository.save(existingOrder);
                returnValue.put("success", true);
                returnValue.put("message", "Credits added successfully.");
            }
        }catch(RazorpayException e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Error while verifying payment: " + e.getMessage());
        }
        return returnValue;

    }
}
