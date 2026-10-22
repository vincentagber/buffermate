<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'gemini' => [
        'api_key' => env('NEWSPILOT_GEMINI_API_KEY', env('GEMINI_API_KEY')),
        'model' => env('NEWSPILOT_GEMINI_MODEL', env('GEMINI_TEXT_MODEL', 'gemini-3.1-flash-lite')),
        'image_model' => env('GEMINI_IMAGE_MODEL', 'gemini-2.5-flash-image'),
    ],

    'facebook' => [
        'app_id' => env('FACEBOOK_APP_ID', '2142089249770942'),
        'app_secret' => env('FACEBOOK_APP_SECRET', 'cd9c5daa6e1bb5cf05b0b43ffa069ee3'),
        'page_id' => env('NEWSPILOT_FB_PAGE_ID', env('FACEBOOK_PAGE_ID', '111006725414026')),
        'page_access_token' => env('NEWSPILOT_FB_PAGE_ACCESS_TOKEN', env('FACEBOOK_PAGE_ACCESS_TOKEN')),
    ],

    'newspilot' => [
        'post_status' => env('NEWSPILOT_POST_STATUS', 'publish'),
        'human_approval_required' => env('NEWSPILOT_HUMAN_APPROVAL_REQUIRED', 0),
        'public_site_url' => env('NEWSPILOT_PUBLIC_SITE_URL', 'https://bokoti.com'),
        'fb_enabled' => env('NEWSPILOT_FB_ENABLED', 1),
    ],

];
