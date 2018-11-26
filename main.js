
Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>

      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>

      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>Would you recommend this product?</p>
      <label>
        Yes
        <input type="radio" value="Yes" v-model="recommend"/>
      </label>
      <label>
        No
        <input type="radio" value="No" v-model="recommend"/>
      </label>

      <p>
        <input type="submit" value="Submit">
      </p>

    </form>
  `,
  data() {
    return {
      errors: [],
      name: null,
      rating: null,
      recommend: null,
      review: null,
    };
  },
  methods: {
    onSubmit() {
      if(this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        };
        this.$emit('review-submitted', productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        if(!this.name) this.errors.push("Name required.");
        if(!this.review) this.errors.push("Review required.");
        if(!this.rating) this.errors.push("Rating required.");
        if(!this.recommend) this.errors.push("Recommendation required.");
      }
    }
  }
});

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `,
});

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
      <div class="product">
        <div class="product-image">
          <img v-bind:src="image"/> <!-- <img v-bind:src="image2"/> -->
        </div>
        <div class="product-info">
          <h1>{{title}} <span v-show="onSale"> - On Sale!</span></h1>
          <!-- testing v-html directive -->
          <p> <span style="font-style=italic; font-size:0.5em;">Using mustaches:</span> {{ description }} </p>
          <p> <span style="font-style=italic; font-size:0.5em;">Using v-html directive:</span> <span v-html="description"></span></p>
          <p v-if="inventory > 10">In Stock</p>
          <p v-else-if="inventory <= 10 && inventory > 0">Almost Sold Out!</p>
          <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
          <p> Shipping: {{ shipping }} </p>

          <p>Details:</p>
          <product-details :details="details"></product-details>

          <div v-for="(variant,index) in varients"
              :key="variant.variantId"
              class="color-box"
              :style="{backgroundColor: variant.variantColor}"
              @mouseover="updateProductImage(index)">
          </div>

          <button v-on:click="addToCart"
                      :disabled="!inStock"
                      :class="{disabledButton: !inStock}"
                      >
            Add to Cart
          </button>
        </div>
        <div>
          <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul v-else>
                <li v-for="(review, index) in reviews" :key="index">
                  <p>{{ review.name }}</p>
                  <p>Rating:{{ review.rating }}</p>
                  <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>

        <product-review @review-submitted="addReview"></product-review>
      </div>
  `,
  // using a data function to return a clean data object
  // if instead we return a data object , every time we use the component, it would use the same data
  data() {
    return {
        brand: 'Vue Moni-uestery',
        product: 'Socks',
        description: '<span style="color:red"> A pair of warm, fuzzy socks </span>',
        //image: './images/socks.jpeg',
        selectedVariant: 0,
        details: ["80% cottom", "20% polyester", "Gender neutral"],
        //image2: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Siberian-husky.jpg',
        inventory: 0,
        onSale: true,
        varients: [
          {
            variantId: 2234,
            variantColor: "green",
            variantImage: "./images/socks.jpeg",
            variantQuantity: 10
          },
          {
            variantId: 2235,
            variantColor: "blue",
            variantImage: "./images/blue-socks.jpeg",
            variantQuantity: 0
          }
        ],
        reviews: []
      };
    },
    methods: {
      addToCart(){
        this.$emit('add-to-cart', this.varients[this.selectedVariant].variantId);
      },
      updateProductImage(index) {
        this.selectedVariant = index;
      },
      addReview(productReview) {
        this.reviews.push(productReview);
      }
    },
    computed: {
      title() {
        return this.brand + ' ' + this.product;
      },
      image() {
        return this.varients[this.selectedVariant].variantImage;
      },
      inStock() {
        return this.varients[this.selectedVariant].variantQuantity;
      },
      shipping() {
        return this.premium == true ? "Free" : 2.99;
      }
    }
});

var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart(id) {
        this.cart.push(id);
    }
  }
});
