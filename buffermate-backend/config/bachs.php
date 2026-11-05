<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Bachs API Key & Base URL
    |--------------------------------------------------------------------------
    |
    | Supported environments:
    | Sandbox: https://sandbox-api.bachs.io/v1
    | Production: https://api.bachs.io/v1
    |
    */
    'api_key' => env('BACHS_API_KEY', 'bachs_test_key_sandbox'),
    'api_base_url' => env('BACHS_API_BASE_URL', 'https://sandbox-api.bachs.io/v1'),

    /*
    |--------------------------------------------------------------------------
    | Webhook Verification Secret
    |--------------------------------------------------------------------------
    |
    | Used to verify HMAC-SHA256 signatures in the X-Bachs-Signature header.
    |
    */
    'webhook_secret' => env('BACHS_WEBHOOK_SECRET', 'whsec_bachs_sandbox_secret'),

    /*
    |--------------------------------------------------------------------------
    | Default Currency
    |--------------------------------------------------------------------------
    */
    'currency' => env('BACHS_DEFAULT_CURRENCY', 'USD'),

    /*
    |--------------------------------------------------------------------------
    | BufferMate Subscription Plans & Product Cart Mapping
    |--------------------------------------------------------------------------
    */
    'plans' => [
        'pro' => [
            'name' => 'Pro Growth Plan',
            'monthly' => [
                'amount' => 29.00,
                'product_id' => env('BACHS_PRO_MONTHLY_PRODUCT_ID', 'prod_bm_pro_monthly'),
            ],
            'annual' => [
                'amount' => 276.00, // $23/mo billed annually
                'product_id' => env('BACHS_PRO_ANNUAL_PRODUCT_ID', 'prod_bm_pro_annual'),
            ],
        ],
        'agency' => [
            'name' => 'Scale & Agency',
            'monthly' => [
                'amount' => 79.00,
                'product_id' => env('BACHS_AGENCY_MONTHLY_PRODUCT_ID', 'prod_bm_agency_monthly'),
            ],
            'annual' => [
                'amount' => 756.00, // $63/mo billed annually
                'product_id' => env('BACHS_AGENCY_ANNUAL_PRODUCT_ID', 'prod_bm_agency_annual'),
            ],
        ],
    ],
];

