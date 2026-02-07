<?php

return [
    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
        'model' => env('GEMINI_MODEL', 'gemini-1.5-flash'),
        'max_output_tokens' => (int) env('GEMINI_MAX_OUTPUT_TOKENS', 1024),
    ],
];
