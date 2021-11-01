<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted'             => 'Pole musi zostać zaznaczone.',
    'active_url'           => 'Pole jest nieprawidłowym adresem URL.',
    'after'                => 'Pole musi być datą późniejszą od :date.',
    'after_or_equal'       => 'Pole musi być datą późniejszą lub równą :date.',
    'alpha'                => 'Pole może zawierać jedynie litery.',
    'alpha_dash'           => 'Pole może zawierać jedynie litery, cyfry i myślniki.',
    'alpha_num'            => 'Pole może zawierać jedynie litery i cyfry.',
    'array'                => 'Pole musi być tablicą.',
    'before'               => 'Pole musi być datą wcześniejszą od :date.',
    'before_or_equal'      => 'Pole musi być datą wcześniejszą lub równą :date.',
    'between'              => [
        'numeric' => 'Pole musi zawierać się w granicach :min - :max.',
        'file'    => 'Pole musi zawierać się w granicach :min - :max kilobajtów.',
        'string'  => 'Pole musi zawierać się w granicach :min - :max znaków.',
        'array'   => 'Pole musi składać się z :min - :max elementów.',
    ],
    'boolean'              => 'Pole musi mieć wartość prawda albo fałsz.',
    'confirmed'            => 'Pole musi być potwierdzone.',
    'date'                 => 'Pole nie jest prawidłową datą.',
    'date_equals'          => 'Pole musi być datą równą :date.',
    'date_format'          => 'Pole nie jest w formacie :format.',
    'different'            => 'Pola muszą się różnić.',
    'digits'               => 'Pole musi składać się z :digits cyfr.',
    'digits_between'       => 'Pole musi mieć od :min do :max cyfr.',
    'dimensions'           => 'Pole ma niepoprawne wymiary.',
    'distinct'             => 'Pole ma zduplikowane wartości.',
    'email'                => 'Format pola jest nieprawidłowy.',
    'ends_with'            => 'Pole musi być zakończone frazą: :values.',
    'exists'               => 'Zaznaczone pole jest nieprawidłowe.',
    'file'                 => 'Pole musi być plikiem.',
    'filled'               => 'Pole jest wymagane.',
    'gt' => [
        'numeric'   => 'Pole musi mieć wartość większą niż :value.',
        'file'      => 'Pole musi mieć wartość większą niż :value kilobajtów.',
        'string'    => 'Pole musi mieć wartość większą niż :value znaków.',
        'array'     => 'Kolekcja musi mieć więcej niż :value elementów.',
    ],
    'gte' => [
        'numeric'   => 'Pole musi mieć wartość większą lub równą niż :value.',
        'file'      => 'Pole musi mieć wartość większą lub równą niż :value kilobajtów.',
        'string'    => 'Pole musi mieć wartość większą lub równą niż :value znaków.',
        'array'     => 'Kolekcja musi mieć :value elementów lub więcej.',
    ],
    'image'                => 'Pole musi być obrazkiem.',
    'in'                   => 'Zaznaczone pole jest nieprawidłowe.',
    'in_array'             => 'Pole nie znajduje się w :other.',
    'integer'              => 'Pole musi być liczbą całkowitą.',
    'ip'                   => 'Pole musi być prawidłowym adresem IP.',
    'ipv4'                 => 'Pole musi być prawidłowym adresem IPv4.',
    'ipv6'                 => 'Pole musi być prawidłowym adresem IPv6.',
    'json'                 => 'Pole musi być poprawnym ciągiem znaków JSON.',
    'lt' => [
        'numeric'   => 'Pole musi mieć wartość większą niż :value.',
        'file'      => 'Pole musi mieć wartość większą niż :value kilobajtów.',
        'string'    => 'Pole musi mieć wartość większą niż :value znaków.',
        'array'     => 'Kolekcja musi mieć mniej niż :value elementów.',
    ],
    'lte' => [
        'numeric'   => 'Pole musi mieć wartość większą lub równą :value.',
        'file'      => 'Pole musi mieć wartość większą lub równą :value kilobajtów.',
        'string'    => 'Pole musi mieć wartość większą lub równą :value znaków.',
        'array'     => 'Kolekcja musi mieć :value elementów lub mniej.',
    ],
    'max' => [
        'numeric' => 'Pole nie może być większe niż :max.',
        'file'    => 'Pole nie może być większe niż :max kilobajtów.',
        'string'  => 'Pole nie może być dłuższe niż :max znaków.',
        'array'   => 'Pole nie może mieć więcej niż :max elementów.',
    ],
    'mimes'                => 'Pole musi być plikiem typu :values.',
    'mimetypes'            => 'Pole musi być plikiem typu :values.',
    'min'                  => [
        'numeric' => 'Pole musi być nie mniejsze od :min.',
        'file'    => 'Pole musi mieć przynajmniej :min kilobajtów.',
        'string'  => 'Pole musi mieć przynajmniej :min znaków.',
        'array'   => 'Pole musi mieć przynajmniej :min elementów.',
    ],
    'not_in'               => 'Zaznaczone pole jest nieprawidłowe.',
    'not_regex'            => 'Format pola jest nieprawidłowy.',
    'numeric'              => 'Pole musi być liczbą.',
    'password'             => 'Hasło jest niepoprawne.',
    'present'              => 'Pole musi być teraźniejszy.',
    'regex'                => 'Format pola jest nieprawidłowy.',
    'required'             => 'Pole jest wymagane.',
    'required_if'          => 'Pole jest wymagane.',
    'required_unless'      => 'Pole jest wymagane.',
    'required_with'        => 'Pole jest wymagane.',
    'required_with_all'    => 'Pole jest wymagane.',
    'required_without'     => 'Pole jest wymagane.',
    'required_without_all' => 'Pole jest wymagane.',
    'same'                 => 'Pola muszą się zgadzać.',
    'size'                 => [
        'numeric' => 'Pole musi mieć :size.',
        'file'    => 'Pole musi mieć :size kilobajtów.',
        'string'  => 'Pole musi mieć :size znaków.',
        'array'   => 'Pole musi zawierać :size elementów.',
    ],
    'starts_with'          => 'Wartość pola musi się zaczynać od: :values.',
    'string'               => 'Pole musi być ciągiem znaków.',
    'timezone'             => 'Pole musi być prawidłową strefą czasową.',
    'unique'               => 'Takie pole już występuje w bazie danych.',
    'uploaded'             => 'Nie udało się wysłać :attribute.',
    'url'                  => 'Format pola jest nieprawidłowy.',
    'uuid'                 => 'Wartość musi być poprawnym UUID.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [],

];
