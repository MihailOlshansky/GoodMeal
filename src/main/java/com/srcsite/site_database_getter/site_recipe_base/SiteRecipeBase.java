package com.srcsite.site_database_getter.site_recipe_base;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SiteRecipeBase {
    @JsonProperty("hits")
    private List<Hit> hits;

    public List<SiteRecipe> getResipes() {
        return hits.stream().map(Hit::getRecipe).collect(Collectors.toList());
    }
}

@Getter
class Hit {
    @JsonProperty("recipe")
    private SiteRecipe recipe;
}