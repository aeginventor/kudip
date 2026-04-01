package com.kudip.cookinglog;

import com.kudip.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cooking_log_images")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CookingLogImage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooking_log_id", nullable = false)
    private CookingLog cookingLog;

    @Column(nullable = false)
    private String imageUrl;

    @Builder
    public CookingLogImage(CookingLog cookingLog, String imageUrl) {
        this.cookingLog = cookingLog;
        this.imageUrl = imageUrl;
    }
}
