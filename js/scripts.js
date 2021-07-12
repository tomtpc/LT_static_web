
var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace("active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// ************************************************
// Shopping Cart API
// ************************************************

var shoppingCart = (function() {
  // =============================
  // Private methods and propeties
  // =============================
  var cart = [];
  
  // Constructor
  function Item(name, price, count, img) {
    this.name = name;
    this.price = price;
    this.count = count;
	this.img = img;
  }
  
  // Save cart
  function saveCart() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
  }
  
    // Load cart
  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
  }
  if (sessionStorage.getItem("shoppingCart") != null) {
    loadCart();
  }
  

  // =============================
  // Public methods and propeties
  // =============================
  var obj = {};
  
  // Add to cart
  obj.addItemToCart = function(name, price, count,img) {
    for(var item in cart) {
      if(cart[item].name === name) {
        cart[item].count ++;
        saveCart();
        return;
      }
    }
    var item = new Item(name, price, count,img);
    cart.push(item);
    saveCart();
  }
  // Set count from item
  obj.setCountForItem = function(name, count) {
    for(var i in cart) {
      if (cart[i].name === name) {
        cart[i].count = count;
        break;
      }
    }
  };
  // Remove item from cart
  obj.removeItemFromCart = function(name) {
      for(var item in cart) {
        if(cart[item].name === name) {
          cart[item].count --;
          if(cart[item].count === 0) {
            cart.splice(item, 1);
          }
          break;
        }
    }
    saveCart();
  }

  // Remove all items from cart
  obj.removeItemFromCartAll = function(name) {
    for(var item in cart) {
      if(cart[item].name === name) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  }

  // Clear cart
  obj.clearCart = function() {
    cart = [];
    saveCart();
  }

  // Count cart 
  obj.totalCount = function() {
    var totalCount = 0;
    for(var item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  }

  // Total cart
  obj.totalCart = function() {
    var totalCart = 0;
    for(var item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart);
  }
  // Total shipping
  obj.totalShipping = function() {
    var totalPhipping = 0;
    for(var item in cart) {
      totalPhipping += 200000 * cart[item].count;
    }
    return Number(totalPhipping);
  }
  

  // List cart
  obj.listCart = function() {
    var cartCopy = [];
    for(var i in cart) {
      var item = cart[i];
      var itemCopy = {};
      for(var p in item) {
        itemCopy[p] = item[p];

      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy)
    }
    return cartCopy;
  }

  // cart : Array
  // Item : Object/Class
  // addItemToCart : Function
  // removeItemFromCart : Function
  // removeItemFromCartAll : Function
  // clearCart : Function
  // countCart : Function
  // totalCart : Function
  // listCart : Function
  // saveCart : Function
  // loadCart : Function
  return obj;
})();


// *****************************************
// Triggers / Events
// ***************************************** 
// Add item
$('.add-to-cart').click(function(event) {
  event.preventDefault();
  var name = $(this).data('name');
  var price = Number($(this).data('price'));
  var img = $(this).data('img');
  shoppingCart.addItemToCart(name, price, 1,img);
  displayCart();
});

// Clear items
$('.clear-cart').click(function() {
  shoppingCart.clearCart();
  displayCart();
});

function displayCart() {
  var cartArray = shoppingCart.listCart();
  var menu_info="<div class='container' style='text-align: center'>"
  +"<div class='row'>"
  +"<div class='col-sm' style='font-weight: 500'>Name</div>"
  +"<div class='col-sm' style='font-weight: 500'>Preview</div>"
  +"<div class='col-sm' style='font-weight: 500'>Count</div>"
  +"<div class='col-sm' style='font-weight: 500'>Del Func</div>"
  +"<div class='col-sm' style='font-weight: 500'>Total</div>"
  +"</div>";
  var output = menu_info;
  for(var i in cartArray) {
    output +="<div class='row'>"
		+ "<div class='col-sm'>" + cartArray[i].name + "</div>"
		+"<div class='col-sm'><img src='" + cartArray[i].img + "' width='90'/></div>'"
        + "<div class='col-sm'><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name='" 
		+ cartArray[i].name + "'>-</button>"
		+ "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
		+ "<button class='plus-item btn btn-primary input-group-addon' data-name='" + cartArray[i].name + "'>+</button></div></div>"
        + "<div class='col-sm'><button class='delete-item btn btn-danger' type='button' data-name='" + cartArray[i].name + "'>X</button></div>"
        + "<div class='col-sm'>" + (cartArray[i].total).toLocaleString() + "</div>" 
        + "</div>";
  }
	output +="</div>"
	var number = shoppingCart.totalCart();
	var number2 = shoppingCart.totalShipping();
  $('.show-cart').html(output);
  $('.total-cart').html((number).toLocaleString());	
  $('.total-checkout').html((number+number2).toLocaleString());
  $('.total-count').html(shoppingCart.totalCount());
  $('.total-shipping').html((number2).toLocaleString());
}

// Delete item button

$('.show-cart').on("click", ".delete-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
})


// -1
$('.show-cart').on("click", ".minus-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.removeItemFromCart(name);
  displayCart();
})
// +1
$('.show-cart').on("click", ".plus-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.addItemToCart(name);
  displayCart();
})

// Item count input
$('.show-cart').on("change", ".item-count", function(event) {
   var name = $(this).data('name');
   var count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

displayCart();


//Pay method color change
$(document).ready(function(){

$('.radio-group .radio').click(function(){
	$('.radio').addClass('gray');
	$(this).removeClass('gray');
	});
});
