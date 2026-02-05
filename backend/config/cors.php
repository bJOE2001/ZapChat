<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Allow the Quasar frontend (and other allowed origins) to call the API.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:9000',   // Quasar dev server default
        'http://localhost:9001',
        'http://localhost:8080',
        'http://127.0.0.1:9000',
        'http://127.0.0.1:9001',
        'http://127.0.0.1:8080',
        'https://zapchat-three.vercel.app',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
