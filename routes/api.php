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

Route::middleware( 'auth:api' )->group( function () {

    Route::get('/user/get-logged-user', 'Api\UserController@getLoggedUser');
    Route::get('/user/orders', 'Api\UserController@getOrders');
    Route::get('/user/favorites', 'Api\UserController@getFavorites');
    Route::post('/email/resend', 'Api\Auth\VerificationController@resend');

  //  Route::post('subscriptions', 'Api\PushSubscriptionController@update');
    // Route::post('subscriptions/delete', 'Api\PushSubscriptionController@destroy');

    Route::get('/categories', 'Api\ProductController@getProducts');
    Route::get('/product/{id}', 'Api\ProductController@getProductDetails');

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
    Route::get('/notify/{id}', 'Api\OrderController@notify');

    Route::middleware( 'is.admin' )->group( function () {

        Route::get('/admin/orders', 'Api\Dashboard\OrderController@index');
        Route::get('/admin/orders/status/{id}', 'Api\Dashboard\OrderController@getOrdersByStatus');
        Route::post('/admin/orders/change-status/{id}', 'Api\Dashboard\OrderController@changeStatus');
    });

});
