package com.goodmeal.repositoriesImplementations;

import com.goodmeal.entities.Ingredient;
import com.goodmeal.repositories.IRepository;
import io.crnk.core.queryspec.QuerySpec;
import io.crnk.core.resource.annotations.JsonApiResource;
import io.crnk.core.resource.list.ResourceList;
import io.crnk.data.jpa.JpaEntityRepositoryBase;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@JsonApiResource(type = "ingredient")
@Component
public class IngredientsRepositoryImplementation extends IRepository<Ingredient,Long> {

    public IngredientsRepositoryImplementation() {
        super(Ingredient.class);
    }
}
