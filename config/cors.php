<?php
return [
    'paths' => ['api/*', 'login', '*'], // Add the paths you want to allow
    'allowed_methods' => ['*'], // Allow all HTTP methods
    'allowed_origins' => ['http://localhost:5173','http://localhost:5174','http://localhost:5175'], // Add your React app's URL
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Allow all headers
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // Set to true if you use cookies or sessions
];
