import { Component, OnInit,Input } from '@angular/core';
import { baseUrl } from "../configuration";
import { RestapiService } from '../restapi.service';
import { ConvertDishes, Dishes } from '../model/Dishes';
import { ConvertMeals, Meals} from "../model/Meals";
import { ConvertCuisines, Cuisines } from "../model/Cuisines";
import { ConvertUser, User } from "../model/User";
import { ConvertRecipes, Recipes } from "../model/Recipes";
import { ConvertLabels, Labels } from "../model/Labels";
import { ConvertIngredients, Ingredients } from "../model/Ingredients";
import { ThemePalette } from "@angular/material/core";
import {forkJoin,Observable} from "rxjs";
import {PageEvent} from '@angular/material/paginator';
import {FormControl} from "@angular/forms";
import {map, startWith} from 'rxjs/operators';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    lowValue: number = 0;
    highValue: number = 10;
    labelsList : Labels;
    dishesList : Dishes;
    mealsList : Meals;
    cuisinesList : Cuisines;
    userdata : User;
    visibleRecipes : Recipes;
    ingredientsList: Ingredients;
    filteredOptions: Observable<Ingredients["data"]>
    myControl = new FormControl();
    visibleIng: Ingredients;
    selectedLabel = null;

    selectedMeal = null;
    selectedDish = null;
    selectedCuisine = null;
    searchBoxInput = null;
    includeIng = null;
    excludeIng = null;
    background: ThemePalette = undefined;
    loading: boolean= true;

    constructor(private service: RestapiService) {}

    public getPaginatorData(event: PageEvent): PageEvent {
        this.lowValue = event.pageIndex * event.pageSize;
        this.highValue = this.lowValue + event.pageSize;
        return event;
    }

    ngOnInit() {
        this.loading = true;
        forkJoin( this.service.getUserdata(), this.service.getDishes(),this.service.getMeals(), this.service.getLabels(),
            this.service.getIngredients(),  this.service.getCuisines(), this.service.getFirstTenIng(),
            this.service.getFirstHundredRecipes()).subscribe(([userdata,dishesList,mealsList,labelsList,
            ingredientsList,cuisinesList,visibleIng,visibleRecipes]) => {
            this.userdata = ConvertUser.toUser(userdata.toString());
            this.dishesList = ConvertDishes.toDishes(dishesList.toString());
            this.mealsList = ConvertMeals.toMeals(mealsList.toString());
            this.labelsList = ConvertLabels.toLabels(labelsList.toString());
            this.ingredientsList = ConvertIngredients.toIngredients(ingredientsList.toString());
            this.visibleIng = ConvertIngredients.toIngredients(visibleIng.toString());
            this.cuisinesList = ConvertCuisines.toCuisines(cuisinesList.toString());
            this.visibleRecipes = ConvertRecipes.toRecipes(visibleRecipes.toString());
            this.loading = false;
            this.filteredOptions = this.myControl.valueChanges.pipe(
                startWith(''),
                map(value => (typeof value === 'string' ? value : value.name)),
                map(name => (name ? this._filter(name) : this.ingredientsList["data"].slice())),
            );

        })
        // this.service.getUserdata().subscribe( data => {
        //     this.userdata = ConvertUser.toUser(data.toString());
        // });
        //
        // this.service.getDishes().subscribe(data => {
        //     this.dishesList = ConvertDishes.toDishes(data.toString());
        // });
        //
        // this.service.getMeals().subscribe( data => {
        //     this.mealsList = ConvertMeals.toMeals(data.toString());
        //
        // });
        //
        // this.service.getLabels().subscribe(  data => {
        //     this.labelsList = ConvertLabels.toLabels(data.toString());
        // });
        // this.service.getIngredients().subscribe(data => {
        //     this.ingredientsList = ConvertIngredients.toIngredients(data.toString());
        // });
        // this.service.getFirstTenIng().subscribe( data => {
        //     this.visibleIng = ConvertIngredients.toIngredients(data.toString());
        // });
        //
        // this.service.getCuisines().subscribe( data => {
        //     this.cuisinesList = ConvertCuisines.toCuisines(data.toString());
        // });
        //
        // this.service.getFirstHundredRecipes().subscribe( data => {
        //     this.visibleRecipes = ConvertRecipes.toRecipes(data.toString());
        //     this.loading = false;
        // });
    }
    displayFn(ingredient : Ingredients["data"]): string {
        return ingredient && ingredient["attributes"].name ? ingredient["attributes"].name : '';
    }

    private _filter(name: string): Ingredients["data"] {
        const filterValue = name.toLowerCase();

        return this.ingredientsList["data"].filter(option => option.attributes.name.toLowerCase().includes(filterValue));
    }

    selectIncludeIng(e) {
        this.includeIng = e.value;
    }

    selectExcludeIng(e) {
        this.excludeIng = e.value;
    }

    selectChangeHandlerSearchBox(e){
        this.searchBoxInput = e.target.value;
    }

    selectChangeHandlerMeal(e) {
        this.selectedMeal = e.value;
    }

    selectChangeHandlerDish(e){
        this.selectedDish = e.value;
    }

    selectChangeHandlerCuisine(e){
        this.selectedCuisine = e.value;
    }

    selectChangeHandlerLabel(e){
        this.selectedLabel = e.value;
    }

    // requestSign(any: any, base: string, counter: number) {
    //     if (any != null && any != 'default' &&  any != '') {
    //         if (counter > 0) {
    //             counter++;
    //             return '&'
    //         }
    //         else {
    //             counter++;
    //             return '?'
    //         }
    //     }
    //     else return null;
    // }

    selectClickHandlerRecipe() {
        let base = baseUrl + '/api/recipe';
        let counter = 0;
        // if (this.requestSign(this.selectedMeal,base,counter)!=null) {
        //     base = base + this.requestSign(this.selectedMeal,base,counter) + 'filter[meal.id]=' + this.selectedMeal;
        // }
        //
        if(this.selectedMeal != null && this.selectedMeal != 'default') {
            base = base + '?filter[meal.id]=' + this.selectedMeal;
            counter++;
        }
        // if (this.requestSign(this.selectedDish,base,counter)!=null) {
        //     base = base + this.requestSign(this.selectedDish,base,counter) + 'filter[dish.id]=' + this.selectedDish;
        // }
        if(this.selectedDish != null && this.selectedDish != 'default') {
            if(counter > 0) {
                base = base + '&filter[dish.id]=' + this.selectedDish;
            } else {
                base = base + '?filter[dish.id]=' + this.selectedDish;
                counter++;
            }
        }
        // if (this.requestSign(this.selectedCuisine,base,counter)!=null) {
        //     base = base + this.requestSign(this.selectedCuisine,base,counter) + 'filter[cuisine.id]=' + this.selectedCuisine;
        // }
        if(this.selectedCuisine != null && this.selectedCuisine != 'default') {
            if(counter > 0) {
                base = base + '&filter[cuisine.id]=' + this.selectedCuisine;
            } else {
                base = base + '?filter[cuisine.id]=' + this.selectedCuisine;
                counter++;
            }
        }
        // if (this.requestSign(this.includeIng,base,counter)!=null) {
        //     base = base + this.requestSign(this.includeIng,base,counter) + 'filter[ingredientsSet.ingredient.id]=' + this.includeIng;
        // }
        if(this.includeIng != null && this.includeIng != 'default') {
            if(counter > 0) {
                base = base + '&filter[ingredientsSet.ingredient.id]=' + this.includeIng;
            } else {
                base = base + '?filter[ingredientsSet.ingredient.id]=' + this.includeIng;
                counter++;
            }
        }
        // if (this.requestSign(this.excludeIng,base,counter)!=null) {
        //     base = base + this.requestSign(this.excludeIng,base,counter) + 'filter[ingredientsSet.ingredient.id][NEQ]=' + this.excludeIng;
        // }
        if(this.excludeIng != null && this.excludeIng != 'default') {
            if (counter > 0) {
                base = base + '&filter[ingredientsSet.ingredient.id][NEQ]=' + this.excludeIng;
            } else {
                base = base + '?filter[ingredientsSet.ingredient.id][NEQ]=' + this.excludeIng;
                counter++;
            }
        }
        // if (this.requestSign(this.selectedLabel,base,counter)!=null)  {
        //     base = base + this.requestSign(this.selectedLabel,base,counter) + 'filter[labelsSet.id]=' + this.selectedLabel;
        // }
        if(this.selectedLabel != null && this.selectedLabel != 'default') {
            if (counter > 0) {
                base = base + '&filter[labelsSet.id]=' + this.selectedLabel;
            } else {
                base = base + '?filter[labelsSet.id]=' + this.selectedLabel;
                counter++;
            }
        }
        // if (this.requestSign(this.searchBoxInput,base,counter)!=null) {
        //     base = base + this.requestSign(this.searchBoxInput,base,counter) + 'filter={%20%22LIKE%22%3A{%22name%22%3A%22%25' + this.searchBoxInput + '%25%22}}';
        // }
        if (this.searchBoxInput != null && this.searchBoxInput != 'default' && this.searchBoxInput != '') {
            if (counter >0) {
                base = base + '&filter={%20%22LIKE%22%3A{%22name%22%3A%22%25' + this.searchBoxInput + '%25%22}}';
            } else {
                base = base + '?filter={%20%22LIKE%22%3A{%22name%22%3A%22%25' + this.searchBoxInput + '%25%22}}';
                counter++;
            }
        }

        console.log(base);

            this.service.getFilteredRecipes(base).subscribe( data => {
            this.visibleRecipes = ConvertRecipes.toRecipes(data.toString());
        });
    }
}