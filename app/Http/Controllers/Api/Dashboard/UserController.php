<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(User::where('email', 'like', '%' . $request->search . '%')->get()->toArray());
    }

    public function change_permission(Request $request)
    {
        $user_id = $request->user_id;
        $is_admin = $request->is_admin;

        if($is_admin==0)
        {
            $change_permission = User::where('id', '=', $user_id)->update(['is_admin'=>1]);
        }
        else
        {
            $change_permission = User::where('id', '=', $user_id)->update(['is_admin'=>0]);
        }
    }
}
