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
import org.springframework.util.StringUtils;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.net.MalformedURLException;
import java.net.URL;
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
                            // ========== 关键修复：从WebSocket握手头提取domain ==========
                            String domain = "localhost";
                            // 1. 获取WebSocket握手时的HTTP头（Origin/Referer保存在这里）
                            StompHeaderAccessor handshakeAccessor = (StompHeaderAccessor)accessor.getHeader("stomp.originator");
                            if (handshakeAccessor != null) {
                                // 2. 优先从Origin头获取（跨域WebSocket连接必带）
                                String origin = handshakeAccessor.getFirstNativeHeader("Origin");
                                if (StringUtils.hasText(origin)) {
                                    try {
                                        domain = new URL(origin).getHost(); // 提取域名（如localhost、xxx.com）
                                    } catch (MalformedURLException e) {
                                        log.error("解析Origin域名失败: {}", origin, e);
                                    }
                                }
                                // 3. 其次从Referer头获取（非跨域连接）
                                if (!StringUtils.hasText(domain)) {
                                    String referer = handshakeAccessor.getFirstNativeHeader("Referer");
                                    if (StringUtils.hasText(referer)) {
                                        try {
                                            domain = new URL(referer).getHost();
                                        } catch (MalformedURLException e) {
                                            log.error("解析Referer域名失败: {}", referer, e);
                                        }
                                    }
                                }
                            }

                            // 4. SSO关键：统一domain（避免127.0.0.1和localhost混用）
                            if ("127.0.0.1".equals(domain)) {
                                domain = "localhost";
                            }

                            log.info("WebSocket连接提取的domain: {}", domain);
                            if (!StringUtils.hasText(domain)) {
                                log.error("WebSocket连接未获取到有效domain，拒绝CONNECT");
                                throw new RuntimeException("WebSocket连接域名缺失，token校验失败");
                            }

                            // 5. 调用jwtUtil校验token（传递提取的domain）
                            String id = jwtUtil.getSubjectFromAccessTokenHeader(token, domain);
                            log.info("WebSocket token校验成功，用户id: {}", id);

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
                            throw new RuntimeException("401" + e.getMessage());
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