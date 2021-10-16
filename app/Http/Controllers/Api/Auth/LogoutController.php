<?php
namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class LogoutController extends Controller
{
    public function logout()
    {
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'msg' => 'Wylogowano pomyślnie.'
        ], 200);
    }
}
