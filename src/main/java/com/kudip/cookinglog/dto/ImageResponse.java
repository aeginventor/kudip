package com.kudip.cookinglog.dto;

import com.kudip.cookinglog.CookingLogImage;
import lombok.Getter;

@Getter
public class ImageResponse {

    private final Long id;
    private final String imageUrl;

    private ImageResponse(Long id, String imageUrl) {
        this.id = id;
        this.imageUrl = imageUrl;
    }

    public static ImageResponse from(CookingLogImage image) {
        return new ImageResponse(image.getId(), image.getImageUrl());
    }
}
