<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Notifications\ResetPassword as ResetPasswordNotification;
use App\Notifications\VerifyEmail as VerifyEmailNotification;
use Laravel\Passport\HasApiTokens;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Exception;
use Auth;
use Validator;
use NotificationChannels\WebPush\HasPushSubscriptions;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, Notifiable, HasPushSubscriptions;

    protected $dates = [ "created_at", "updated_at" ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    { 
        $this->notify(new VerifyEmailNotification);
    }

    public static function GetLogged(Request $request) {
        return $request->user()->toArray(true);
    }

    public static function ValidateRequest(Request $request, $id = null) {
        $exceptRule = empty($id) ? "" : ",{$id}";
        $rules = [
            'email' => "required|string|email|max:255|unique:users,email{$exceptRule}"
        ];
        if (empty($id)) {
            $rules['password'] = 'required|string|min:8|confirmed';
        }
        $request->validate($rules);
    }

}
