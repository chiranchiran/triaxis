package com.chiran.config;

import com.chiran.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.security.Principal;

@Slf4j
@Configuration
@EnableWebSocketMessageBroker
@EnableScheduling
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor == null) {
                    return message;
                }

                // 在CONNECT时验证token并设置Principal
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String token = accessor.getFirstNativeHeader("Authorization");
                    log.info("收到CONNECT请求，Authorization头: {}", token);

                    if (token != null && token.startsWith("Bearer ")) {
                        try {
                            String id = jwtUtil.getSubjectFromAccessTokenHeader(token);
                            log.info("成功解析用户ID: {}", id);

                            // 创建Principal并设置到accessor中
                            Principal principal = new Principal() {
                                @Override
                                public String getName() {
                                    return id;
                                }

                                @Override
                                public String toString() {
                                    return "UserPrincipal{id='" + id + "'}";
                                }
                            };

                            // 关键：设置用户Principal
                            accessor.setUser(principal);
                            log.info("Principal设置成功: {}", accessor.getUser());

                        } catch (Exception e) {
                            log.error("Token验证失败: {}", e.getMessage());
                            throw new RuntimeException("Invalid token: " + e.getMessage());
                        }
                    } else {
                        log.warn("未找到有效的Authorization头");
                    }
                }

                // 对于所有消息，记录Principal信息用于调试
                if (accessor.getUser() != null) {
                    log.debug("消息命令: {}, Principal: {}", accessor.getCommand(), accessor.getUser().getName());
                } else {
                    log.debug("消息命令: {}, Principal: null", accessor.getCommand());
                }

                return message;
            }
        });
    }
}