<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\VerifiesEmails;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use Exception;

use App\Models\User;

class VerificationController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Email Verification Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling email verification for any
    | user that recently registered with the application. Emails may also
    | be re-sent if the user didn't receive the original email message.
    |
    */

    use VerifiesEmails;

    /**
     * Where to redirect users after verification.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('throttle:10,1')->only('verify', 'resend');
    }

    /**
     * Mark the authenticated user's email address as verified.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     *
     */
    public function verify(Request $request)
    {
        $user = User::where("email", $request->email)->first();

        if (empty($user)) {
            return response()->json( ['msg' => "Nieprawidłowy adres URL (id)."], 422 );
        }

        if (! hash_equals((string) $request->route('id'), (string) $user->getKey())) {
            return response()->json( ['msg' => "Nieprawidłowy adres URL (id)."], 422 );
        }

        if (! hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            return response()->json( ['msg' => "Nieprawidłowy adres URL (hash)."], 422 );
        }

        if ($user->hasVerifiedEmail()) {
            return "Adres e-mail został już wcześniej zweryfikowany.";
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return "Adres e-mail został zweryfikowany.";
    }

    /**
     * Resend the email verification notification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function resend(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json( ['msg' => "Adres e-mail został już wcześniej zweryfikowany."], 424 );
        }

        $request->user()->sendEmailVerificationNotification();

        return "Link do weryfikacji adresu e-mail został wysłany.";
    }

}
