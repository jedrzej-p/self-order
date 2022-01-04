<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', 'Api\Auth\LoginController@login');
Route::post('/register', 'Api\Auth\RegisterController@register');
Route::post('/password/email', 'Api\Auth\ForgotPasswordController@sendResetLinkEmail');
Route::post('/password/reset', 'Api\Auth\ResetPasswordController@reset');

Route::get('/email/verify/{id}/{hash}/{email}', 'Api\Auth\VerificationController@verify');

Route::post('/notify/{id}', 'Api\OrderController@notify');

Route::middleware( 'auth:api' )->group( function () {
    
    Route::get('/user/get-logged-user', 'Api\UserController@getLoggedUser');
    Route::get('/user/orders', 'Api\UserController@getOrders');
    Route::get('/user/favorites', 'Api\UserController@getFavorites');
    Route::post('/email/resend', 'Api\Auth\VerificationController@resend');

    Route::get('/user', 'Api\UserController@getCurrentUser');
    Route::post('/user/image_delete', 'Api\UserController@image_delete');

  //  Route::post('subscriptions', 'Api\PushSubscriptionController@update');
    // Route::post('subscriptions/delete', 'Api\PushSubscriptionController@destroy');

    Route::get('/categories', 'Api\ProductController@getProducts');
    Route::get('/product/{id}', 'Api\ProductController@getProductDetails');
    Route::post('/search_products', 'Api\ProductController@search_products');
    Route::get('/product/ratings/{id}', 'Api\ProductController@ratings');
    Route::post('/save_rating', 'Api\ProductController@save_rating');
    Route::get('rating/product/{id}', 'Api\ProductController@VerifyProductRating');
    Route::get('/rating/user/product/{id}', 'Api\ProductController@ProductUserRating');
    Route::post('/rating/user/product/update', 'Api\ProductController@ProducerUserRatingUpdate');

    Route::post('/add-to-cart', 'Api\OrderController@addToCart');
    Route::post('/store-cart', 'Api\OrderController@storeCart');
    Route::get('cart', 'Api\OrderController@cart');
    Route::post('/remove-from-cart/{id}', 'Api\OrderController@RemoveFromCart');

    Route::post('/updateAdditionalInformations', 'Api\OrderController@updateAdditionalInformations');
    Route::post('/updateTables', 'Api\OrderController@updateTables');

    Route::get('/tables', 'Api\TableController@index');

    Route::post('favorite-add-product', 'Api\ProductController@addProductToFavorite');
    Route::get('favorite/product/{id}', 'Api\ProductController@VerifyProductFavorite');
    Route::post('favorite-remove-product', 'Api\ProductController@removeProductFromFavorite');

    Route::get('/signature', 'Api\OrderController@getSignature');

    Route::middleware( 'is.admin' )->group( function () {

        Route::get('/admin/orders', 'Api\Dashboard\OrderController@index');
        Route::get('/admin/orders/status/{id}', 'Api\Dashboard\OrderController@getOrdersByStatus');
        Route::post('/admin/orders/change-status/{id}', 'Api\Dashboard\OrderController@changeStatus');

        Route::post('/admin/meals', 'Api\Dashboard\MealController@index');
        Route::get('/admin/meal/edit/{id}', 'Api\Dashboard\MealController@edit');
        Route::post('/admin/meal/update', 'Api\Dashboard\MealController@update');
        Route::get('/admin/meal/categories', 'Api\Dashboard\MealController@categories');
        Route::post('/admin/meal/create', 'Api\Dashboard\MealController@create');
        Route::get('/admin/meal/delete/{id}', 'Api\Dashboard\MealController@delete');


        Route::post('/admin/categories', 'Api\Dashboard\CategoryController@index');
        Route::get('/admin/category/edit/{id}', 'Api\Dashboard\CategoryController@edit');
        Route::post('/admin/category/update', 'Api\Dashboard\CategoryController@update');
        Route::post('/admin/category/create', 'Api\Dashboard\CategoryController@create');
        Route::get('/admin/category/delete/{id}', 'Api\Dashboard\CategoryController@delete');

        Route::post('/admin/users', 'Api\Dashboard\UserController@index');
        Route::post('/admin/user/permission', 'Api\Dashboard\UserController@change_permission');
    });

});
