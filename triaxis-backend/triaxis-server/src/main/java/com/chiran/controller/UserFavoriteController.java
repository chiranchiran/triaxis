package com.chiran.controller;

import com.chiran.dto.AddFavoriteDTO;
import com.chiran.dto.CreateFolderDTO;
import com.chiran.result.Result;
import com.chiran.service.UserFavoriteService;
import com.chiran.vo.UserFavoriteFolderVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/favorites")
@RequiredArgsConstructor
public class UserFavoriteController {

    private final UserFavoriteService userFavoriteService;

    /**
     * 获取用户收藏夹列表
     */
    @GetMapping("/folders")
    public Result<List<UserFavoriteFolderVO>> getFavoriteFolders(Integer id) {
        List<UserFavoriteFolderVO> folders = userFavoriteService.getUserFolders(id);
        return Result.success(folders);
    }

    /**
     * 创建收藏夹
     */
    @PostMapping("/folders")
    public Result<Boolean> createFolder(@RequestBody CreateFolderDTO dto) {
        Boolean success = userFavoriteService.createFolder(dto.getId(), dto);
        return Result.success(success);
    }

    /**
     * 收藏资源/课程
     */
    @PostMapping("/items")
    public Result<Boolean> addFavorite(@RequestBody AddFavoriteDTO dto) {
        Boolean success = userFavoriteService.addFavoriteItem(dto.getId(), dto);
        return Result.success(success);
    }

    /**
     * 取消收藏
     */
    @DeleteMapping("/items")
    public Result<Boolean> removeFavorite(@RequestParam Integer id,
                                          @RequestParam Integer itemType,
                                          @RequestParam Integer itemId) {
        Boolean success = userFavoriteService.removeFavoriteItem(id, itemType, itemId);
        return Result.success(success);
    }
}
