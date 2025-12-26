package com.htech.resumemaker.controller;


import com.htech.resumemaker.dto.RazorPayOrderDto;
import com.htech.resumemaker.dto.ResumeOrderResponse;
import com.htech.resumemaker.services.OrderService;
import com.htech.resumemaker.services.RazorPayService;
import com.razorpay.Order;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final RazorPayService razorPayService;
//    private final ResumeOrderResponse resumeOrderResponse;
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestParam String planId, Authentication auth) throws RazorpayException {
        Map<String, Object> responseMap = new HashMap<>();
        ResumeOrderResponse response = null;

        if (auth.getName().isEmpty() || auth.getName() == null) {
            response = ResumeOrderResponse.builder()
                    .statusCode(HttpStatus.FORBIDDEN)
                    .success(false)

                    .data("Unauthorized access: User not authenticated.")
                    .build();
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        try {
            Order order = orderService.createOrder(planId, auth.getName());

            RazorPayOrderDto responseDTO = convertToDTO(order);

            response = ResumeOrderResponse.builder()
                    .statusCode(HttpStatus.CREATED)
                    .data(responseDTO)
                    .success(true)
                    .build();
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            response = ResumeOrderResponse.builder()
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .data("Error creating order: " + e.getMessage())
                    .success(false)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    private RazorPayOrderDto convertToDTO(Order order) {

        RazorPayOrderDto dto=   RazorPayOrderDto.builder()
                .id(order.get("id"))
                .entity(order.get("entity"))
                .amount(order.get("amount"))
                .currency(order.get("currency"))
                .receipt(order.get("receipt"))
                .status(order.get("status"))
                .created_at(order.get("created_at"))
                .build();
        return dto;
    }
    @PostMapping("/verify")// why  you need to verify order
    // because razorpay order is created on client side, and you need to verify it on server side
    // to make sure that the order is created by your server and not by someone else
    // and also to make sure that the payment is successful

    public ResponseEntity<?> verifyOrder(@RequestBody Map<String, Object> request) throws RazorpayException {
        try {
            String razorpayOrderId=request.get("razorpay_order_id").toString();
            Map<String,Object> returnValue =razorPayService.verifyPayment(razorpayOrderId);

            return  ResponseEntity.ok(returnValue);
        }catch (RazorpayException e) {
            e.printStackTrace();
            Map<String,Object> errorResponse = new HashMap<>();
            errorResponse.put("message","Error while verifying payment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
