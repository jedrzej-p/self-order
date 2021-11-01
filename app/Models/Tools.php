<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Exception;
use Auth;

class Tools extends Model
{

	public static function GetErrorDetails(Exception $e) {
		$errorCode = $e->getCode();
		$isValidationError = $errorCode === 422 || $errorCode === 432;
        if (!$isValidationError) {
            report( $e );
        }
		$msg = $isValidationError ? $e->getMessage() : 'Wystąpił błąd po stronie serwera aplikacji.';
		$code = empty($errorCode) ? 500 : $errorCode;
		return (object)["json_array" => ['msg' => $msg], "code" => $code];
	}

	public static function generateSignature($order) {
		$content = "continueUrl=" . urlencode("https://selforder.example/summary") . "&";
		$content .= "currencyCode=" . urlencode("PLN") . "&";
 $content .= "customerIp=" . urlencode("123.123.123.123") . "&";
 $content .= "description=" . urlencode("Opis zamówienia") . "&";
 $content .= "merchantPosId=" . urlencode("425910") . "&";
 $content .= "notifyUrl=" . urlencode("http://sklepwms.erpit.pl/notify/" . $order->id) . "&";
	$content .= "products[0].name=" . urlencode("Produkt 1") . "&";
$content .= "products[0].quantity=" . urlencode(1) . "&";
$content .= "products[0].unitPrice=" . urlencode(1000) . "&";
$content .= "totalAmount=" . urlencode(1000) . "&";

$content .= "e8a62aeb55dffec5393ed4c7b1cd51e6";
$result = "sender=" . "425910" . ";";
$result .= "algorithm=" . "SHA-256" . ";";
$result .= "signature=" . hash( "sha256", $content );

        
        
        return $result;

    }

}
