const mongoose = require('mongoose')

const cartsSchema = new mongoose.Schema([
  {
    priceTotal: {
      type: Number,
      default: 0,
    },
    quantityTotal: {
      type: Number,
      default: 0,
    },
    products: {
      type: [
        {
          products: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
          },
          quantity: {
            type: Number,
            default: 1,
          },
          id: {
            type: String,
          },
          title: {
            type: String,
          },
          thumbnail: {
            type: String,
          },
        },
      ],
      default: [],
    }
  }
]
)

cartsSchema.post('find', function () {
  this.populate('products.products');
  console.log('hola desde el cartSchema');
});

// cartsSchema.pre('findById', function () {
//   this.populate('products.product');
// });

const cartsModel = mongoose.model('carts', cartsSchema);

module.exports = cartsModel;

