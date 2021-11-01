<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\URL;

class VerifyEmail extends Notification
{
    /**
     * The callback that should be used to build the mail message.
     *
     * @var \Closure|null
     */
    public static $toMailCallback;

    /**
     * Get the notification's channels.
     *
     * @param  mixed  $notifiable
     * @return array|string
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Build the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        if (static::$toMailCallback) {
            return call_user_func(static::$toMailCallback, $notifiable, $verificationUrl);
        }

        return (new MailMessage)
            ->subject(Lang::get('Weryfikacja adresu e-mail'))
            ->line(Lang::get('Aby zweryfikować ten adres e-mail, należy kliknąć poniższy przycisk.'))
            ->action(Lang::get('Weryfikuj adres e-mail'), $verificationUrl)
            ->line(Lang::get('Jeżeli nie tworzyłeś nowego konta, żadna akcja nie jest wymagana.'));
    }

    /**
     * Get the verification URL for the given notifiable.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function verificationUrl($notifiable)
    {
        $id = $notifiable->getKey();
        $hash = sha1($notifiable->getEmailForVerification());
        $email = $notifiable->getEmailForVerification();
        return url("/email/verify/{$id}/{$hash}/{$email}");
        // return URL::temporarySignedRoute(
        //     'verification.verify',
        //     Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
        //     [
        //         'id' => $notifiable->getKey(),
        //         'hash' => sha1($notifiable->getEmailForVerification()),
        //     ]
        // );
    }

    /**
     * Set a callback that should be used when building the notification mail message.
     *
     * @param  \Closure  $callback
     * @return void
     */
    public static function toMailUsing($callback)
    {
        static::$toMailCallback = $callback;
    }
}
