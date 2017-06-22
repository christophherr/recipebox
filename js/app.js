// localStorage persistence
var STORAGE_KEY = 'recipebox-vuejs';
var recipeStorage = {
    fetch: function() {
        var recipes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        recipes.forEach(function(recipe, index) {
            recipe.id = index;
        });
        recipeStorage.uid = recipes.length;
        return recipes;
    },
    save: function(recipes) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    }
};

Vue.component('single-recipe', {
    template: '#single-recipe',
    props: ['recipe'],
    methods: {
        toggleRecipe() {
            this.isVisible = !this.isVisible;
        },
        removeRecipe(recipe) {
            app.recipes.splice(recipe, 1);
        }
    },
    computed: {
        editButtonText() {
            return this.edit ? 'Edit' : 'Done Editing';
        }
    },
    data() {
        return {
            isVisible: false,
            edit: true
        };
    }
});

var app = new Vue({
    el: '#app',
    data: {
        recipes: recipeStorage.fetch(),
        newRecipe: [],
        editedRecipe: null,
        isAddRecipe: false,
        beforeEditCache: []
    },
    watch: {
        recipes: {
            handler: function(recipes) {
                recipeStorage.save(recipes);
            },
            deep: true
        }
    },
    methods: {
        toggleAddRecipe() {
            this.isAddRecipe = !this.isAddRecipe;
        },
        addRecipe() {
            var titleValue = this.newRecipe.name && this.newRecipe.name.trim();
            var ingredientsValue =
                this.newRecipe.ingredients && this.newRecipe.ingredients.trim();
            if (!titleValue || !ingredientsValue) {
                return;
            }
            this.recipes.push({
                id: recipeStorage.uid++,
                name: titleValue,
                details: ingredientsValue
            });
            this.newRecipe = [];
            this.isAddRecipe = false;
            console.log(localStorage);
        },
        editRecipe(recipe) {
            console.log(recipe);
            this.beforeEditCache.name = recipe.name;
            this.beforeEditCache.details = recipe.details;
            this.editedRecipe = recipe;
            console.log(this.beforeEditCache);
            this.edit = true;
        },

        cancelAddingNewRecipe(newRecipe) {
            this.editedRecipe = null;
            newRecipe.name = this.beforeEditCache.name;
            newRecipe.details = this.beforeEditCache.details;
            this.isAddRecipe = false;
        }
    }
});

// mount
app.$mount('.recipeapp');
