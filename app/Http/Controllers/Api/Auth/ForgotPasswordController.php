<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;

use Illuminate\Foundation\Auth\SendsPasswordResetEmails;

use Exception;

class ForgotPasswordController extends Controller
{
    use SendsPasswordResetEmails;

    private function addChangeInfo($email, $ip) {
        try {
            $checkUser = User::where("email", $email)->first();
        } catch (Exception $e) {
            report($e);
        }
    }

    /**
     * Get the response for a successful password reset link.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $response
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    protected function sendResetLinkResponse(Request $request, $response)
    {
        $this->addChangeInfo($request->email, $request->ip());
        return response()->json( trans($response), 200 );
    }

    /**
     * Get the response for a failed password reset link.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $response
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    protected function sendResetLinkFailedResponse(Request $request, $response)
    {
        return response()->json( ['errors' => ['email' => [trans($response)]]], 422 );
    }

}
