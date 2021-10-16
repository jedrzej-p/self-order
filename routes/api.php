<?php

use App\Http\Controllers\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

//Auth
Route::post('login', 'Api\Auth\LoginController@login');
Route::post('register', 'Api\Auth\RegisterController@register');
Route::get('logout', 'Api\Auth\LogoutController@logout');


Route::middleware('auth:api')->group(function () {


});
