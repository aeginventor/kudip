package com.kudip.ingredient;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class IngredientService {

    private final IngredientRepository ingredientRepository;

    @Transactional
    public Ingredient findOrCreate(String name) {
        return ingredientRepository.findByName(name)
                .orElseGet(() -> ingredientRepository.save(
                        Ingredient.builder().name(name).build()
                ));
    }
}
